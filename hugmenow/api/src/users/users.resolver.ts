import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('limit', { type: () => Number, nullable: true }) limit?: number,
    @Args('offset', { type: () => Number, nullable: true }) offset?: number,
  ): Promise<User[]> {
    return this.usersService.findAll(search, limit, offset);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User> {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    try {
      return await this.usersService.findOne(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(user.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeUser(@CurrentUser() user: User): Promise<boolean> {
    return this.usersService.remove(user.id);
  }
}