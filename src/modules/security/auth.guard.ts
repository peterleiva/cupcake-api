import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(ConfigService) private config: ConfigService,
    private users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      req['user'] = await this.users.getUser(payload.sub);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }

    return true;
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
