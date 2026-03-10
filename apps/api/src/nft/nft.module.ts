import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftEntity } from '@app/database';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  imports: [TypeOrmModule.forFeature([NftEntity])],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
