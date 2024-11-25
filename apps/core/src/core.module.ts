import { Global, Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'ormconfig';
import { Profile } from '@app/common/database/entities/core/profile.entity';
import { ProfileModule } from './profile/profile.module';
import { ProductsModule } from './products/products.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forFeature([Profile]),
    TypeOrmModule.forRoot(AppDataSource.options),
    ProfileModule,
    ProductsModule,
  ],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
