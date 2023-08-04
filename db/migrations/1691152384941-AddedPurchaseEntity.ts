import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPurchaseEntity1691152384941 implements MigrationInterface {
    name = 'AddedPurchaseEntity1691152384941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "price" double precision NOT NULL, "purchase_date" date NOT NULL, "count" double precision NOT NULL, "total_price" double precision NOT NULL, "coin_id" integer, "user_id" integer, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id")); COMMENT ON COLUMN "purchases"."price" IS 'price per one coin'; COMMENT ON COLUMN "purchases"."purchase_date" IS 'date of purchase'; COMMENT ON COLUMN "purchases"."count" IS 'number of coins'; COMMENT ON COLUMN "purchases"."total_price" IS 'total price of purchased coins'`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."rank" IS 'coin rank'`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."name" IS 'coin name'`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."symbol" IS 'coin name'`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."price" IS 'current coin price'`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."market_cap" IS 'market cap volume'`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."image" IS 'coin icon'`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_5701a92a7400f0f1ae100750cad" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_5701a92a7400f0f1ae100750cad"`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."image" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."market_cap" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."price" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."symbol" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."name" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "coins"."rank" IS NULL`);
        await queryRunner.query(`DROP TABLE "purchases"`);
    }

}
