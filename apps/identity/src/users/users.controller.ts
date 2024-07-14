import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { EcomResponse } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userServics: UsersService) {}

  @Get('/allUsers')
  @ApiOperation({ summary: 'get all users' })
  async allUsers() {
    const allUsers = await this.userServics.getAllUSers();
    return EcomResponse.Ok(allUsers, 'All Users', 201);
  }

  @Get('/user')
  @ApiOperation({ summary: 'get user by email' })
  async getUser(@Query('email') email: string) {
    const user = await this.userServics.getUserByEmail(email);
    return EcomResponse.Ok(user, 'All Users', 201);
  }
}
