import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
// Import Postgraphile Module (it's global, but adding it for clarity)
import { PostGraphileModule } from '../postgraphile/postgraphile.module';

@Module({
  imports: [], // No longer using TypeOrmModule.forFeature
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}