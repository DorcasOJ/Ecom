import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class DeleteUserDto {
  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;
}
