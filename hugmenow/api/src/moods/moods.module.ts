import { Module } from '@nestjs/common';
import { MoodsService } from './moods.service';
import { MoodsResolver } from './moods.resolver';
import { UsersModule } from '../users/users.module';
// Import Postgraphile Module (it's global, but adding it for clarity)
import { PostGraphileModule } from '../postgraphile/postgraphile.module';

@Module({
  imports: [
    UsersModule,
  ],
  providers: [MoodsService, MoodsResolver],
  exports: [MoodsService],
})
export class MoodsModule {}