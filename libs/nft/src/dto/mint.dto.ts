import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MintNftDto {
  @ApiProperty({
    description: 'Tên NFT hiển thị trên marketplace',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết sản phẩm/NFT',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description:
      'Link ngoài (website sản phẩm, landing page, v.v.) sẽ được nhúng trong metadata',
  })
  @IsString()
  @IsOptional()
  externalUrl?: string;

  @ApiPropertyOptional({
    description:
      'Chuỗi JSON attributes (ví dụ: [{ "trait_type": "Brand", "value": "XYZ" }])',
  })
  @IsString()
  @IsOptional()
  attributesJson?: string;
}

