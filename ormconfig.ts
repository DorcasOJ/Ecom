import { entities } from '@app/common/database/entities/init';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

ConfigModule.forRoot();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: entities,
  // [__dirname + '/**/*.entity{.ts,.js}'],
  // logging: true,
  // migrations: ['dist/src/database/migration/*.js'],
  synchronize: true,
});
