import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftEntity } from '@app/database';
import { NftService } from './nft.service';

@Module({
  imports: [TypeOrmModule.forFeature([NftEntity])],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
