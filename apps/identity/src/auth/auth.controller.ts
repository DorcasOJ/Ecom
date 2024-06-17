import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Headers,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto, DeleteUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { EcomResponse, Ok } from '@app/common';
import { SignupOTPDto } from '../email-verification/dto/email-token.dto';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { userSignInType } from '@app/common/types';
import { OAuthDto } from './dto/oauth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PasswordForgotEmailDto } from './dto/password-forgot.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

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
    @Body() dto: OAuthDto,
    @Req() req: Request,
  ): Promise<Ok<userSignInType>> {
    const userSignIn = await this.authService.googleSignin(dto, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
    return EcomResponse.Ok(userSignIn, 'Successfully logged in', 201);
  }

  @Post('/signout')
  @ApiOperation({ summary: 'signout a user' })
  async signOutUser(@Headers('authorisation') refreshToken: string) {
    await this.authService.signout(refreshToken);
    return EcomResponse.Ok('success', 'Logged out successfully', '200');
  }

  s

  @Post('/forgot')
  @ApiOperation({ summary: 'Submit registered email for password reset' })
  async forgotPassword(
    @Body() body: PasswordForgotEmailDto,
  ): Promise<Ok<string[]>> {
    const response = await this.authService.forgetPassword(body.email);
    return EcomResponse.Ok(
      response,
      "A Reset Link has been sent to the user's registered email",
      '200',
    );
  }

  @Post('/reset')
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() body: PasswordResetDto) {
    const updateduser = await this.authService.resetPassword(body);
    return EcomResponse.Ok(
      updateduser,
      'user password reset successful',
      '200',
    );
  }

  @Delete('/delete-user')
  @ApiOperation({ summary: 'Delete a user' })
  async deleteUserr(@Body() { email }: DeleteUserDto) {
    await this.authService.deletUser(email);
    return EcomResponse.Ok('user deleted successfully', '200');
  }
}
