import { EmailVerification } from 'src/entities/EmailVerification';
import { User } from 'src/entities/User';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const ormConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'mysql',
  port: Number(process.env.MYSQL_PORT) ?? 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [User, EmailVerification],
  synchronize: true,
};

export default ormConfig;
