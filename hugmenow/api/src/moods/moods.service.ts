import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mood } from './entities/mood.entity';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MoodsService {
  constructor(
    @InjectRepository(Mood)
    private moodsRepository: Repository<Mood>,
    private usersService: UsersService,
  ) {}

  async create(createMoodInput: CreateMoodInput, userId: string): Promise<Mood> {
    const user = await this.usersService.findOne(userId);
    
    const mood = this.moodsRepository.create({
      ...createMoodInput,
      userId,
      user,
    });
    
    return this.moodsRepository.save(mood);
  }

  async findAll(): Promise<Mood[]> {
    return this.moodsRepository.find({
      relations: ['user'],
    });
  }

  async findPublic(): Promise<Mood[]> {
    return this.moodsRepository.find({
      where: { isPublic: true },
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<Mood[]> {
    return this.moodsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Mood> {
    const mood = await this.moodsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!mood) {
      throw new NotFoundException(`Mood with ID ${id} not found`);
    }
    
    return mood;
  }

  async update(id: string, updateMoodInput: UpdateMoodInput, userId: string): Promise<Mood> {
    const mood = await this.moodsRepository.findOne({
      where: { id },
    });
    
    if (!mood) {
      throw new NotFoundException(`Mood with ID ${id} not found`);
    }
    
    if (mood.userId !== userId) {
      throw new NotFoundException('You can only update your own moods');
    }
    
    const { id: moodId, ...updateData } = updateMoodInput;
    
    await this.moodsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const mood = await this.moodsRepository.findOne({
      where: { id },
    });
    
    if (!mood) {
      throw new NotFoundException(`Mood with ID ${id} not found`);
    }
    
    if (mood.userId !== userId) {
      throw new NotFoundException('You can only delete your own moods');
    }
    
    const result = await this.moodsRepository.delete(id);
    return result.affected > 0;
  }

  async getUserMoodStreak(userId: string): Promise<number> {
    // Get all user's moods, ordered by date
    const moods = await this.moodsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (moods.length === 0) {
      return 0;
    }

    // Check if the user has logged a mood today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestMood = moods[0];
    const latestMoodDate = new Date(latestMood.createdAt);
    latestMoodDate.setHours(0, 0, 0, 0);
    
    if (latestMoodDate.getTime() !== today.getTime()) {
      return 0; // Streak broken if no mood logged today
    }

    // Count consecutive days with moods
    let streak = 1;
    let currentDate = today;
    
    for (let i = 1; i < moods.length; i++) {
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() - 1);
      
      const moodDate = new Date(moods[i].createdAt);
      moodDate.setHours(0, 0, 0, 0);
      
      if (moodDate.getTime() === currentDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}