import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedStakingEntity1691996655910 implements MigrationInterface {
    name = 'AddedStakingEntity1691996655910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staking" ("id" SERIAL NOT NULL, "percent" double precision NOT NULL, "count" double precision NOT NULL, "user_id" integer, "coin_id" integer, CONSTRAINT "PK_37377c2d716ef7341fd21d76e78" PRIMARY KEY ("id")); COMMENT ON COLUMN "staking"."percent" IS 'staking percent'; COMMENT ON COLUMN "staking"."count" IS 'coins count'`);
        await queryRunner.query(`ALTER TABLE "staking" ADD CONSTRAINT "FK_61469074a177f5a6228e4eaead3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staking" ADD CONSTRAINT "FK_fc2ff4dbbd31b71433e90dfb1e6" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staking" DROP CONSTRAINT "FK_fc2ff4dbbd31b71433e90dfb1e6"`);
        await queryRunner.query(`ALTER TABLE "staking" DROP CONSTRAINT "FK_61469074a177f5a6228e4eaead3"`);
        await queryRunner.query(`DROP TABLE "staking"`);
    }

}
