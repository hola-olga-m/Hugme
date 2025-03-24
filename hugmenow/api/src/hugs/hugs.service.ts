import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hug } from './entities/hug.entity';
import { HugRequest, HugRequestStatus } from './entities/hug-request.entity';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { UsersService } from '../users/users.service';

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

    const hug = this.hugsRepository.create({
      ...sendHugInput,
      senderId,
      sender,
      recipient,
      recipientId: sendHugInput.recipientId,
      isRead: false,
    });

    return this.hugsRepository.save(hug);
  }

  async findAllHugs(): Promise<Hug[]> {
    return this.hugsRepository.find({
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findHugById(id: string): Promise<Hug> {
    const hug = await this.hugsRepository.findOne({
      where: { id },
      relations: ['sender', 'recipient'],
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
      order: { createdAt: 'DESC' },
    });
  }

  async findHugsByRecipient(recipientId: string): Promise<Hug[]> {
    return this.hugsRepository.find({
      where: { recipientId },
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
    });
  }

  async markHugAsRead(hugId: string, userId: string): Promise<Hug> {
    const hug = await this.findHugById(hugId);

    if (hug.recipientId !== userId) {
      throw new ForbiddenException('You can only mark your own received hugs as read');
    }

    if (!hug.isRead) {
      hug.isRead = true;
      await this.hugsRepository.save(hug);
    }

    return hug;
  }

  // Hug Requests
  async createHugRequest(createHugRequestInput: CreateHugRequestInput, requesterId: string): Promise<HugRequest> {
    const requester = await this.usersService.findOne(requesterId);
    
    let recipient = null;
    if (createHugRequestInput.recipientId) {
      recipient = await this.usersService.findOne(createHugRequestInput.recipientId);
    } else if (!createHugRequestInput.isCommunityRequest) {
      throw new NotFoundException('A recipient is required for non-community requests');
    }

    const hugRequest = this.hugRequestsRepository.create({
      ...createHugRequestInput,
      requesterId,
      requester,
      recipient,
      recipientId: createHugRequestInput.recipientId,
      status: HugRequestStatus.PENDING,
    });

    return this.hugRequestsRepository.save(hugRequest);
  }

  async findAllHugRequests(): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      relations: ['requester', 'recipient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findHugRequestById(id: string): Promise<HugRequest> {
    const request = await this.hugRequestsRepository.findOne({
      where: { id },
      relations: ['requester', 'recipient'],
    });

    if (!request) {
      throw new NotFoundException(`Hug request with ID ${id} not found`);
    }

    return request;
  }

  async findHugRequestsByUser(userId: string): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      where: [
        { requesterId: userId },
        { recipientId: userId },
      ],
      relations: ['requester', 'recipient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingRequestsForUser(userId: string): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      where: {
        recipientId: userId,
        status: HugRequestStatus.PENDING,
      },
      relations: ['requester'],
      order: { createdAt: 'DESC' },
    });
  }

  async findCommunityRequests(): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      where: {
        isCommunityRequest: true,
        status: HugRequestStatus.PENDING,
      },
      relations: ['requester'],
      order: { createdAt: 'DESC' },
    });
  }

  async respondToHugRequest(respondToRequestInput: RespondToRequestInput, userId: string): Promise<HugRequest> {
    const request = await this.findHugRequestById(respondToRequestInput.requestId);

    // Check if the user is authorized to respond to this request
    if (request.isCommunityRequest) {
      // Anyone can respond to community requests
    } else if (request.recipientId !== userId) {
      throw new ForbiddenException('You are not authorized to respond to this request');
    }

    // Check if the request is still pending
    if (request.status !== HugRequestStatus.PENDING) {
      throw new ForbiddenException('This request has already been processed');
    }

    // Update the request status
    request.status = respondToRequestInput.status;
    request.respondedAt = new Date();

    // If accepted, create a hug
    if (respondToRequestInput.status === HugRequestStatus.ACCEPTED) {
      await this.sendHug(
        {
          recipientId: request.requesterId,
          type: 'SUPPORTIVE', // Default type, can be customized
          message: respondToRequestInput.message || request.message,
        },
        userId,
      );
    }

    return this.hugRequestsRepository.save(request);
  }

  async cancelHugRequest(requestId: string, userId: string): Promise<HugRequest> {
    const request = await this.findHugRequestById(requestId);

    if (request.requesterId !== userId) {
      throw new ForbiddenException('You can only cancel your own requests');
    }

    if (request.status !== HugRequestStatus.PENDING) {
      throw new ForbiddenException('This request has already been processed');
    }

    request.status = HugRequestStatus.CANCELLED;
    request.respondedAt = new Date();

    return this.hugRequestsRepository.save(request);
  }
}