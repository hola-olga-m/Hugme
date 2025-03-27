import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendsService } from './friends.service';
import { Friendship } from './entities/friendship.entity';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { UpdateFriendshipInput } from './dto/update-friendship.input';

@Resolver(() => Friendship)
export class FriendsResolver {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Friendship)
  async sendFriendRequest(
    @Args('createFriendshipInput') createFriendshipInput: CreateFriendshipInput,
    @Context() context
  ) {
    return this.friendsService.createFriendRequest(createFriendshipInput, context.req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Friendship)
  async respondToFriendRequest(
    @Args('updateFriendshipInput') updateFriendshipInput: UpdateFriendshipInput,
    @Context() context
  ) {
    return this.friendsService.updateFriendship(updateFriendshipInput, context.req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Friendship)
  async updateMoodFollowing(
    @Args('updateFriendshipInput') updateFriendshipInput: UpdateFriendshipInput,
    @Context() context
  ) {
    return this.friendsService.updateFriendship(updateFriendshipInput, context.req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Friendship])
  async myFriends(@Context() context) {
    return this.friendsService.findFriends(context.req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Friendship])
  async pendingFriendRequests(@Context() context) {
    return this.friendsService.findPendingFriendRequests(context.req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Friendship])
  async sentFriendRequests(@Context() context) {
    return this.friendsService.findSentFriendRequests(context.req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  async checkFriendship(
    @Args('userId') userId: string,
    @Context() context
  ) {
    return this.friendsService.areFriends(context.req.user.userId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Friendship])
  async moodFollowing(@Context() context) {
    return this.friendsService.findMoodFollowing(context.req.user.userId);
  }
}