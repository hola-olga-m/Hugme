import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hug, HugType } from './entities/hug.entity';
import { HugRequest, HugRequestStatus } from './entities/hug-request.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';

@Injectable()
export class HugsService {
  constructor(
    @InjectRepository(Hug)
    private hugsRepository: Repository<Hug>,
    
    @InjectRepository(HugRequest)
    private hugRequestsRepository: Repository<HugRequest>,
    
    private usersService: UsersService,
  ) {}

  // HUG METHODS
  async sendHug(sendHugInput: SendHugInput, senderId: string): Promise<Hug> {
    const sender = await this.usersService.findOne(senderId);
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const recipient = await this.usersService.findOne(sendHugInput.recipientId);
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    const hug = this.hugsRepository.create({
      type: sendHugInput.type,
      message: sendHugInput.message,
      sender,
      senderId,
      recipient,
      recipientId: sendHugInput.recipientId,
      isRead: false,
      createdAt: new Date(),
    });

    return this.hugsRepository.save(hug);
  }

  async findAllHugs(): Promise<Hug[]> {
    return this.hugsRepository.find({
      relations: ['sender', 'recipient'],
    });
  }

  async findHugById(id: string): Promise<Hug> {
    const hug = await this.hugsRepository.findOne({
      where: { id },
      relations: ['sender', 'recipient'],
    });

    if (!hug) {
      throw new NotFoundException(`Hug with id ${id} not found`);
    }

    return hug;
  }

  async findHugsBySender(senderId: string): Promise<Hug[]> {
    return this.hugsRepository.find({
      where: { senderId },
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async findHugsByRecipient(recipientId: string): Promise<Hug[]> {
    return this.hugsRepository.find({
      where: { recipientId },
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async markHugAsRead(hugId: string, userId: string): Promise<Hug> {
    const hug = await this.hugsRepository.findOne({
      where: { id: hugId },
      relations: ['recipient'],
    });

    if (!hug) {
      throw new NotFoundException(`Hug with id ${hugId} not found`);
    }

    if (hug.recipientId !== userId) {
      throw new ForbiddenException('You can only mark your own received hugs as read');
    }

    hug.isRead = true;
    return this.hugsRepository.save(hug);
  }

  // HUG REQUEST METHODS
  async createHugRequest(createHugRequestInput: CreateHugRequestInput, requesterId: string): Promise<HugRequest> {
    const requester = await this.usersService.findOne(requesterId);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    let recipient: User | undefined = undefined;
    let recipientId: string | undefined = undefined;
    
    if (createHugRequestInput.recipientId) {
      recipient = await this.usersService.findOne(createHugRequestInput.recipientId);
      recipientId = recipient.id;
    }

    const request = this.hugRequestsRepository.create({
      message: createHugRequestInput.message,
      requester,
      requesterId,
      recipient,
      recipientId,
      isCommunityRequest: createHugRequestInput.isCommunityRequest,
      status: HugRequestStatus.PENDING,
      createdAt: new Date(),
    });

    return await this.hugRequestsRepository.save(request);
  }

  async findAllHugRequests(): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      relations: ['requester', 'recipient'],
    });
  }

  async findHugRequestById(id: string): Promise<HugRequest> {
    const request = await this.hugRequestsRepository.findOne({
      where: { id },
      relations: ['requester', 'recipient'],
    });

    if (!request) {
      throw new NotFoundException(`Hug request with id ${id} not found`);
    }

    return request;
  }

  async findHugRequestsByUser(userId: string): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      where: { requesterId: userId },
      relations: ['requester', 'recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async findPendingRequestsForUser(userId: string): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      where: { 
        recipientId: userId,
        status: HugRequestStatus.PENDING 
      },
      relations: ['requester', 'recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async findCommunityRequests(): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      where: { 
        isCommunityRequest: true,
        status: HugRequestStatus.PENDING 
      },
      relations: ['requester'],
      order: { createdAt: 'DESC' }
    });
  }

  async respondToHugRequest(respondToRequestInput: RespondToRequestInput, userId: string): Promise<HugRequest> {
    const request = await this.hugRequestsRepository.findOne({
      where: { id: respondToRequestInput.requestId },
      relations: ['requester', 'recipient'],
    });

    if (!request) {
      throw new NotFoundException(`Hug request with id ${respondToRequestInput.requestId} not found`);
    }

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
      
      request.status = HugRequestStatus.ACCEPTED;
    } else {
      request.status = HugRequestStatus.DECLINED;
    }

    request.respondedAt = new Date();
    return this.hugRequestsRepository.save(request);
  }

  async cancelHugRequest(requestId: string, userId: string): Promise<HugRequest> {
    const request = await this.hugRequestsRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(`Hug request with id ${requestId} not found`);
    }

    if (request.requesterId !== userId) {
      throw new ForbiddenException('You can only cancel your own hug requests');
    }

    if (request.status !== HugRequestStatus.PENDING) {
      throw new ForbiddenException('This request has already been processed');
    }

    request.status = HugRequestStatus.CANCELLED;
    return this.hugRequestsRepository.save(request);
  }
}