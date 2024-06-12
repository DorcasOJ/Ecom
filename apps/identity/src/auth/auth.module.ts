import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginHistory, OneTimePassword, Users } from '@app/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailVerificationModule } from '../email-verification/email-verification.module';
import { JwtHelperService } from './jwtHelper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, LoginHistory, OneTimePassword]),
    EmailVerificationModule,
    HttpModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        publicKey: configService.get<string>('PUBLIC_KEY'),
        privateKey: configService.get<string>('PRIVATE_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtService,
    ConfigService,
    JwtHelperService,
    EmailVerificationService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
