import { Module, forwardRef } from '@nestjs/common';
import { HugsService } from './hugs.service';
import { HugsResolver } from './hugs.resolver';
import { HugsController } from './hugs.controller';
import { UsersModule } from '../users/users.module';
// Import Postgraphile Module (it's global, but adding it for clarity)
import { PostGraphileModule } from '../postgraphile/postgraphile.module';
// Import AuthModule for JwtAuthGuard
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => AuthModule), // Use forwardRef to prevent circular dependency
  ],
  controllers: [HugsController],
  providers: [HugsService, HugsResolver],
  exports: [HugsService],
})
export class HugsModule {}