import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mood } from './entities/mood.entity';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
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
    if (!user) {
      throw new Error('User not found');
    }

    const mood = this.moodsRepository.create({
      ...createMoodInput,
      user,
      userId,
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
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Mood> {
    const mood = await this.moodsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!mood) {
      throw new Error('Mood not found');
    }

    return mood;
  }

  async update(id: string, updateMoodInput: UpdateMoodInput, userId: string): Promise<Mood> {
    const mood = await this.findOne(id);

    if (mood.userId !== userId) {
      throw new Error('You do not have permission to update this mood');
    }

    await this.moodsRepository.update(id, updateMoodInput);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const mood = await this.findOne(id);

    if (mood.userId !== userId) {
      throw new Error('You do not have permission to delete this mood');
    }

    const result = await this.moodsRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async getUserMoodStreak(userId: string): Promise<number> {
    // Get all user moods ordered by date
    const moods = await this.moodsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (moods.length === 0) {
      return 0;
    }

    // Initialize streak counter
    let streak = 1;
    let currentDate = new Date(moods[0].createdAt);
    currentDate.setHours(0, 0, 0, 0);

    // Check for consecutive days
    for (let i = 1; i < moods.length; i++) {
      const moodDate = new Date(moods[i].createdAt);
      moodDate.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffTime = Math.abs(currentDate.getTime() - moodDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
        currentDate = moodDate;
      } else if (diffDays > 1) {
        // Break in streak
        break;
      }
    }

    return streak;
  }
}