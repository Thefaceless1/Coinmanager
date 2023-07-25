import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCoinsTable1690287396863 implements MigrationInterface {
    name = 'CreateCoinsTable1690287396863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coins" ("id" SERIAL NOT NULL, "rank" integer NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, "price" integer, CONSTRAINT "PK_af01e5dcef2c05e6385611205c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "create_date" SET DEFAULT '"2023-07-25T12:16:39.141Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "create_date" SET DEFAULT '2023-07-23 12:08:43.85+03'`);
        await queryRunner.query(`DROP TABLE "coins"`);
    }

}
