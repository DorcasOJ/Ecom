import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'input refresh token' })
  @ApiProperty({ description: 'input refresh token' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Input your current password' })
  @ApiProperty({ description: 'Input your current password' })
  oldPassword: string;

  @IsString()
  @ApiProperty({ description: 'Input your new password' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(6, {
    message: `password is too short. Minimal length is $contraint1 characters, but actual is $value`,
  })
  @MaxLength(12, {
    message: `password is too short. Minimal length is $contraint1 characters, but actual is $value`,
  })
  newPassword: string;
}
