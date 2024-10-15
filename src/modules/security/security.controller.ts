import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller()
export class SecurityController {
  constructor(
    private auth: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.auth.signIn(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
