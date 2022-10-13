import * as dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';
import { generate } from 'rand-token';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/User';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/SignUp.dto';
import { EmailVerification } from 'src/database/entities/EmailVerification';
import {
  badRequestErrorHandle,
  notFoundErrorHandle,
  unAuthorizedErrorHandle,
} from 'src/utils/httpErrorHandleUtils';
import { MailClient } from 'src/notification/mail/mailClient';

type VerifyParams = {
  signature: string;
  expiration: string;
};

@Injectable()
export class AuthService {
  private MAILGRID_API_KEY: string;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly jwtService: JwtService,
    private readonly mailClient: MailClient,
  ) {}

  async searchUser(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) notFoundErrorHandle();
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.searchUser(email);
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!user || !isMatchPassword) unAuthorizedErrorHandle();
    return user;
  }

  async login(user: User) {
    const updateUserRefreshToken = await this.userRepository.save({
      ...user,
      verifyToken: generate(16),
    });
    const payload = {
      name: updateUserRefreshToken.name,
      email: updateUserRefreshToken.email,
      sub: updateUserRefreshToken.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      verifyToken: updateUserRefreshToken.verifyToken,
    };
  }

  async signUp(user: SignUpDto) {
    user.email = user.email.toLowerCase();
    user.password = await bcrypt.hash(user.password, 10);
    await this.userRepository.save(user).catch((error) => {
      if (error.driverError.errno === 1062)
        badRequestErrorHandle(
          'The email address you entered is already in use.',
        );
    });
    const { signature, expiration } =
      await this.emailVerificationRepository.save({
        email: user.email,
        signature: generate(16),
        expiration: dayjs().add(30, 'm').valueOf().toString(),
      });
    this.mailClient.send({
      to: user.email,
      subject: '仮登録完了のお知らせ',
      text: `以下のURLより本登録を行ってください。\nhttp://localhost:4000/auth/verify?signature=${signature}&expiration=${expiration}`,
    });
  }

  async verify(params: VerifyParams) {
    const findToken = await this.emailVerificationRepository
      .findOne({
        where: {
          signature: params.signature,
        },
      })
      .catch(() => notFoundErrorHandle());
    // 有効期限が過ぎていないか検証
    if (!dayjs(findToken.expiration).isBefore(dayjs())) {
      badRequestErrorHandle(
        'This is a link whose expiration has been exceeded.',
      );
    }
    const findUser = await this.userRepository.findOne({
      where: {
        email: findToken.email,
      },
    });
    // 既に認証されているか検証する
    if (findUser.isVerify === true)
      badRequestErrorHandle('Already an authorized user.');
    const updateVerifyUser = await this.userRepository.save({
      ...findUser,
      isVerify: true,
    });
    return this.login(updateVerifyUser);
  }
}
