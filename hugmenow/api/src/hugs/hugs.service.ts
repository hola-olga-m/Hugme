import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Hug, HugType } from './entities/hug.entity';
import { HugRequest, HugRequestStatus } from './entities/hug-request.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
import { FriendsService } from '../friends/friends.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HugsService {
  private readonly hugsTable = 'hugs';
  private readonly hugRequestsTable = 'hug_requests';
  
  constructor(
    private postgraphileService: PostGraphileService,
    private usersService: UsersService,
    private friendsService: FriendsService,
  ) {}

  // HUG METHODS
  async sendHug(sendHugInput: SendHugInput, senderId: string): Promise<Hug> {
    const sender = await this.usersService.findOne(senderId);
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    // Prepare hug data
    const hugData: any = {
      id: uuidv4(),
      type: sendHugInput.type,
      message: sendHugInput.message,
      senderId,
      isRead: false,
      createdAt: new Date(),
    };

    // Check if sending to internal user or external recipient
    if (sendHugInput.recipientId) {
      // Internal user
      const recipient = await this.usersService.findOne(sendHugInput.recipientId);
      if (!recipient) {
        throw new NotFoundException('Recipient not found');
      }
      
      // Check if sender and recipient are friends
      const areFriends = await this.friendsService.areFriends(senderId, sendHugInput.recipientId);
      if (!areFriends) {
        throw new ForbiddenException('You can only send hugs to your friends');
      }
      
      hugData.recipientId = sendHugInput.recipientId;
    } else if (sendHugInput.externalRecipient) {
      // External recipient (email or Telegram)
      hugData.externalRecipient = {
        type: sendHugInput.externalRecipient.type,
        contact: sendHugInput.externalRecipient.contact,
      };
      
      // TODO: Implement actual sending of email or Telegram message
      // This would typically be handled by a messaging service
      console.log(`Sending ${sendHugInput.type} hug to external recipient: ${sendHugInput.externalRecipient.type}:${sendHugInput.externalRecipient.contact}`);
    } else {
      throw new ForbiddenException('Either recipientId or externalRecipient must be provided');
    }

    return await this.postgraphileService.insert(this.hugsTable, hugData) as Hug;
  }

  async findAllHugs(): Promise<Hug[]> {
    return await this.postgraphileService.findAll(this.hugsTable) as Hug[];
  }

  async findHugById(id: string): Promise<Hug> {
    const hug = await this.postgraphileService.findById(this.hugsTable, id) as Hug;

    if (!hug) {
      throw new NotFoundException(`Hug with id ${id} not found`);
    }

    // Load sender and recipient details
    if (hug.senderId) {
      hug.sender = await this.usersService.findOne(hug.senderId);
    }
    if (hug.recipientId) {
      hug.recipient = await this.usersService.findOne(hug.recipientId);
    }

    return hug;
  }

  async findHugsBySender(senderId: string, limit?: number, offset?: number): Promise<Hug[]> {
    const hugs = await this.postgraphileService.findWhere(this.hugsTable, { senderId }) as Hug[];
    
    // For each hug, load the sender and recipient details
    for (const hug of hugs) {
      if (hug.senderId) {
        hug.sender = await this.usersService.findOne(hug.senderId);
      }
      if (hug.recipientId) {
        hug.recipient = await this.usersService.findOne(hug.recipientId);
      }
    }
    
    // Sort by createdAt DESC
    const sortedHugs = hugs.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
    
    // Apply pagination if specified
    if (typeof offset === 'number' && typeof limit === 'number') {
      return sortedHugs.slice(offset, offset + limit);
    } else if (typeof limit === 'number') {
      return sortedHugs.slice(0, limit);
    }
    
    return sortedHugs;
  }

  async findHugsByRecipient(recipientId: string, limit?: number, offset?: number): Promise<Hug[]> {
    const hugs = await this.postgraphileService.findWhere(this.hugsTable, { recipientId }) as Hug[];
    
    // For each hug, load the sender and recipient details
    for (const hug of hugs) {
      if (hug.senderId) {
        hug.sender = await this.usersService.findOne(hug.senderId);
      }
      if (hug.recipientId) {
        hug.recipient = await this.usersService.findOne(hug.recipientId);
      }
    }
    
    // Sort by createdAt DESC
    const sortedHugs = hugs.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
    
    // Apply pagination if specified
    if (typeof offset === 'number' && typeof limit === 'number') {
      return sortedHugs.slice(offset, offset + limit);
    } else if (typeof limit === 'number') {
      return sortedHugs.slice(0, limit);
    }
    
    return sortedHugs;
  }

  async markHugAsRead(hugId: string, userId: string): Promise<Hug> {
    const hug = await this.postgraphileService.findById(this.hugsTable, hugId) as Hug;

    if (!hug) {
      throw new NotFoundException(`Hug with id ${hugId} not found`);
    }

    if (hug.recipientId !== userId) {
      throw new ForbiddenException('You can only mark your own received hugs as read');
    }

    const updatedHug = await this.postgraphileService.update(this.hugsTable, hugId, { isRead: true }) as Hug;
    
    // Load recipient details
    if (updatedHug.recipientId) {
      updatedHug.recipient = await this.usersService.findOne(updatedHug.recipientId);
    }
    
    return updatedHug;
  }

  // HUG REQUEST METHODS
  async createHugRequest(createHugRequestInput: CreateHugRequestInput, requesterId: string): Promise<HugRequest> {
    const requester = await this.usersService.findOne(requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    let recipientId: string | undefined = undefined;
    
    if (createHugRequestInput.recipientId) {
      const recipient = await this.usersService.findOne(createHugRequestInput.recipientId);
      if (!recipient) {
        throw new NotFoundException('Recipient not found');
      }
      recipientId = recipient.id;
    }

    const requestData = {
      id: uuidv4(),
      message: createHugRequestInput.message,
      requesterId,
      recipientId,
      isCommunityRequest: createHugRequestInput.isCommunityRequest,
      status: HugRequestStatus.PENDING,
      createdAt: new Date(),
    };

    return await this.postgraphileService.insert(this.hugRequestsTable, requestData) as HugRequest;
  }

  async findAllHugRequests(): Promise<HugRequest[]> {
    return await this.postgraphileService.findAll(this.hugRequestsTable) as HugRequest[];
  }

  async findHugRequestById(id: string): Promise<HugRequest> {
    const request = await this.postgraphileService.findById(this.hugRequestsTable, id) as HugRequest;

    if (!request) {
      throw new NotFoundException(`Hug request with id ${id} not found`);
    }

    // Load requester and recipient details
    if (request.requesterId) {
      request.requester = await this.usersService.findOne(request.requesterId);
    }
    if (request.recipientId) {
      request.recipient = await this.usersService.findOne(request.recipientId);
    }

    return request;
  }

  async findHugRequestsByUser(userId: string): Promise<HugRequest[]> {
    const requests = await this.postgraphileService.findWhere(this.hugRequestsTable, { requesterId: userId }) as HugRequest[];
    
    // For each request, load the requester and recipient details
    for (const request of requests) {
      if (request.requesterId) {
        request.requester = await this.usersService.findOne(request.requesterId);
      }
      if (request.recipientId) {
        request.recipient = await this.usersService.findOne(request.recipientId);
      }
    }
    
    // Sort by createdAt DESC
    return requests.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findPendingRequestsForUser(userId: string): Promise<HugRequest[]> {
    // We need to manually filter since we can't do complex where clauses directly
    const allRequests = await this.postgraphileService.findAll(this.hugRequestsTable) as HugRequest[];
    
    const pendingRequests = allRequests.filter(request => 
      request.recipientId === userId && 
      request.status === HugRequestStatus.PENDING
    );
    
    // For each request, load the requester and recipient details
    for (const request of pendingRequests) {
      if (request.requesterId) {
        request.requester = await this.usersService.findOne(request.requesterId);
      }
      if (request.recipientId) {
        request.recipient = await this.usersService.findOne(request.recipientId);
      }
    }
    
    // Sort by createdAt DESC
    return pendingRequests.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findCommunityRequests(): Promise<HugRequest[]> {
    // We need to manually filter since we can't do complex where clauses directly
    const allRequests = await this.postgraphileService.findAll(this.hugRequestsTable) as HugRequest[];
    
    const communityRequests = allRequests.filter(request => 
      request.isCommunityRequest === true && 
      request.status === HugRequestStatus.PENDING
    );
    
    // For each request, load the requester details
    for (const request of communityRequests) {
      if (request.requesterId) {
        request.requester = await this.usersService.findOne(request.requesterId);
      }
    }
    
    // Sort by createdAt DESC
    return communityRequests.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async respondToHugRequest(respondToRequestInput: RespondToRequestInput, userId: string): Promise<HugRequest> {
    const request = await this.findHugRequestById(respondToRequestInput.requestId);

    if (!request.isCommunityRequest && request.recipientId !== userId) {
      throw new ForbiddenException('You can only respond to your own hug requests');
    }

    if (request.status !== HugRequestStatus.PENDING) {
      throw new ForbiddenException('This request has already been processed');
    }

    if (respondToRequestInput.status === HugRequestStatus.ACCEPTED) {
      // Send a hug to the requester
      await this.sendHug({
        recipientId: request.requesterId,
        type: HugType.SUPPORTIVE,
        message: respondToRequestInput.message || `In response to your request: "${request.message}"`,
      }, userId);
    } 

    const updatedRequestData = {
      status: respondToRequestInput.status,
      respondedAt: new Date()
    };

    const updatedRequest = await this.postgraphileService.update(
      this.hugRequestsTable, 
      respondToRequestInput.requestId, 
      updatedRequestData
    ) as HugRequest;
    
    // Reload the complete request with associations
    return this.findHugRequestById(updatedRequest.id);
  }

  async cancelHugRequest(requestId: string, userId: string): Promise<HugRequest> {
    const request = await this.findHugRequestById(requestId);

    if (request.requesterId !== userId) {
      throw new ForbiddenException('You can only cancel your own hug requests');
    }

    if (request.status !== HugRequestStatus.PENDING) {
      throw new ForbiddenException('This request has already been processed');
    }

    const updatedRequest = await this.postgraphileService.update(
      this.hugRequestsTable, 
      requestId, 
      { status: HugRequestStatus.CANCELLED }
    ) as HugRequest;
    
    // Reload the complete request with associations
    return this.findHugRequestById(updatedRequest.id);
  }
}