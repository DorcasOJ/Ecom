import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  configConstant,
  EcomResponse,
  OneTimePassword,
  Users,
} from '@app/common';
import { JwtHelperService } from '../auth/jwtHelper.service';
import { VerifyToken } from './interface/verify.interface';
import { SignupOTPDto } from './dto/email-token.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(Users)
    private UserRepo: Repository<Users>,
    @InjectRepository(OneTimePassword)
    private otpRepo: Repository<OneTimePassword>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtHelpers: JwtHelperService,
    private mailerService: MailerService,
  ) {}

  async creatOtp(signupToken: string) {
    const otp = Math.floor(Math.random() * 899999 + 100000).toString();

    const otpSetup = this.otpRepo.create({
      otp: otp,
      signupToken: signupToken,
    });
    return await this.otpRepo.save(otpSetup);
  }

  /*
   * sendVerificationLink - send verification token to a newly registered user
   * @Params: user
   * return - return a http request to send email notification
   */

  async sendVerificationLink(user: Users): Promise<void> {
    try {
      const payload: VerifyToken = { email: user.email };

      const signupToken = this.jwtService.sign(payload, {
        secret: this.configService.get(configConstant.jwt.verify_secret),
        expiresIn: this.configService.get(configConstant.jwt.otp_time),
      });
      const otpSetup = await this.creatOtp(signupToken);
      await this.UserRepo.update(user.id, { ...user, userOTP: otpSetup.otp });
      const url = `${this.configService.get<string>(
        configConstant.baseUrls.decodeTokenUrl,
      )}${otpSetup.otp}`;

      await this.sendMail(user, './confirmation', otpSetup.otp, url);
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  async resendVerificationLink(email: string) {
    try {
      const user = await this.UserRepo.findOne({ where: { email } });
      if (!user.isEmailVerified) {
        this.sendVerificationLink(user);
      }
    } catch (error) {}
  }

  async decodeEmailToken(otpDto: SignupOTPDto) {
    try {
      const otp = await this.otpRepo.findOne({
        where: { otp: otpDto.otp },
      });

      if (otp == null) {
        throw new BadRequestException(
          EcomResponse.BadRequest(
            'Invalid Token',
            'Get the correct token and try again',
            '401',
          ),
        );
      }
      const payload = await this.jwtService.verify(otp.signupToken, {
        secret: this.configService.get(configConstant.jwt.verify_secret),
      });

      //   user email verified
      await this.markEmailAsConfirmed(payload.email);

      //   delete otp from the entity
      await this.otpRepo.delete(otp.id);

      //   create user profile after email is verified...
      const newProfile = await this.createUserProfile(payload.email);

      const user = await this.UserRepo.findOne({
        where: { email: newProfile.email },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'profileID',
          'isEmailVerified',
          'createdOn',
          'updatedOn',
        ],
      });
      return user;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(
          EcomResponse.BadRequest('Verification Failed', error.message, '401'),
        );
      }
      throw new BadRequestException(
        EcomResponse.BadRequest(
          'Invalid Token',
          error,
          // 'Get the correct token and try again',
          '401',
        ),
      );
    }
  }

  async markEmailAsConfirmed(email: string) {
    const user = await this.UserRepo.findOne({ where: { email } });
    user.isEmailVerified = true;
    user.userOTP = null;
    return await this.UserRepo.save(user);
  }

  async createUserProfile(email: string) {
    try {
      const newUser = await this.UserRepo.findOne({
        where: { email: email },
      });
      if (!newUser) {
        throw new NotFoundException(
          EcomResponse.NotFoundRequest(
            'Not Found Error',
            'User email is not found',
            '404',
          ),
        );
      }
      const data = await this.createProfile(newUser);
      // await this.UserRepo.save({ ...newUser, profileID: data.id });
      return data;
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  async createProfile(newUser) {
    const createProfileToken = this.jwtService.sign(
      { userId: newUser.id },
      {
        secret: this.configService.get(configConstant.jwt.access_secret),
        expiresIn: this.configService.get(configConstant.jwt.otp_time),
      },
    );

    const headers = {
      'Content-Type': 'application/json',
      'x-ecom-auth-token': `Bearer ${createProfileToken}`,
    };

    //   make a post request to create a profile for the user...
    const newProfile = this.httpService.post(
      `${this.configService.get<string>(
        configConstant.baseUrls.coreService,
      )}/profile/create`,
      {
        email: newUser.email,
        userId: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      {
        headers: headers,
      },
    );

    const {
      data: { data },
    } = await lastValueFrom(newProfile.pipe());
    return data;
  }

  async sendResetPasswordOtp(user: Users) {
    try {
       // sign a token and check if it already exist
      const resetToken = await this.jwtHelpers.signReset({
        id: user.id,
        userEmail: user.email,
      });
      // if an otp with this signuptoken exists in the db, delete it
      if (resetToken) {
        await this.otpRepo.delete({ signupToken: resetToken });
      }
      const otpSetup = await this.creatOtp(resetToken);

      await this.sendMail(user, './reset', otpSetup.otp, null);
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  async sendMail(user: Users, template: string, otp: string, url: string) {
    return await this.mailerService
      .sendMail({
        to: user.email,
        // from: 'noreply@example.com',
        subject: 'Confirm Email',
        template: template,
        context: {
          name: user.firstName,
          url: url,
          otp: otp,
        },
      })
      .then(() => console.log('successfully sent mail'))
      .catch((err) => console.log(err, 'error sending mail'));
  }

  async getotp() {
    return await this.otpRepo.find();
  }
}
