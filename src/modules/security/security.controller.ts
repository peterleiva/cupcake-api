import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class SecurityController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.auth.signIn(email, password);
  }
}
