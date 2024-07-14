import { UserRole } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserInfo } from '../../users/dto/user-info.dto';

export class SigninUserDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'admin|user' })
  @IsOptional()
  user_role: UserRole.user;

  // @ApiProperty()
  // @IsOptional()
  // userInfo: UserInfo;
}
