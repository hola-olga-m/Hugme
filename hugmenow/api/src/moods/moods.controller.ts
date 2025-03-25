import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException, NotFoundException, HttpStatus, Res } from '@nestjs/common';
import { MoodsService } from './moods.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
import { Mood } from './entities/mood.entity';
import { Response } from 'express';

@Controller('moods')
export class MoodsController {
  constructor(private readonly moodsService: MoodsService) {}

  /**
   * Create a new mood
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMoodInput: CreateMoodInput,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const newMood = await this.moodsService.create(createMoodInput, userId);
      return res.status(HttpStatus.CREATED).json(newMood);
    } catch (error) {
      throw new UnauthorizedException('Unable to create mood');
    }
  }

  /**
   * Get all public moods
   */
  @Get('public')
  async findPublic(): Promise<Mood[]> {
    return this.moodsService.findPublic();
  }

  /**
   * Get current user's mood streak
   */
  @UseGuards(JwtAuthGuard)
  @Get('streak')
  async getMoodStreak(@Request() req): Promise<{ streak: number }> {
    try {
      const userId = req.user.userId;
      const streak = await this.moodsService.getUserMoodStreak(userId);
      return { streak };
    } catch (error) {
      throw new UnauthorizedException('Unable to get mood streak');
    }
  }

  /**
   * Get all moods for the current user
   */
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findUserMoods(@Request() req): Promise<Mood[]> {
    try {
      const userId = req.user.userId;
      return this.moodsService.findByUser(userId);
    } catch (error) {
      throw new UnauthorizedException('Unable to get user moods');
    }
  }

  /**
   * Get a specific mood by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Mood> {
    try {
      const userId = req.user.userId;
      const mood = await this.moodsService.findOne(id);
      
      // Check if the mood is public or belongs to the current user
      if (!mood.isPublic && mood.userId !== userId) {
        throw new UnauthorizedException('You do not have permission to view this mood');
      }
      
      return mood;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new NotFoundException(`Mood with ID ${id} not found`);
    }
  }

  /**
   * Update a mood
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMoodInput: UpdateMoodInput,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const updatedMood = await this.moodsService.update(id, updateMoodInput, userId);
      return res.status(HttpStatus.OK).json(updatedMood);
    } catch (error) {
      throw new UnauthorizedException('Unable to update mood');
    }
  }

  /**
   * Delete a mood
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const result = await this.moodsService.remove(id, userId);
      return res.status(HttpStatus.OK).json({ success: result });
    } catch (error) {
      throw new UnauthorizedException('Unable to delete mood');
    }
  }
}