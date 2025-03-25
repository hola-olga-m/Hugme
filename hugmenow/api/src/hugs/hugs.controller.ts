import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, UnauthorizedException, NotFoundException, HttpStatus, Res } from '@nestjs/common';
import { HugsService } from './hugs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { Hug } from './entities/hug.entity';
import { HugRequest } from './entities/hug-request.entity';
import { Response } from 'express';

@Controller('hugs')
export class HugsController {
  constructor(private readonly hugsService: HugsService) {}

  /**
   * Send a hug to another user
   */
  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendHug(
    @Body() sendHugInput: SendHugInput,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const senderId = req.user.userId;
      const newHug = await this.hugsService.sendHug(sendHugInput, senderId);
      return res.status(HttpStatus.CREATED).json(newHug);
    } catch (error) {
      throw new UnauthorizedException('Unable to send hug');
    }
  }

  /**
   * Mark a hug as read
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markHugAsRead(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const updatedHug = await this.hugsService.markHugAsRead(id, userId);
      return res.status(HttpStatus.OK).json(updatedHug);
    } catch (error) {
      throw new UnauthorizedException('Unable to mark hug as read');
    }
  }

  /**
   * Get hugs sent by the current user
   */
  @UseGuards(JwtAuthGuard)
  @Get('sent')
  async getSentHugs(@Request() req): Promise<Hug[]> {
    try {
      const userId = req.user.userId;
      return this.hugsService.findHugsBySender(userId);
    } catch (error) {
      throw new UnauthorizedException('Unable to get sent hugs');
    }
  }

  /**
   * Get hugs received by the current user
   */
  @UseGuards(JwtAuthGuard)
  @Get('received')
  async getReceivedHugs(@Request() req): Promise<Hug[]> {
    try {
      const userId = req.user.userId;
      return this.hugsService.findHugsByRecipient(userId);
    } catch (error) {
      throw new UnauthorizedException('Unable to get received hugs');
    }
  }

  /**
   * Get a specific hug by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getHug(@Param('id') id: string, @Request() req): Promise<Hug> {
    try {
      const userId = req.user.userId;
      const hug = await this.hugsService.findHugById(id);
      
      // Check if the user is either the sender or the recipient
      if (hug.senderId !== userId && hug.recipientId !== userId) {
        throw new UnauthorizedException('You do not have permission to view this hug');
      }
      
      return hug;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new NotFoundException(`Hug with ID ${id} not found`);
    }
  }

  /**
   * Create a hug request
   */
  @UseGuards(JwtAuthGuard)
  @Post('requests')
  async createHugRequest(
    @Body() createHugRequestInput: CreateHugRequestInput,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const requesterId = req.user.userId;
      const newRequest = await this.hugsService.createHugRequest(createHugRequestInput, requesterId);
      return res.status(HttpStatus.CREATED).json(newRequest);
    } catch (error) {
      throw new UnauthorizedException('Unable to create hug request');
    }
  }

  /**
   * Respond to a hug request
   */
  @UseGuards(JwtAuthGuard)
  @Patch('requests/:id/respond')
  async respondToHugRequest(
    @Param('id') id: string,
    @Body() respondToRequestInput: RespondToRequestInput,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      // Set the requestId from the URL parameter
      respondToRequestInput.requestId = id;
      const updatedRequest = await this.hugsService.respondToHugRequest(respondToRequestInput, userId);
      return res.status(HttpStatus.OK).json(updatedRequest);
    } catch (error) {
      throw new UnauthorizedException('Unable to respond to hug request');
    }
  }

  /**
   * Cancel a hug request
   */
  @UseGuards(JwtAuthGuard)
  @Patch('requests/:id/cancel')
  async cancelHugRequest(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const canceledRequest = await this.hugsService.cancelHugRequest(id, userId);
      return res.status(HttpStatus.OK).json(canceledRequest);
    } catch (error) {
      throw new UnauthorizedException('Unable to cancel hug request');
    }
  }

  /**
   * Get hug requests created by the current user
   */
  @UseGuards(JwtAuthGuard)
  @Get('requests/my')
  async getMyHugRequests(@Request() req): Promise<HugRequest[]> {
    try {
      const userId = req.user.userId;
      return this.hugsService.findHugRequestsByUser(userId);
    } catch (error) {
      throw new UnauthorizedException('Unable to get your hug requests');
    }
  }

  /**
   * Get pending hug requests for the current user
   */
  @UseGuards(JwtAuthGuard)
  @Get('requests/pending')
  async getPendingHugRequests(@Request() req): Promise<HugRequest[]> {
    try {
      const userId = req.user.userId;
      return this.hugsService.findPendingRequestsForUser(userId);
    } catch (error) {
      throw new UnauthorizedException('Unable to get pending hug requests');
    }
  }

  /**
   * Get community hug requests
   */
  @UseGuards(JwtAuthGuard)
  @Get('requests/community')
  async getCommunityHugRequests(): Promise<HugRequest[]> {
    try {
      return this.hugsService.findCommunityRequests();
    } catch (error) {
      throw new UnauthorizedException('Unable to get community hug requests');
    }
  }

  /**
   * Get a specific hug request by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get('requests/:id')
  async getHugRequest(@Param('id') id: string, @Request() req): Promise<HugRequest> {
    try {
      const userId = req.user.userId;
      const request = await this.hugsService.findHugRequestById(id);
      
      // Check if the request is a community request or if the user is involved
      if (!request.isCommunityRequest && 
          request.requesterId !== userId && 
          (request.recipientId && request.recipientId !== userId)) {
        throw new UnauthorizedException('You do not have permission to view this hug request');
      }
      
      return request;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new NotFoundException(`Hug request with ID ${id} not found`);
    }
  }
}