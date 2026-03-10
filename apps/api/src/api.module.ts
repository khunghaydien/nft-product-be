import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiService } from './api.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {
  UserEntity,
  NftEntity,
} from '@app/database';
import { NftModule } from './nft/nft.module';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'template_db',
      entities: [
        UserEntity,
        NftEntity,
      ],
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    AuthModule,
    NftModule,
  ],
  providers: [ApiService],
})
export class ApiModule { }
