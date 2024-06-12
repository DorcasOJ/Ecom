import { Users } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
  ) {}

  async getAllUSers() {
    return await this.userRepo.find();
  }
}
