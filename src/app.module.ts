import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import ormConfig from 'ormConfig';
import { Connection } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UsersModule],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
