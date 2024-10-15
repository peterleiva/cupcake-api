import { Controller, Get } from '@nestjs/common';

import { User } from '../users/schemas';
import { Auth, UserParam } from './auth';

@Controller()
export class SecurityController {
  @Auth()
  @Get('profile')
  me(@UserParam() user: User) {
    return user;
  }
}
