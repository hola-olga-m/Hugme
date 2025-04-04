import { Module, forwardRef } from '@nestjs/common';
import { MoodsService } from './moods.service';
import { MoodsResolver } from './moods.resolver';
import { MoodsController } from './moods.controller';
import { UsersModule } from '../users/users.module';
// Import Postgraphile Module (it's global, but adding it for clarity)
import { PostGraphileModule } from '../postgraphile/postgraphile.module';
// Import AuthModule for JwtAuthGuard
import { AuthModule } from '../auth/auth.module';
// Import FriendsModule for friendship validation
import { FriendsModule } from '../friends/friends.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => AuthModule), // Use forwardRef to prevent circular dependency
    FriendsModule, // Import FriendsModule for friendship features
  ],
  controllers: [MoodsController],
  providers: [MoodsService, MoodsResolver],
  exports: [MoodsService],
})
export class MoodsModule {}