import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users';
import { AuthService } from './auth.service';
import { SecurityController } from './security.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),

      inject: [ConfigService],
    }),
  ],
  controllers: [SecurityController],
  providers: [AuthService],
})
export class SecurityModule {}
