import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  exports: [TypeOrmModule.forRoot(AppDataSource.options)],
})
export class DatabaseModule {}
