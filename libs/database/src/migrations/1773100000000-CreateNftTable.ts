import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNftTable1773100000000 implements MigrationInterface {
  name = 'CreateNftTable1773100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "nfts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token_id" character varying(78),
        "metadata_id" uuid,
        "metadata" jsonb,
        "owner" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_nfts_token_id" UNIQUE ("token_id"),
        CONSTRAINT "PK_nfts_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_nfts_token_id" ON "nfts" ("token_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_nfts_token_id"`);
    await queryRunner.query(`DROP TABLE "nfts"`);
  }
}
