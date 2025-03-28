import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MoodsService } from './moods.service';
import { Mood } from './entities/mood.entity';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Mood)
export class MoodsResolver {
  constructor(private moodsService: MoodsService) {}

  @Mutation(() => Mood)
  @UseGuards(GqlAuthGuard)
  async createMood(
    @Args('createMoodInput') createMoodInput: CreateMoodInput,
    @CurrentUser() user: User,
  ): Promise<Mood> {
    return this.moodsService.create(createMoodInput, user.id);
  }

  @Query(() => [Mood])
  @UseGuards(GqlAuthGuard)
  async publicMoods(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<Mood[]> {
    return this.moodsService.findPublic(limit, offset);
  }

  @Query(() => [Mood])
  @UseGuards(GqlAuthGuard)
  async userMoods(@CurrentUser() user: User): Promise<Mood[]> {
    return this.moodsService.findByUser(user.id);
  }

  @Query(() => Mood)
  @UseGuards(GqlAuthGuard)
  async mood(@Args('id', { type: () => ID }) id: string): Promise<Mood> {
    return this.moodsService.findOne(id);
  }

  @Query(() => Int)
  @UseGuards(GqlAuthGuard)
  async moodStreak(@CurrentUser() user: User): Promise<number> {
    return this.moodsService.getUserMoodStreak(user.id);
  }
  
  // All references to friendsMoods have been completely removed from the codebase
  // All clients should use publicMoods instead

  @Mutation(() => Mood)
  @UseGuards(GqlAuthGuard)
  async updateMood(
    @Args('updateMoodInput') updateMoodInput: UpdateMoodInput,
    @CurrentUser() user: User,
  ): Promise<Mood> {
    return this.moodsService.update(updateMoodInput.id, updateMoodInput, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeMood(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.moodsService.remove(id, user.id);
  }
}