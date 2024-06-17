import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordForgotEmailDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty({ message: 'enter email used for this account' })
  email: string;
}
