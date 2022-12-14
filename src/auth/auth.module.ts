import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User';
import { AuthService } from 'src/auth/auth.service';
import { LocalStrategy } from 'src/auth/local/local.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { EmailVerification } from 'src/database/entities/EmailVerification';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailVerification]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    ConfigModule,
    NotificationModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
