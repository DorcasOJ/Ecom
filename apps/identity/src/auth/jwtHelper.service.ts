import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { configConstant, EcomResponse, Users } from '@app/common';

@Injectable()
export class JwtHelperService {
  constructor(
    @InjectRepository(Users)
    private UserRepo: Repository<Users>,
    private jwTokenService: JwtService,
    private configService: ConfigService,
  ) {}

  async signAccess(payload: {
    userAgent: string;
    ipAddress: string;
    id: string;
    profileId: string;
  }) {
    try {
      return this.jwTokenService.sign(payload, {
        secret: await this.configService.get(configConstant.jwt.access_secret),
        expiresIn: await this.configService.get(configConstant.jwt.access_time),
      });
    } catch (error) {
      throw new ForbiddenException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async signRefresh(payload: {
    userAgent: string;
    ipAddress: string;
    id: string;
  }) {
    try {
      const refreshToken = this.jwTokenService.sign(payload, {
        secret: await this.configService.get(configConstant.jwt.refresh_secret),
        expiresIn: await this.configService.get(
          configConstant.jwt.refresh_time,
        ),
      });

      const user = await this.UserRepo.findOneBy({ id: payload.id });

      await this.UserRepo.update(user.id, {
        ...user,
        refreshToken: refreshToken,
      }).catch((err) => {
        throw new BadRequestException(
          EcomResponse.BadRequest(err.name, err.message),
        );
        // 'This user does not exist'
      });

      return refreshToken;
    } catch (error) {
      throw new ForbiddenException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async googleUserTokens(
    user,
    value: {
      userAgent: string;
      ipAddress: string;
    },
  ) {
    try {
      const refreshObject = {
        userAgent: value.userAgent,
        ipAddress: value.ipAddress,
        profileId: user.profileID,
        id: user.id,
      };
      return {
        access: this.jwTokenService.sign(refreshObject, {
          secret: await this.configService.get(
            configConstant.jwt.access_secret,
          ),
          expiresIn: await this.configService.get(
            configConstant.jwt.access_time,
          ),
        }),
        refresh: this.jwTokenService.sign(refreshObject, {
          secret: await this.configService.get(
            configConstant.jwt.refresh_secret,
          ),
          expiresIn: await this.configService.get(
            configConstant.jwt.refresh_time,
          ),
        }),
      };
    } catch (error) {
      throw new ForbiddenException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async hashPassword(password: string, salt?: string) {
    try {
      if (!salt) salt = randomBytes(32).toString('hex');
      const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString(
        'hex',
      );
      const hashedPassword = `${salt}:${hash}`;
      return hashedPassword;
    } catch (error) {
      throw new ForbiddenException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async getNewTokens(refreshToken: string) {
    try {
      let payload = this.jwTokenService.verify(refreshToken, {
        secret: await this.configService.get(configConstant.jwt.refresh_secret),
      });
      payload = {
        id: payload.id,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      };

      const verified = await this.UserRepo.findOne({
        where: {
          refreshToken: refreshToken,
        },
      });
      if (verified) {
        // add the user profileId to the jwt-payload object before signing the jwt
        payload.profileId = verified.profileID;
        return {
          access: await this.signAccess(payload),
        };
      } else throw new Error();
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(
          'Invalid Refresh Token',
          'Get the correct refresh token and try again',
        ),
      );
    }
  }
  hj;
  async newPasswordHash(passwords: {
    newPassword: string;
    oldPassword: string;
  }) {
    try {
      const salt = randomBytes(32).toString('hex');
      const hash = pbkdf2Sync(
        passwords.newPassword,
        salt,
        1000,
        64,
        'sha512',
      ).toString('hex');
      const hashedPassword = `${salt}:${hash}`;

      /* check if the new password is the same as the old one stored in the database */
      const oldSalt = passwords.oldPassword.split(':')[0];
      const oldHash = passwords.oldPassword.split(':')[1];
      const compareHash = pbkdf2Sync(
        passwords.newPassword,
        oldSalt,
        1000,
        64,
        'sha512',
      ).toString('hex');
      if (oldHash === compareHash) {
        throw new BadRequestException(
          EcomResponse.BadRequest(
            'password Unchanged',
            'New Password should not be the same as old password',
            '400',
          ),
        );
      }
      return hashedPassword;
    } catch (error) {
      throw new ForbiddenException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async signReset(payload: { id: string; userEmail: string }) {
    try {
      const resetToken = this.jwTokenService.sign(payload, {
        secret: await this.configService.get(configConstant.jwt.reset_secret),
        expiresIn: await this.configService.get(configConstant.jwt.reset_time),
      });

      return resetToken;
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async verifyReset(token: string) {
    try {
      const decode = await this.jwTokenService.verify(token, {
        secret: await this.configService.get(configConstant.jwt.reset_secret),
      });
      return decode;
    } catch (error) {
      throw new ForbiddenException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async changeJwtExpiry(token: string) {
    try {
      const { id, userEmail } = await this.jwTokenService.verify(token, {
        secret: await this.configService.get(configConstant.jwt.refresh_secret),
      });
      const expiringToken = this.jwTokenService.sign(
        { id, userEmail },
        {
          secret: await this.configService.get(
            configConstant.jwt.refresh_secret,
          ),
          expiresIn: '5m',
        },
      );
      return expiringToken;
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }
}
