import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailClient } from 'src/notification/mail/mailClient';

@Module({
  imports: [ConfigModule],
  providers: [MailClient],
  exports: [MailClient],
})
export class NotificationModule {}
