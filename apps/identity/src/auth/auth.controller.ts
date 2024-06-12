import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { EcomResponse, Ok } from '@app/common';
import { SignupOTPDto } from '../email-verification/dto/email-token.dto';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { userSignInType } from '@app/common/types';
import { AuthGuard } from '@nestjs/passport';
import { oAuthDto } from './dto/oauth.dto';

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

  @Post('/google')
  @ApiOperation({ summary: 'Google sign in' })
  async gooogleSignIn(
    @Body() dto: oAuthDto,
    @Req() req: Request,
  ): Promise<Ok<userSignInType>> {
    const userSignIn = await this.authService.googleSignin(dto, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
    return EcomResponse.Ok(userSignIn, 'Successfully logged in', 201);
  }
}
