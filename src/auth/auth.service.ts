import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(username: string, password: string) {
    const user = await this.users.create(username, password);
    return this.sign(user);
  }

  async login(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    return this.sign(user);
  }

  private sign(user: User) {
    return {
      access_token: this.jwt.sign({
        sub: user.id,
        username: user.username,
        role: user.role,
      }),
    };
  }
}
