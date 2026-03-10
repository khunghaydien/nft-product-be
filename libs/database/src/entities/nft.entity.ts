import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface NftMetadataAttributes {
  trait_type: string;
  value: string | number;
}

export interface NftMetadataPayload {
  name: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: NftMetadataAttributes[];
  [key: string]: unknown;
}

@Entity('nfts')
export class NftEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Chain token id (e.g. from contract). Unique per chain. */
  @Column({ type: 'varchar', length: 78, unique: true, name: 'token_id', nullable: true })
  tokenId: string | null;

  /** Metadata id from upload-metadata (used before mint when tokenId is assigned). */
  @Column({ type: 'uuid', name: 'metadata_id', nullable: true })
  metadataId: string | null;

  /** Stored metadata (name, description, image, attributes). */
  @Column({ type: 'jsonb', name: 'metadata', nullable: true })
  metadata: NftMetadataPayload | null;

  /** CID của media file upload lên Pinata. */
  @Column({ type: 'varchar', length: 255, name: 'image_cid', nullable: true })
  imageCid: string | null;

  /** CID của metadata JSON upload lên Pinata. */
  @Column({ type: 'varchar', length: 255, name: 'metadata_cid', nullable: true })
  metadataCid: string | null;

  /** Token URI đã dùng khi mint on-chain. */
  @Column({ type: 'varchar', length: 255, name: 'token_uri', nullable: true })
  tokenUri: string | null;

  /** Transaction hash khi mint NFT. */
  @Column({ type: 'varchar', length: 100, name: 'tx_hash', nullable: true })
  txHash: string | null;

  /** Số block chứa transaction mint. */
  @Column({ type: 'bigint', name: 'block_number', nullable: true })
  blockNumber: string | null;

  /** Owner address (wallet or account id). */
  @Column({ type: 'varchar', length: 255, name: 'owner', nullable: true })
  owner: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
