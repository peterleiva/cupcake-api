import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserDocument } from '../users/schemas';
import { AuthGuard, AuthService, User } from './auth';

@Controller()
export class SecurityController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.auth.signIn(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  me(@User() user: UserDocument) {
    return user;
  }
}
