import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const ormConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) ?? 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['dist/src/database/entities/**/*.js'],
  migrations: ['dist/src/database/migrations/**/*.js'],
};

export default ormConfig;
