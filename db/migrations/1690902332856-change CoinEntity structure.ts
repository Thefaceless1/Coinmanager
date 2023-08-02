import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCoinEntityStructure1690902332856 implements MigrationInterface {
    name = 'ChangeCoinEntityStructure1690902332856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" ADD "market_cap" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coins" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_coins" DROP CONSTRAINT "FK_3d98912a8afc8e0fa1964080797"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "coins_id_seq" OWNED BY "coins"."id"`);
        await queryRunner.query(`ALTER TABLE "coins" ALTER COLUMN "id" SET DEFAULT nextval('"coins_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "users_coins" ADD CONSTRAINT "FK_3d98912a8afc8e0fa1964080797" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_coins" DROP CONSTRAINT "FK_3d98912a8afc8e0fa1964080797"`);
        await queryRunner.query(`ALTER TABLE "coins" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "coins_id_seq"`);
        await queryRunner.query(`ALTER TABLE "users_coins" ADD CONSTRAINT "FK_3d98912a8afc8e0fa1964080797" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "coins" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "coins" DROP COLUMN "market_cap"`);
    }

}
