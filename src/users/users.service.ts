import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(username: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.repo.save({ username, password: hash });
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }
}
