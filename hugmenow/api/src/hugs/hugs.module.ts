import { Module } from '@nestjs/common';
import { HugsService } from './hugs.service';
import { HugsResolver } from './hugs.resolver';
import { UsersModule } from '../users/users.module';
// Import Postgraphile Module (it's global, but adding it for clarity)
import { PostGraphileModule } from '../postgraphile/postgraphile.module';

@Module({
  imports: [
    UsersModule,
  ],
  providers: [HugsService, HugsResolver],
  exports: [HugsService],
})
export class HugsModule {}