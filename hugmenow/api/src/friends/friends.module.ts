import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { UsersModule } from '../users/users.module';
import { PostGraphileModule } from '../postgraphile/postgraphile.module';

@Module({
  imports: [UsersModule, PostGraphileModule],
  providers: [FriendsService, FriendsResolver],
  exports: [FriendsService]
})
export class FriendsModule {}