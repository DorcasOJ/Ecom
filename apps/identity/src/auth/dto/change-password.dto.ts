import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Input your current password' })
  @ApiProperty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(6, {
    message: `password is too short. Minimal length is $contraint1 characters, but actual is $value`,
  })
  @MaxLength(12, {
    message: `password is too short. Minimal length is $contraint1 characters, but actual is $value`,
  })
  newPassword: string;
}
