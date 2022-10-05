import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // ユーザー作成時に作成用
  // async create(body: CreateUserDto): Promise<User> {
  //   body.email = body.email.toLowerCase();
  //   body.password = await bcrypt.hash(body.password, 10);
  //   return await this.userRepository.save(body);
  // }

  async findOne(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return user;
  }
}
