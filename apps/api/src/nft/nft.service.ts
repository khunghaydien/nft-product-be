import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { NftEntity, NftMetadataPayload } from '@app/database';
import {
  UploadMetadataDto,
  UploadMetadataResponseDto,
  MintNftDto,
  MintNftResponseDto,
} from './dto';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(NftEntity)
    private readonly nftRepo: Repository<NftEntity>,
  ) {}

  async uploadMetadata(dto: UploadMetadataDto): Promise<UploadMetadataResponseDto> {
    const metadata: NftMetadataPayload = {
      name: dto.name,
      ...(dto.description && { description: dto.description }),
      ...(dto.image && { image: dto.image }),
      ...(dto.external_url && { external_url: dto.external_url }),
      ...(dto.attributes && { attributes: dto.attributes }),
    };
    const record = this.nftRepo.create({
      tokenId: null,
      metadataId: null,
      metadata,
      owner: null,
    });
    const saved = await this.nftRepo.save(record);
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3030';
    return {
      metadataId: saved.id,
      metadataUri: `${baseUrl}/api/nft/metadata/${saved.id}`,
    };
  }

  async mint(dto: MintNftDto): Promise<MintNftResponseDto> {
    const metadataRecord = await this.nftRepo.findOne({
      where: { id: dto.metadataId, tokenId: IsNull() },
    });
    if (!metadataRecord) {
      throw new NotFoundException('Metadata not found or already used for mint');
    }
    const existing = await this.nftRepo.findOne({ where: { tokenId: dto.tokenId } });
    if (existing) {
      throw new ConflictException('Token id already minted');
    }
    const minted = this.nftRepo.create({
      tokenId: dto.tokenId,
      metadataId: dto.metadataId,
      metadata: metadataRecord.metadata,
      owner: dto.owner ?? null,
    });
    const saved = await this.nftRepo.save(minted);
    return {
      tokenId: saved.tokenId!,
      owner: saved.owner,
      metadata: saved.metadata ?? null,
    };
  }

  async findByTokenId(tokenId: string): Promise<MintNftResponseDto> {
    const nft = await this.nftRepo.findOne({ where: { tokenId } });
    if (!nft || nft.tokenId === null) {
      throw new NotFoundException('NFT not found');
    }
    return {
      tokenId: nft.tokenId,
      owner: nft.owner,
      metadata: nft.metadata ?? null,
    };
  }
}
