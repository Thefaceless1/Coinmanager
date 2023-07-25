import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1690103321716 implements MigrationInterface {
    name = 'CreateUserTable1690103321716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '"2023-07-23T09:08:43.850Z"', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."id" IS 'User id'; COMMENT ON COLUMN "users"."login" IS 'User login'; COMMENT ON COLUMN "users"."email" IS 'User email'; COMMENT ON COLUMN "users"."password" IS 'User password'; COMMENT ON COLUMN "users"."create_date" IS 'User creation date'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
