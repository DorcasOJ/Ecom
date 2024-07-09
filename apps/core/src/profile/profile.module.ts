import { Global, Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@app/common/database/entities/core/profile.entity';
import { Users } from '@app/common';
// import { UsersModule } from 'apps/identity/src/users/users.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Profile, Users])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
