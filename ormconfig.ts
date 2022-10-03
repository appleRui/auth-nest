import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const ormConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'developmentUser',
  password: 'developmentest1',
  database: 'development',
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/src/migration/**/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};

export default ormConfig;
