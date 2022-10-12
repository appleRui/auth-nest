import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/users.module';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import ormConfig from 'ormconfig';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    UsersModule,
    AuthModule,
    NotificationModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
