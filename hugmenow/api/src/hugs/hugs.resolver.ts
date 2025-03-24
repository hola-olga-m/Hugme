import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HugsService } from './hugs.service';
import { Hug } from './entities/hug.entity';
import { HugRequest } from './entities/hug-request.entity';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver()
export class HugsResolver {
  constructor(private hugsService: HugsService) {}

  // Hugs
  @Mutation(() => Hug)
  @UseGuards(GqlAuthGuard)
  async sendHug(
    @Args('sendHugInput') sendHugInput: SendHugInput,
    @CurrentUser() user: User,
  ): Promise<Hug> {
    return this.hugsService.sendHug(sendHugInput, user.id);
  }

  @Query(() => [Hug])
  @UseGuards(GqlAuthGuard)
  async sentHugs(@CurrentUser() user: User): Promise<Hug[]> {
    return this.hugsService.findHugsBySender(user.id);
  }

  @Query(() => [Hug])
  @UseGuards(GqlAuthGuard)
  async receivedHugs(@CurrentUser() user: User): Promise<Hug[]> {
    return this.hugsService.findHugsByRecipient(user.id);
  }

  @Query(() => Hug)
  @UseGuards(GqlAuthGuard)
  async hug(@Args('id', { type: () => ID }) id: string): Promise<Hug> {
    return this.hugsService.findHugById(id);
  }

  @Mutation(() => Hug)
  @UseGuards(GqlAuthGuard)
  async markHugAsRead(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Hug> {
    return this.hugsService.markHugAsRead(id, user.id);
  }

  // Hug Requests
  @Mutation(() => HugRequest)
  @UseGuards(GqlAuthGuard)
  async createHugRequest(
    @Args('createHugRequestInput') createHugRequestInput: CreateHugRequestInput,
    @CurrentUser() user: User,
  ): Promise<HugRequest> {
    return this.hugsService.createHugRequest(createHugRequestInput, user.id);
  }

  @Query(() => [HugRequest])
  @UseGuards(GqlAuthGuard)
  async myHugRequests(@CurrentUser() user: User): Promise<HugRequest[]> {
    return this.hugsService.findHugRequestsByUser(user.id);
  }

  @Query(() => [HugRequest])
  @UseGuards(GqlAuthGuard)
  async pendingHugRequests(@CurrentUser() user: User): Promise<HugRequest[]> {
    return this.hugsService.findPendingRequestsForUser(user.id);
  }

  @Query(() => [HugRequest])
  @UseGuards(GqlAuthGuard)
  async communityHugRequests(): Promise<HugRequest[]> {
    return this.hugsService.findCommunityRequests();
  }

  @Query(() => HugRequest)
  @UseGuards(GqlAuthGuard)
  async hugRequest(@Args('id', { type: () => ID }) id: string): Promise<HugRequest> {
    return this.hugsService.findHugRequestById(id);
  }

  @Mutation(() => HugRequest)
  @UseGuards(GqlAuthGuard)
  async respondToHugRequest(
    @Args('respondToRequestInput') respondToRequestInput: RespondToRequestInput,
    @CurrentUser() user: User,
  ): Promise<HugRequest> {
    return this.hugsService.respondToHugRequest(respondToRequestInput, user.id);
  }

  @Mutation(() => HugRequest)
  @UseGuards(GqlAuthGuard)
  async cancelHugRequest(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<HugRequest> {
    return this.hugsService.cancelHugRequest(id, user.id);
  }
}