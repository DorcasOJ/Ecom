import { UserRole } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  Matches,
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

  @ApiProperty({ example: 'JoneDoe1!' })
  @IsString()
  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(6, {
    message:
      'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(20, {
    message:
      'password is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain the following: a capital letter, a number and a special character',
  })
  password: string;
}
export class DeleteUserDto {
  @IsEmail()
  @IsString()
  @ApiProperty({ example: 'JoneDoe@email.com' })
  email: string;
}
