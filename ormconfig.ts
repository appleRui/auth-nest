import { User } from 'src/entities/User';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const ormConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'developmentUser',
  password: 'developmentest1',
  database: 'development',
  entities: [User],
  synchronize: true,
};

export default ormConfig;
