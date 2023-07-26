import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1690354665071 implements MigrationInterface {
    name = 'FirstMigration1690354665071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coins" ("id" integer NOT NULL, "rank" integer NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, "price" double precision NOT NULL, CONSTRAINT "PK_af01e5dcef2c05e6385611205c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "coins"`);
    }

}
