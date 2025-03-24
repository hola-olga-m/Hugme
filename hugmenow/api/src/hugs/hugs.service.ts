import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hug, HugType } from './entities/hug.entity';
import { HugRequest, HugRequestStatus } from './entities/hug-request.entity';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HugsService {
  constructor(
    @InjectRepository(Hug)
    private hugsRepository: Repository<Hug>,
    @InjectRepository(HugRequest)
    private hugRequestsRepository: Repository<HugRequest>,
    private usersService: UsersService,
  ) {}

  // Hugs
  async sendHug(sendHugInput: SendHugInput, senderId: string): Promise<Hug> {
    const sender = await this.usersService.findOne(senderId);
    const recipient = await this.usersService.findOne(sendHugInput.recipientId);

    if (!recipient) {
      throw new NotFoundException(`Recipient with ID ${sendHugInput.recipientId} not found`);
    }

    const hug = this.hugsRepository.create({
      id: uuidv4(),
      type: sendHugInput.type,
      message: sendHugInput.message,
      sender,
      senderId: sender.id,
      recipient,
      recipientId: recipient.id,
      isRead: false,
      createdAt: new Date()
    });

    return this.hugsRepository.save(hug);
  }

  async findAllHugs(): Promise<Hug[]> {
    return this.hugsRepository.find({
      relations: ['sender', 'recipient']
    });
  }

  async findHugById(id: string): Promise<Hug> {
    const hug = await this.hugsRepository.findOne({
      where: { id },
      relations: ['sender', 'recipient']
    });

    if (!hug) {
      throw new NotFoundException(`Hug with ID ${id} not found`);
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
    const hug = await this.findHugById(hugId);

    if (hug.recipientId !== userId) {
      throw new ForbiddenException('You can only mark hugs sent to you as read');
    }

    hug.isRead = true;
    return this.hugsRepository.save(hug);
  }

  // Hug Requests
  async createHugRequest(createHugRequestInput: CreateHugRequestInput, requesterId: string): Promise<HugRequest> {
    const requester = await this.usersService.findOne(requesterId);
    
    let recipient = null;
    if (createHugRequestInput.recipientId) {
      recipient = await this.usersService.findOne(createHugRequestInput.recipientId);
      if (!recipient) {
        throw new NotFoundException(`Recipient with ID ${createHugRequestInput.recipientId} not found`);
      }
    }

    const request = this.hugRequestsRepository.create({
      id: uuidv4(),
      message: createHugRequestInput.message,
      requester,
      requesterId: requester.id,
      recipient,
      recipientId: recipient?.id,
      isCommunityRequest: createHugRequestInput.isCommunityRequest,
      status: HugRequestStatus.PENDING,
      createdAt: new Date()
    });

    return this.hugRequestsRepository.save(request);
  }

  async findAllHugRequests(): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      relations: ['requester', 'recipient'],
      order: { createdAt: 'DESC' }
    });
  }

  async findHugRequestById(id: string): Promise<HugRequest> {
    const request = await this.hugRequestsRepository.findOne({
      where: { id },
      relations: ['requester', 'recipient']
    });

    if (!request) {
      throw new NotFoundException(`Hug request with ID ${id} not found`);
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
    const request = await this.findHugRequestById(respondToRequestInput.requestId);

    // Check if this is a community request or if the user is the designated recipient
    if (!request.isCommunityRequest && request.recipientId !== userId) {
      throw new ForbiddenException('You cannot respond to this request');
    }

    // If it's already resolved, throw an error
    if (request.status !== HugRequestStatus.PENDING) {
      throw new ForbiddenException(`This request has already been ${request.status.toLowerCase()}`);
    }

    request.status = respondToRequestInput.status;
    request.respondedAt = new Date();

    // If accepting, create a hug
    if (respondToRequestInput.status === HugRequestStatus.ACCEPTED) {
      const recipient = await this.usersService.findOne(request.requesterId);
      const sender = await this.usersService.findOne(userId);

      await this.hugsRepository.save({
        id: uuidv4(),
        type: HugType.SUPPORTIVE, // Default type for request responses
        message: respondToRequestInput.message || 'Responding to your hug request',
        sender,
        senderId: sender.id,
        recipient,
        recipientId: recipient.id,
        isRead: false,
        createdAt: new Date()
      });
    }

    return this.hugRequestsRepository.save(request);
  }

  async cancelHugRequest(requestId: string, userId: string): Promise<HugRequest> {
    const request = await this.findHugRequestById(requestId);

    if (request.requesterId !== userId) {
      throw new ForbiddenException('You can only cancel your own requests');
    }

    if (request.status !== HugRequestStatus.PENDING) {
      throw new ForbiddenException(`This request has already been ${request.status.toLowerCase()}`);
    }

    request.status = HugRequestStatus.CANCELLED;
    request.respondedAt = new Date();

    return this.hugRequestsRepository.save(request);
  }
}