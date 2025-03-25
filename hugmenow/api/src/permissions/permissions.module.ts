import { Module, forwardRef } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ShieldMiddleware } from './shield.middleware';
import { ContextBuilder } from './context.builder';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { MoodsModule } from '../moods/moods.module';
import { HugsModule } from '../hugs/hugs.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'hugmenow-secret',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => MoodsModule),
    forwardRef(() => HugsModule),
  ],
  providers: [PermissionsService, ShieldMiddleware, ContextBuilder],
  exports: [PermissionsService, ShieldMiddleware, ContextBuilder],
})
export class PermissionsModule {}