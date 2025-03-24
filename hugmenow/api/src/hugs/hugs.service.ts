
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hug } from './entities/hug.entity';
import { HugRequest } from './entities/hug-request.entity';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { UsersService } from '../users/users.service';
import { HugType } from './enums/hug-type.enum';
import { RequestStatus } from './enums/request-status.enum';

@Injectable()
export class HugsService {
  constructor(
    @InjectRepository(Hug)
    private hugsRepository: Repository<Hug>,
    @InjectRepository(HugRequest)
    private hugRequestsRepository: Repository<HugRequest>,
    private usersService: UsersService,
  ) {}

  async sendHug(sendHugInput: SendHugInput, senderId: string): Promise<Hug> {
    const sender = await this.usersService.findOne(senderId);
    if (!sender) {
      throw new Error('Sender not found');
    }

    let recipient = null;
    if (sendHugInput.recipientId) {
      recipient = await this.usersService.findOne(sendHugInput.recipientId);
      if (!recipient) {
        throw new Error('Recipient not found');
      }
    }

    const hug = this.hugsRepository.create({
      ...sendHugInput,
      sender,
      senderId,
      recipient,
      recipientId: recipient?.id,
      type: recipient ? HugType.PERSONAL : HugType.COMMUNITY,
    });

    // If this hug is in response to a request, update the request status
    if (sendHugInput.requestId) {
      const request = await this.hugRequestsRepository.findOne({
        where: { id: sendHugInput.requestId },
      });
      
      if (request) {
        request.status = RequestStatus.FULFILLED;
        await this.hugRequestsRepository.save(request);
        hug.request = request;
      }
    }

    return this.hugsRepository.save(hug);
  }

  async findAllHugs(): Promise<Hug[]> {
    return this.hugsRepository.find({
      relations: ['sender', 'recipient', 'request'],
    });
  }

  async findHugById(id: string): Promise<Hug> {
    const hug = await this.hugsRepository.findOne({
      where: { id },
      relations: ['sender', 'recipient', 'request'],
    });

    if (!hug) {
      throw new Error('Hug not found');
    }

    return hug;
  }

  async findHugsBySender(senderId: string): Promise<Hug[]> {
    return this.hugsRepository.find({
      where: { senderId },
      relations: ['sender', 'recipient', 'request'],
    });
  }

  async findHugsByRecipient(recipientId: string): Promise<Hug[]> {
    return this.hugsRepository.find({
      where: { recipientId },
      relations: ['sender', 'recipient', 'request'],
    });
  }

  async markHugAsRead(hugId: string, userId: string): Promise<Hug> {
    const hug = await this.findHugById(hugId);

    if (hug.recipientId !== userId) {
      throw new Error('You can only mark your own hugs as read');
    }

    hug.isRead = true;
    return this.hugsRepository.save(hug);
  }

  async createHugRequest(createHugRequestInput: CreateHugRequestInput, requesterId: string): Promise<HugRequest> {
    const requester = await this.usersService.findOne(requesterId);
    if (!requester) {
      throw new Error('Requester not found');
    }

    let recipient = null;
    if (createHugRequestInput.recipientId) {
      recipient = await this.usersService.findOne(createHugRequestInput.recipientId);
      if (!recipient) {
        throw new Error('Recipient not found');
      }
    }

    const request = this.hugRequestsRepository.create({
      ...createHugRequestInput,
      requester,
      requesterId,
      recipient,
      recipientId: recipient?.id,
      isCommunityRequest: !recipient,
      status: RequestStatus.PENDING,
    });

    return this.hugRequestsRepository.save(request);
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
      throw new Error('Hug request not found');
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
    });
  }

  async findPendingRequestsForUser(userId: string): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      where: {
        recipientId: userId,
        status: RequestStatus.PENDING,
      },
      relations: ['requester', 'recipient'],
    });
  }

  async findCommunityRequests(): Promise<HugRequest[]> {
    return this.hugRequestsRepository.find({
      where: {
        isCommunityRequest: true,
        status: RequestStatus.PENDING,
      },
      relations: ['requester'],
    });
  }

  async respondToHugRequest(respondToRequestInput: RespondToRequestInput, userId: string): Promise<HugRequest> {
    const request = await this.findHugRequestById(respondToRequestInput.requestId);

    // Only the recipient can respond to a personal request
    if (!request.isCommunityRequest && request.recipientId !== userId) {
      throw new Error('You cannot respond to this request');
    }

    // For community requests, anyone can respond
    if (respondToRequestInput.accept) {
      // If accepting, create a hug
      await this.sendHug({
        message: respondToRequestInput.message || `Responding to your hug request: "${request.message}"`,
        requestId: request.id,
        recipientId: request.requesterId,
      }, userId);

      request.status = RequestStatus.FULFILLED;
    } else {
      // If declining
      request.status = RequestStatus.DECLINED;
    }

    return this.hugRequestsRepository.save(request);
  }

  async cancelHugRequest(requestId: string, userId: string): Promise<HugRequest> {
    const request = await this.findHugRequestById(requestId);

    if (request.requesterId !== userId) {
      throw new Error('You can only cancel your own requests');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new Error('You can only cancel pending requests');
    }

    request.status = RequestStatus.CANCELLED;
    return this.hugRequestsRepository.save(request);
  }
}
