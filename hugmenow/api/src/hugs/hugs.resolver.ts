import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Hug } from './entities/hug.entity';
import { HugRequest } from './entities/hug-request.entity';
import { HugsService } from './hugs.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';

@Resolver(() => Hug)
export class HugsResolver {
  constructor(private hugsService: HugsService) {}

  // HUG MUTATIONS
  @Mutation(() => Hug)
  @UseGuards(GqlAuthGuard)
  async sendHug(
    @Args('sendHugInput') sendHugInput: SendHugInput,
    @CurrentUser() user: User,
  ): Promise<Hug> {
    return this.hugsService.sendHug(sendHugInput, user.id);
  }

  @Mutation(() => Hug)
  @UseGuards(GqlAuthGuard)
  async markHugAsRead(
    @Args('hugId', { type: () => ID }) hugId: string,
    @CurrentUser() user: User,
  ): Promise<Hug> {
    return this.hugsService.markHugAsRead(hugId, user.id);
  }

  // HUG QUERIES
  @Query(() => [Hug])
  @UseGuards(GqlAuthGuard)
  async sentHugs(
    @CurrentUser() user: User,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<Hug[]> {
    return this.hugsService.findHugsBySender(user.id, limit, offset);
  }

  @Query(() => [Hug])
  @UseGuards(GqlAuthGuard)
  async receivedHugs(
    @CurrentUser() user: User,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<Hug[]> {
    return this.hugsService.findHugsByRecipient(user.id, limit, offset);
  }

  @Query(() => Hug)
  @UseGuards(GqlAuthGuard)
  async hug(@Args('id', { type: () => ID }) id: string): Promise<Hug> {
    return this.hugsService.findHugById(id);
  }

  // HUG REQUEST MUTATIONS
  @Mutation(() => HugRequest)
  @UseGuards(GqlAuthGuard)
  async createHugRequest(
    @Args('createHugRequestInput') createHugRequestInput: CreateHugRequestInput,
    @CurrentUser() user: User,
  ): Promise<HugRequest> {
    return this.hugsService.createHugRequest(createHugRequestInput, user.id);
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
    @Args('requestId', { type: () => ID }) requestId: string,
    @CurrentUser() user: User,
  ): Promise<HugRequest> {
    return this.hugsService.cancelHugRequest(requestId, user.id);
  }

  // HUG REQUEST QUERIES
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
  async communityHugRequests(): Promise<HugRequest[]> {
    return this.hugsService.findCommunityRequests();
  }

  @Query(() => HugRequest)
  @UseGuards(GqlAuthGuard)
  async hugRequest(@Args('id', { type: () => ID }) id: string): Promise<HugRequest> {
    return this.hugsService.findHugRequestById(id);
  }
}