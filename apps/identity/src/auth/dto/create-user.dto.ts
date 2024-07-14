import { UserRole } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Jone' })
  @IsString()
  @IsNotEmpty({ message: 'first nme cannot be empty' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'last nme cannot be empty' })
  lastName: string;

  @ApiProperty({ example: 'JoneDoe@email.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'email cannot be empty' })
  email: string;

  // extend later
  @ApiProperty({ example: 'Admin|User' })
  @IsOptional()
  user_role: UserRole.user;

  @ApiProperty({ example: 'JoneDoe' })
  @IsString()
  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(6, {
    message: `password is too short. Minimal length is $contraint1 characters, but actual is $value`,
  })
  @MaxLength(12, {
    message: `password is too short. Minimal length is $contraint1 characters, but actual is $value`,
  })
  password: string;
}

export class DeleteUserDto {
  @IsEmail()
  @IsString()
  @ApiProperty({ example: 'JoneDoe@email.com' })
  email: string;
}
