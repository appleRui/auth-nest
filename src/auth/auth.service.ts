// import * as sendgrid from '@sendgrid/mail';
import * as dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';
import { generate } from 'rand-token';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUp.dto';
import { EmailVerification } from 'src/entities/EmailVerification';
import { find } from 'rxjs';

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
    private configService: ConfigService,
  ) {
    this.MAILGRID_API_KEY = this.configService.get<string>('MAILGRID_API_KEY');
  }

  async searchUser(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.searchUser(email);
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!user || !isMatchPassword)
      throw new HttpException('unAuthorized', HttpStatus.UNAUTHORIZED);
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
      if (error.driverError.errno === 1062) {
        throw new HttpException(
          'The email address you entered is already in use.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'An unexpected error has occurred.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    const saveEmailVerily = await this.emailVerificationRepository.save({
      email: user.email,
      signature: generate(16),
      expiration: dayjs().add(30, 'm').valueOf().toString(),
    });
    return `https://localhost:4000/verify?signature=${saveEmailVerily.signature}&expiration=${saveEmailVerily.expiration}`;
  }

  async verify(params: VerifyParams) {
    const findToken = await this.emailVerificationRepository
      .findOne({
        where: {
          signature: params.signature,
        },
      })
      .catch((error) => {
        console.error(error);
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      });
    if (!dayjs(findToken.expiration).isBefore(dayjs())) {
      throw new HttpException(
        'This is a link whose expiration has been exceeded.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const findUser = await this.userRepository.findOne({
      where: {
        email: findToken.email,
      },
    });
    if (findUser.isVerify === true) {
      throw new HttpException(
        'Already an authorized user.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updateVerifyUser = await this.userRepository.save({
      ...findUser,
      isVerify: true,
    });
    return this.login(updateVerifyUser);
  }
}
