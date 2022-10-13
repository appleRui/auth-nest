import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1665649702176 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ユーザーテーブルを作成する
    await queryRunner.query(
      `CREATE TABLE \`users\` (
      \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, 
      \`name\` varchar(255) NOT NULL, 
      \`email\` varchar(255) NOT NULL UNIQUE, 
      \`password\` varchar(255) NOT NULL, 
      \`verify_token\` varchar(255) NULL,
      \`is_verify\` tinyint NULL COMMENT '1: Active, 0: Inactive' DEFAULT 0,
      \`update_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
      \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`))`,
    );

    // メール認証用のテーブルを作成する
    await queryRunner.query(
      `CREATE TABLE \`email_verifications\` (
      \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, 
      \`email\` varchar(255) NOT NULL, 
      \`signature\` varchar(16) NOT NULL,
      \`expiration\` varchar(13) NOT NULL,
      \`update_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
      \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('email_verifications');
  }
}
