import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMintFieldsToNftTable1773110000000 implements MigrationInterface {
  name = 'AddMintFieldsToNftTable1773110000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "nfts"
      ADD COLUMN "image_cid" character varying(255),
      ADD COLUMN "metadata_cid" character varying(255),
      ADD COLUMN "token_uri" character varying(255),
      ADD COLUMN "tx_hash" character varying(100),
      ADD COLUMN "block_number" bigint
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "nfts"
      DROP COLUMN "block_number",
      DROP COLUMN "tx_hash",
      DROP COLUMN "token_uri",
      DROP COLUMN "metadata_cid",
      DROP COLUMN "image_cid"
    `);
  }
}
