import { EcomResponse, LoginHistory, UserRole, Users } from '@app/common';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepo: Repository<LoginHistory>,
  ) {}

  async getAllUSers() {
    return await this.userRepo.find();
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email: email } });
  }

  // async getAdminUsers(
  //   page: number,
  //   limit: number,
  //   start_date: string,
  // ): Promise<any> {
  //   try {
  //     let query = this.userRepo
  //       .createQueryBuilder('user')
  //       .where('user.isEmailVerified = :isEmailVerified', {
  //         isEmailVerified: true,
  //       });

  //     if (start_date) {
  //       query = query
  //         .andWhere('user.createdOn >= :start_date', {
  //           start_date: new Date(start_date),
  //         })
  //         .andWhere('user.createdOn <= :end_date', { end_date: new Date() });
  //     }
  //     const users = await query
  //       .select(['user.fullName', 'user.email', 'user.createdOn'])
  //       .offset((page - 1) * limit)
  //       .limit(limit)
  //       .getMany();

  //     let countQuery = this.userRepo
  //       .createQueryBuilder('user')
  //       .where('user.isEmailVerified = :isEmailVerified', {
  //         isEmailVerified: true,
  //       });

  //     if (start_date) {
  //       countQuery = countQuery
  //         .andWhere('user.createdOn >= :start_date', {
  //           start_date: new Date(start_date),
  //         })
  //         .andWhere('user.createdOn <= :end_date', { end_date: new Date() });
  //     }

  //     const userCount = await countQuery.getCount();
  //     return {
  //       userCount,
  //       data: users,
  //       pagination: {
  //         total: userCount,
  //         page,
  //         limit,
  //       },
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(
  //       EcomResponse.BadRequest('internal Server error', error.message, '500'),
  //     );
  //   }
  // }

  // async makeUserAnAdmin(id: string): Promise<User> {
  //   try {
  //     const user = await this.userRepo.findOne({
  //       where: { id },
  //     });

  //     if (!user) {
  //       throw new NotFoundException(
  //         EcomResponse.NotFoundRequest(
  //           'Internal server error',
  //           'user not found',
  //           '404',
  //         ),
  //       );
  //     }
  //     await this.userRepo.update(user.id, {
  //       user_role: UserRole.admin,
  //       isAdmin: true,
  //     });
  //     const updatedUser = await this.userRepo.findOne({ where: { id } });
  //     return updatedUser;
  //   } catch (error) {
  //     throw new BadRequestException(
  //       EcomResponse.BadRequest('internal Server error', error.message, '500'),
  //     );
  //   }
  // }

  // async getLoginHistories(id: string): Promise<LoginHistory[]> {
  //   try {
  //     const history = await this.loginHistoryRepo.find({
  //       where: { userId: id },
  //     });

  //     if (!history) {
  //       throw new NotFoundException(
  //         EcomResponse.NotFoundRequest(
  //           'Internal server error',
  //           'user not found',
  //           '404',
  //         ),
  //       );
  //     }

  //     return history;
  //   } catch (error) {
  //     throw new BadRequestException(
  //       EcomResponse.BadRequest('internal Server error', error.message, '500'),
  //     );
  //   }
  // }
}
