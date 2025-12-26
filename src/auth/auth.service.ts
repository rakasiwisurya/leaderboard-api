import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(username: string, password: string) {
    await this.users.create(username, password);

    return {
      message: 'Success register',
      data: null,
    };
  }

  async login(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const token = this.jwt.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      message: 'Success login',
      data: { token },
    };
  }
}
