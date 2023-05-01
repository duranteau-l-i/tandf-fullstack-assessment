import {MigrationInterface, QueryRunner} from "typeorm";

export class update1682878797469 implements MigrationInterface {
    name = 'update1682878797469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "startTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "startTimeUtc"`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "startTimeUtc" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "endTimeUtc"`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "endTimeUtc" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "endTimeUtc"`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "endTimeUtc" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "startTimeUtc"`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "startTimeUtc" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "startTime" character varying NOT NULL`);
    }

}
