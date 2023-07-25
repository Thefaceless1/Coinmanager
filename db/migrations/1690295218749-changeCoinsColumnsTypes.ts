import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCoinsColumnsTypes1690295218749 implements MigrationInterface {
    name = 'ChangeCoinsColumnsTypes1690295218749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "create_date" SET DEFAULT '"2023-07-25T14:27:00.998Z"'`);
        await queryRunner.query(`ALTER TABLE "coins" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "coins_id_seq"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "coins_id_seq" OWNED BY "coins"."id"`);
        await queryRunner.query(`ALTER TABLE "coins" ALTER COLUMN "id" SET DEFAULT nextval('"coins_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "create_date" SET DEFAULT '2023-07-25 17:21:03.906+03'`);
    }

}
