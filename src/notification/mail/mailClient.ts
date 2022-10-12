import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgrid from '@sendgrid/mail';

@Injectable()
export class MailClient {
  private sendGridInstance: sendgrid.MailService;
  MAILGRID_API_KEY: string;
  FORM_EMAIL: string;
  constructor(private configService: ConfigService) {
    this.MAILGRID_API_KEY = this.configService.get<string>('MAILGRID_API_KEY');
    this.FORM_EMAIL = this.configService.get<string>('FORM_EMAIL');
    this.sendGridInstance = sendgrid;
    this.sendGridInstance.setApiKey(this.MAILGRID_API_KEY);
  }

  send({
    to,
    subject,
    message,
  }: {
    to: string;
    subject: string;
    message: string;
  }): void {
    this.sendGridInstance.send({
      to,
      from: this.FORM_EMAIL ?? 'test@example.com',
      subject,
      text: message,
      html: `<a href=${message}>登録を完了する</a>`,
    });
  }
}
