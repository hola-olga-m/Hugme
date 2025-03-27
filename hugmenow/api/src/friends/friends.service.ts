import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Friendship, FriendshipStatus } from './entities/friendship.entity';
import { UsersService } from '../users/users.service';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { UpdateFriendshipInput } from './dto/update-friendship.input';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FriendsService {
  private readonly friendshipsTable = 'friendships';
  
  constructor(
    private postgraphileService: PostGraphileService,
    private usersService: UsersService,
  ) {}

  async createFriendRequest(createFriendshipInput: CreateFriendshipInput, requesterId: string): Promise<Friendship> {
    const requester = await this.usersService.findOne(requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    const recipient = await this.usersService.findOne(createFriendshipInput.recipientId);
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Check if a friendship already exists in either direction
    const existingFriendships = await this.findFriendshipBetweenUsers(requesterId, createFriendshipInput.recipientId);
    
    if (existingFriendships.length > 0) {
      throw new ForbiddenException('A friendship relationship already exists between these users');
    }

    const friendshipData = {
      id: uuidv4(),
      requesterId,
      recipientId: createFriendshipInput.recipientId,
      status: FriendshipStatus.PENDING,
      followsMood: createFriendshipInput.followMood || false,
      createdAt: new Date(),
    };

    const friendship = await this.postgraphileService.insert(this.friendshipsTable, friendshipData) as Friendship;
    
    friendship.requester = requester;
    friendship.recipient = recipient;

    return friendship;
  }

  async updateFriendship(updateFriendshipInput: UpdateFriendshipInput, userId: string): Promise<Friendship> {
    const friendship = await this.findFriendshipById(updateFriendshipInput.friendshipId);

    // Check permissions
    if (friendship.recipientId !== userId && friendship.requesterId !== userId) {
      throw new ForbiddenException('You can only update friendships that you are a part of');
    }

    // If changing status, only recipient can do that
    if (updateFriendshipInput.status && friendship.recipientId !== userId) {
      throw new ForbiddenException('Only the recipient can accept or reject a friendship request');
    }

    const updateData: any = {};
    
    if (updateFriendshipInput.status) {
      updateData.status = updateFriendshipInput.status;
    }
    
    if (updateFriendshipInput.followMood !== undefined) {
      updateData.followsMood = updateFriendshipInput.followMood;
    }
    
    updateData.updatedAt = new Date();

    const updatedFriendship = await this.postgraphileService.update(
      this.friendshipsTable, 
      updateFriendshipInput.friendshipId, 
      updateData
    ) as Friendship;
    
    return this.findFriendshipById(updatedFriendship.id);
  }

  async findFriendshipById(id: string): Promise<Friendship> {
    const friendship = await this.postgraphileService.findById(this.friendshipsTable, id) as Friendship;

    if (!friendship) {
      throw new NotFoundException(`Friendship with id ${id} not found`);
    }

    // Load requester and recipient details
    friendship.requester = await this.usersService.findOne(friendship.requesterId);
    friendship.recipient = await this.usersService.findOne(friendship.recipientId);

    return friendship;
  }

  async findFriendshipBetweenUsers(userId1: string, userId2: string): Promise<Friendship[]> {
    // We need to check both directions
    const friendships1 = await this.postgraphileService.findWhere(this.friendshipsTable, { 
      requesterId: userId1, 
      recipientId: userId2 
    }) as Friendship[];
    
    const friendships2 = await this.postgraphileService.findWhere(this.friendshipsTable, { 
      requesterId: userId2, 
      recipientId: userId1 
    }) as Friendship[];
    
    return [...friendships1, ...friendships2];
  }

  async findFriendships(userId: string): Promise<Friendship[]> {
    // Get all friendships where the user is either requester or recipient
    const asSender = await this.postgraphileService.findWhere(this.friendshipsTable, { requesterId: userId }) as Friendship[];
    const asRecipient = await this.postgraphileService.findWhere(this.friendshipsTable, { recipientId: userId }) as Friendship[];
    
    const friendships = [...asSender, ...asRecipient];
    
    // For each friendship, load the user details
    for (const friendship of friendships) {
      friendship.requester = await this.usersService.findOne(friendship.requesterId);
      friendship.recipient = await this.usersService.findOne(friendship.recipientId);
    }
    
    return friendships;
  }

  async findFriends(userId: string): Promise<Friendship[]> {
    const allFriendships = await this.findFriendships(userId);
    
    // Filter to only return accepted friendships
    return allFriendships.filter(friendship => 
      friendship.status === FriendshipStatus.ACCEPTED
    );
  }

  async findPendingFriendRequests(userId: string): Promise<Friendship[]> {
    // Get pending requests where user is the recipient
    const pendingRequests = await this.postgraphileService.findWhere(this.friendshipsTable, { 
      recipientId: userId,
      status: FriendshipStatus.PENDING
    }) as Friendship[];
    
    // For each request, load the requester details
    for (const request of pendingRequests) {
      request.requester = await this.usersService.findOne(request.requesterId);
      request.recipient = await this.usersService.findOne(request.recipientId);
    }
    
    return pendingRequests;
  }

  async findSentFriendRequests(userId: string): Promise<Friendship[]> {
    // Get pending requests where user is the requester
    const sentRequests = await this.postgraphileService.findWhere(this.friendshipsTable, { 
      requesterId: userId,
      status: FriendshipStatus.PENDING
    }) as Friendship[];
    
    // For each request, load the recipient details
    for (const request of sentRequests) {
      request.requester = await this.usersService.findOne(request.requesterId);
      request.recipient = await this.usersService.findOne(request.recipientId);
    }
    
    return sentRequests;
  }

  async areFriends(userId1: string, userId2: string): Promise<boolean> {
    const friendships = await this.findFriendshipBetweenUsers(userId1, userId2);
    
    // Check if any friendship is accepted
    return friendships.some(friendship => 
      friendship.status === FriendshipStatus.ACCEPTED
    );
  }

  async findMoodFollowing(userId: string): Promise<Friendship[]> {
    const friends = await this.findFriends(userId);
    
    // Filter to only return friendships where mood is followed
    return friends.filter(friendship => friendship.followsMood === true);
  }
}