import { SignupOTPDto } from './../email-verification/dto/email-token.dto';
// import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  configConstant,
  EcomResponse,
  LoginHistory,
  OneTimePassword,
  Users,
} from '@app/common';
import { JwtHelperService } from './jwtHelper.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserInfo } from '../users/dto/user-info.dto';
import { OAuthDto } from './dto/oauth.dto';
// import { Auth, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import { PasswordResetDto } from './dto/password-reset.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(LoginHistory)
    private userHistoryRepo: Repository<LoginHistory>,
    @InjectRepository(OneTimePassword)
    private otpRepo: Repository<OneTimePassword>,
    private jwtHelperService: JwtHelperService,
    private emailVerificationService: EmailVerificationService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async signup(user: CreateUserDto): Promise<any> {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (userExists) {
        if (userExists.isEmailVerified) {
          throw new BadRequestException(
            EcomResponse.BadRequest(
              'Duplicate Values',
              'The Email already exist',
              '400',
            ),
          );
        } else {
          await this.emailVerificationService.sendVerificationLink(userExists);
          throw new UnauthorizedException(
            EcomResponse.BadRequest(
              'Access Denied!',
              'User Already exist, check your email to complete the signup',
              '401',
            ),
          );
        }
      }

      const newUser = this.userRepository.create(user);
      const savedUser = await this.userRepository.save(newUser);
      await this.emailVerificationService.sendVerificationLink(savedUser);

      return await this.userRepository.findOne({ where: { id: savedUser.id } });
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
    // const userData = Object.assign(new Users(), user);
  }

  async login(
    dto: SigninUserDto,
    values: {
      userAgent: string;
      ipAddress: string;
      // browser_name: string;
      // os_name: string;
    },
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (!user)
        throw new BadRequestException(
          EcomResponse.BadRequest('Not found', 'Invalid Credentials!'),
        );

      // check if email is verified
      if (!user.isEmailVerified) {
        await this.emailVerificationService.sendVerificationLink(user);
        return { ...user, isEmailVerified: false };
      }

      // compare password if email is verified
      const hash = await this.jwtHelperService.hashPassword(
        dto.password,
        user.password.split(':')[0],
      );
      const isPasswordCorrect = hash == user.password;
      if (!isPasswordCorrect)
        throw new BadRequestException(
          EcomResponse.BadRequest('Access Denied', 'Incorrect Credentials'),
        );

      // generate access and refresh token for login user
      const tokens = await this.getNewRefreshAndAccessTokens(user, values);

      // add to user history
      const createHistory = this.userHistoryRepo.create({
        ip_address: values.ipAddress,
        // browser_name: values.browser_name,
        // os_name: values.browser_name,
        history: user,
      });
      await this.userHistoryRepo.save(createHistory);

      // add refresh token to db and update
      user.refreshToken = tokens.refresh;
      await this.userRepository.update(user.id, {
        refreshToken: user.refreshToken,
      });

      return {
        ...tokens,
        userId: user.id,
        profileId: user.profileID,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: true,
      };
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async getNewRefreshAndAccessTokens(
    user,
    values: {
      userAgent: string;
      ipAddress: string;
    },
  ) {
    try {
      const refreshAcessObject = {
        userAgent: values.userAgent,
        ipAddress: values.ipAddress,
        profileId: user.profileID,
        // isAdmin: user.isAdmin,
        id: user.id,
      };
      return {
        access: await this.jwtHelperService.signAccess(refreshAcessObject),
        refresh: await this.jwtHelperService.signRefresh({
          userAgent: refreshAcessObject.userAgent,
          ipAddress: refreshAcessObject.ipAddress,
          id: refreshAcessObject.id,
        }),
      };
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async getNewTokens(refreshToken: string) {
    return await this.jwtHelperService.getNewTokens(refreshToken);
  }

  async createLoginHistory(userInfo: UserInfo, user: Users) {
    const createHistory = this.userHistoryRepo.create({
      // login_time: userInfo.login_time,
      // country: userInfo.country,
      ip_address: userInfo.ip_address,
      // browser_name: userInfo.browser_name,
      // os_name: userInfo.os_name,
      history: user,
    });
    await this.userHistoryRepo.save(createHistory);
  }

  /**
   * it create a user with a correct crendentials from the decoded token
   * @param dto - object containing token
   * @param values - an object containing userAgent and IpAddress of the user
   * @returns {userSignInType} object containing information about the signin user
   */

  async googleSignin(
    dto: OAuthDto,
    values: { userAgent: string; ipAddress: string },
  ) {
    try {
      const client = new OAuth2Client(
        this.configService.get(configConstant.google.clientID),
        this.configService.get(configConstant.google.secretID),
      );
      const getTokenFromClient = await client.getToken(dto.token);
      const verifyClientToken = await client.verifyIdToken({
        idToken: getTokenFromClient.tokens.id_token,
        audience: await this.configService.get(configConstant.google.clientID),
      });
      const { name, email } = verifyClientToken.getPayload();

      // find existing user
      const googleUser = await this.userRepository.findOne({
        where: { email },
      });

      if (!googleUser) {
        const googleUser = this.userRepository.create({
          id: uuidv4(),
          email: email,
          firstName: name.split(' ')[0],
          lastName: name.split(' ')[1],
          isGoogleAuthUser: true,
          isEmailVerified: true,
          userOTP: null,
        });
        const newUser = await this.userRepository.save(googleUser);

        await this.emailVerificationService.createProfile(newUser);
        const tokens = await this.jwtHelperService.googleUserTokens(
          googleUser,
          values,
        );
        await this.userRepository.update(newUser.id, {
          refreshToken: tokens.refresh,
        });
        this.createLoginHistory(dto.userInfo, newUser);

        return {
          ...tokens,
          userId: newUser.id,
          profileId: newUser.profileID,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isEmailVerified: newUser.isEmailVerified,
        };
      } else {
        const tokens = await this.jwtHelperService.googleUserTokens(
          googleUser,
          values,
        );
        this.createLoginHistory(dto.userInfo, googleUser);
        googleUser.refreshToken = (await tokens).refresh;
        return {
          ...tokens,
          userId: googleUser.id,
          profileId: googleUser.profileID,
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          isEmailVerified: googleUser.isEmailVerified,
        };
      }
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async signout(token: string) {
    try {
      const refreshToken = token.split(' ')[1];
      const user = await this.userRepository.findOne({
        where: { refreshToken: refreshToken },
      });
      if (!user)
        throw new BadRequestException(
          EcomResponse.BadRequest(
            'Invalid Refresh Token',
            'Get the correct refresh token and try again',
          ),
        );

      const expiringToken = await this.jwtHelperService.changeJwtExpiry(
        refreshToken,
      );
      await this.userRepository.update(user.id, {
        refreshToken: null || expiringToken,
      });
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async changePassword(token: string, dto: ChangePasswordDto) {
    const refreshToken = token.split(' ')[1];
    try {
      const { id, password } = await this.userRepository.findOne({
        where: { refreshToken: refreshToken },
      });

      const currentPasswordHash = password;
      const oldPasswordHash = await this.jwtHelperService.hashPassword(
        dto.oldPassword,
        password.split(':')[0],
      );
      if (currentPasswordHash !== oldPasswordHash) {
        throw new BadRequestException(
          EcomResponse.BadRequest(
            'Access Denied',
            'provide a new password',
            '401',
          ),
        );
      }
      const newPasswordHash = await this.jwtHelperService.hashPassword(
        dto.newPassword,
        password.split(':')[0],
      );
      return await this.userRepository.update(id, {
        password: newPasswordHash,
      });
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async forgetPassword(email: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException(
          EcomResponse.NotFoundRequest(
            'Not Found',
            'email does not exist on the server',
            '404',
          ),
        );
      }
      // sign a token and check if it already exist
      const existingToken = await this.jwtHelperService.signReset({
        id: user.id,
        userEmail: user.email,
      });

      // if an otp with this signuptoken exists in the db, delete it
      if (existingToken) {
        await this.otpRepo.delete({ signupToken: existingToken });
      }
      const otp = Math.floor(Math.random() * 899999 + 100000).toString();

      const emailPayload = {
        user: user,
        otp: otp,
      };

      const success = await this.emailVerificationService.sendResetPasswordOtp(
        emailPayload,
      );

      return [user.id, success];
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async resetPassword(body: PasswordResetDto): Promise<Users> {
    try {
      const { otp, password } = body;

      const otpDoc = await this.otpRepo.findOne({ where: { otp: otp } });
      if (!otpDoc) {
        throw new BadRequestException(
          EcomResponse.BadRequest(
            'Not Found Error',
            'Incorrect OTP entered',
            '400',
          ),
        );
      }
      const { signupToken } = otpDoc;
      const { id } = await this.jwtHelperService.verifyReset(signupToken);
      const user: Users = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(
          EcomResponse.NotFoundRequest(
            'Not Found Error',
            'User does not exist on the server',
            '404',
          ),
        );
      }
      const passwordPayload = {
        newPassword: password,
        oldPassword: user.password,
      };
      const hashedPassword = await this.jwtHelperService.newPasswordHash(
        passwordPayload,
      );
      await this.userRepository.update(id, { password: hashedPassword });
      await this.otpRepo.delete({ otp: otp });

      return user;
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async deletUser(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(
          EcomResponse.NotFoundRequest(
            'Useer Not Found',
            'User does not exist on the server',
            '404',
          ),
        );
      }
      //  send Delete request to the profile service to delete the user profile
      // const coreUrl = `${this.configService.get<string>(
      //   configConstant.baseUrls.coreService,
      // )}/profile/${user.profileID}`;

      // console.log('connecting to core profile ...');
      // const profileResponse = await this.httpService
      //   .axiosRef({
      //     method: 'delete',
      //     url: coreUrl,
      //   })
      //   .catch((error) => {
      //     throw new BadRequestException(
      //       EcomResponse.BadRequest(error.name, error.message, error.status),
      //     );
      //   });

      // const profileResponse = await this.httpService.axiosRef
      //   .delete(coreUrl)
      //   .catch((err) => console.log(err.response));
      // console.log(profileResponse);
      // if (profileResponse.status !== 200) {
      //   throw new BadRequestException(
      //     EcomResponse.BadRequest(
      //       'Profile Not deleted',
      //       'Error occured while deleting user Profile',
      //       '400',
      //     ),
      //   );
      // }

      return await this.userRepository.delete({ email });
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }
}
