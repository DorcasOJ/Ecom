import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'enter your email' })
  email: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Enter your First name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Enter your last name' })
  lastName: string;
}
