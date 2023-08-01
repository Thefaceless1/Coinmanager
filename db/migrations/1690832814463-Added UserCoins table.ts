import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserCoinsTable1690832814463 implements MigrationInterface {
    name = 'AddedUserCoinsTable1690832814463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_coins" ("user_id" integer NOT NULL, "coin_id" integer NOT NULL, CONSTRAINT "PK_90daf4e7ca5dc17c122b905ba83" PRIMARY KEY ("user_id", "coin_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bd284ec4e713c5b5056a4756fe" ON "users_coins" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d98912a8afc8e0fa196408079" ON "users_coins" ("coin_id") `);
        await queryRunner.query(`ALTER TABLE "users_coins" ADD CONSTRAINT "FK_bd284ec4e713c5b5056a4756fed" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_coins" ADD CONSTRAINT "FK_3d98912a8afc8e0fa1964080797" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_coins" DROP CONSTRAINT "FK_3d98912a8afc8e0fa1964080797"`);
        await queryRunner.query(`ALTER TABLE "users_coins" DROP CONSTRAINT "FK_bd284ec4e713c5b5056a4756fed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d98912a8afc8e0fa196408079"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd284ec4e713c5b5056a4756fe"`);
        await queryRunner.query(`DROP TABLE "users_coins"`);
    }

}
