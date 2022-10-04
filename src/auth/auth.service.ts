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

  async searchUser(name: string) {
    const user = await this.userRepository.findOne({
      where: {
        name,
      },
    });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  async validateUser(name: string, password: string): Promise<User> {
    const user = await this.searchUser(name);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      return user;
    }
    return undefined;
  }

  async login(user: User) {
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
