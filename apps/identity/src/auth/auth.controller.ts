import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { EcomResponse, Ok } from '@app/common';
import { SignupOTPDto } from '../email-verification/dto/email-token.dto';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { userSignInType } from '@app/common/types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a user' })
  async signup(@Body() user: CreateUserDto): Promise<any> {
    const User = await this.authService.signup(user);
    return EcomResponse.Ok<object>(User, 'User created', '201');
  }

  @Post('/login')
  @ApiOperation({ summary: 'Sign in a user' })
  async login(
    @Body() dto: SigninUserDto,
    @Req() req: Request,
  ): Promise<Ok<userSignInType>> {
    // console.log('req', req);
    const userLogin = await this.authService.login(dto, {
      userAgent: req.headers['user-agent'],
      ipAddress: req['ip'],
    });
    return EcomResponse.Ok(userLogin, 'Successfully logged In', '201');
  }

  // @Post('/google')
  // @UseGuards(AuthGuard('google'))
  // @ApiOperation({ summary: 'google user signin' })
  // async googleSignIn() {}

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleLoginCallback(@Request() req, @Res() res: Response) {
  //   console.log('req', req);
  //   console.log('res', res);
  //   const result = this.authService.googleSignin();
  //   return result;
  // }
}
