import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compare } from './hash';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<string> {
    try {
      const user = await this.userService.getUserbyEmail(email);

      if (!user || !password || !compare(password, user.digest)) {
        throw new UnauthorizedException();
      }

      const payload = { sub: user._id };

      return this.jwtService.signAsync(payload);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }
}
