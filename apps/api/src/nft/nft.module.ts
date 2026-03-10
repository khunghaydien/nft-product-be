import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftEntity } from '@app/database';
import { NftModule as NftLibModule } from '@app/nft';
import { NftController } from './nft.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NftEntity]), NftLibModule],
  controllers: [NftController],
})
export class NftModule { }
