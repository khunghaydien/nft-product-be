import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { NftService } from '@app/nft';
import { MintNftDto } from '@app/nft/dto/mint.dto';

@ApiTags('nft')
@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) { }

  @Post('mint')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Mint NFT: upload media + metadata, tự động push lên Pinata và mint',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string' },
        description: { type: 'string' },
        externalUrl: { type: 'string' },
        attributesJson: {
          type: 'string',
          description:
            'Chuỗi JSON attributes (ví dụ: [{ "trait_type": "Brand", "value": "XYZ" }])',
        },
      },
      required: ['file', 'name'],
    },
  })
  async mint(@UploadedFile() file: any, @Body() dto: MintNftDto): Promise<any> {
    return this.nftService.mintFromUpload({
      file,
      name: dto.name,
      description: dto.description,
      externalUrl: dto.externalUrl,
      attributesJson: dto.attributesJson,
    });
  }
}

