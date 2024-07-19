import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { EmailVerificationService } from './email-verification.service';
import { EcomResponse } from '@app/common';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Get('/confirm')
  @ApiOperation({ summary: 'verify your email' })
  async verifyEmail(@Query('otp') otp: string) {
    const user = await this.emailVerificationService.decodeEmailToken({
      otp: otp,
    });
    return EcomResponse.Ok<object>({ user }, 'Profile created', '201');
  }

  @Get('/getotp')
  @ApiOperation({ summary: 'Get all otps' })
  async getotp() {
    const users = await this.emailVerificationService.getotp();
    return EcomResponse.Ok(users, 'done', 200);
  }

}
