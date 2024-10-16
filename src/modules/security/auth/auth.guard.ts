import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UsersService } from '../../users';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private users: UsersService,
    @Inject(ConfigService) private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.users.getUser(payload.sub);
      req.user = user;

      return !!user;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }

  private extractToken(req: Request): string | null {
    const token = req.headers.authorization;

    if (!token) {
      return null;
    }

    const parts = token.split(' ');

    if (parts.length !== 2) {
      return null;
    }

    const [scheme, credentials] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return null;
    }

    return credentials;
  }
}
