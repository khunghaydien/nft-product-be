import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NftService } from './nft.service';
import { UploadMetadataDto, UploadMetadataResponseDto, MintNftDto, MintNftResponseDto } from './dto';

@ApiTags('nft')
@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post('upload-metadata')
  @ApiOperation({ summary: 'Upload NFT metadata (name, description, image, attributes)' })
  async uploadMetadata(
    @Body() dto: UploadMetadataDto,
  ): Promise<UploadMetadataResponseDto> {
    return this.nftService.uploadMetadata(dto);
  }

  @Post('mint')
  @ApiOperation({ summary: 'Mint NFT with token id and optional owner' })
  async mint(@Body() dto: MintNftDto): Promise<MintNftResponseDto> {
    return this.nftService.mint(dto);
  }

  @Get(':tokenId')
  @ApiOperation({ summary: 'Get NFT by token id' })
  async getByTokenId(@Param('tokenId') tokenId: string): Promise<MintNftResponseDto> {
    return this.nftService.findByTokenId(tokenId);
  }
}
