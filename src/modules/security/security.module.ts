import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { SecurityController } from './security.controller';

@Module({
  imports: [AuthModule],
  controllers: [SecurityController],
  providers: [],
  exports: [],
})
export class SecurityModule {}
