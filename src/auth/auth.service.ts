import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { generate } from 'rand-token';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUp.dto';

@Injectable()
export class AuthService {
  private MAILGRID_API_KEY: string;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
      new HttpException('unAuthorized', HttpStatus.UNAUTHORIZED);
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
    const saveUser = await this.userRepository.save(user);
    await axios.request({
      method: 'post',
      url: 'https://api.sendgrid.com/v3/mail/send',
      headers: {
        Authorization: `Bearer ${this.MAILGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {},
    });
    return this.MAILGRID_API_KEY;
    // return this.login(saveUser);
  }
}
