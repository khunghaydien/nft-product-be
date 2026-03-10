import { IsString, IsOptional, IsArray, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NftAttributeDto {
  @ApiProperty({ example: 'Background' })
  @IsString()
  trait_type: string;

  @ApiProperty({ example: 'Blue' })
  value: string | number;
}

export class UploadMetadataDto {
  @ApiProperty({ example: 'My NFT #1' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'A unique digital collectible' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.png' })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsUrl()
  external_url?: string;

  @ApiPropertyOptional({ type: [NftAttributeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NftAttributeDto)
  attributes?: NftAttributeDto[];
}

export class UploadMetadataResponseDto {
  @ApiProperty({ description: 'Metadata record id to use when minting' })
  metadataId: string;

  @ApiProperty({ description: 'URI to reference this metadata (e.g. for contract)' })
  metadataUri: string;
}
