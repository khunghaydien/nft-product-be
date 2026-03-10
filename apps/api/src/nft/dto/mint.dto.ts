import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MintNftDto {
  @ApiProperty({ description: 'ID from upload-metadata response' })
  @IsUUID()
  metadataId: string;

  @ApiProperty({ description: 'Token id assigned by the chain/contract' })
  @IsString()
  tokenId: string;

  @ApiPropertyOptional({ description: 'Owner address or account id' })
  @IsOptional()
  @IsString()
  owner?: string;
}

export class MintNftResponseDto {
  @ApiProperty()
  tokenId: string;

  @ApiProperty({ description: 'Owner address or account id' })
  owner: string | null;

  @ApiProperty({ description: 'Metadata (name, description, image, attributes)' })
  metadata: Record<string, unknown> | null;
}
