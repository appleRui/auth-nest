import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async searchUser(email: string) {
    console.log('searchUser');
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
    if (user && isMatchPassword) {
      return user;
    }
    return undefined;
  }

  async login(user: User) {
    const payload = { name: user.name, email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
