import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import ormConfig from 'ormConfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UsersModule, AuthModule],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
