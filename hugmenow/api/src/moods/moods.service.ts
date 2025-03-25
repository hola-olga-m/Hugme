import { Injectable, NotFoundException } from '@nestjs/common';
import { Mood } from './entities/mood.entity';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
import { UsersService } from '../users/users.service';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MoodsService {
  private readonly moodsTable = 'moods';
  
  constructor(
    private postgraphileService: PostGraphileService,
    private usersService: UsersService,
  ) {}

  async create(createMoodInput: CreateMoodInput, userId: string): Promise<Mood> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const moodData = {
      ...createMoodInput,
      userId,
      id: uuidv4(),
      createdAt: new Date()
    };

    return await this.postgraphileService.insert(this.moodsTable, moodData) as Mood;
  }

  async findAll(): Promise<Mood[]> {
    const moods = await this.postgraphileService.findAll(this.moodsTable) as Mood[];
    
    // Load user data for each mood
    for (const mood of moods) {
      if (mood.userId) {
        try {
          mood.user = await this.usersService.findOne(mood.userId);
        } catch (error) {
          // Skip if user not found
        }
      }
    }
    
    return moods;
  }

  async findPublic(): Promise<Mood[]> {
    const moods = await this.postgraphileService.findWhere(this.moodsTable, { isPublic: true }) as Mood[];
    
    // Load user data for each mood
    for (const mood of moods) {
      if (mood.userId) {
        try {
          mood.user = await this.usersService.findOne(mood.userId);
        } catch (error) {
          // Skip if user not found
        }
      }
    }
    
    return moods;
  }

  async findByUser(userId: string): Promise<Mood[]> {
    const moods = await this.postgraphileService.findWhere(this.moodsTable, { userId }) as Mood[];
    
    // Load user data for each mood
    const user = await this.usersService.findOne(userId);
    for (const mood of moods) {
      mood.user = user;
    }
    
    return moods;
  }

  async findOne(id: string): Promise<Mood> {
    const mood = await this.postgraphileService.findById(this.moodsTable, id) as Mood;

    if (!mood) {
      throw new NotFoundException(`Mood with ID ${id} not found`);
    }

    // Load user data
    if (mood.userId) {
      try {
        mood.user = await this.usersService.findOne(mood.userId);
      } catch (error) {
        // Skip if user not found
      }
    }

    return mood;
  }

  async update(id: string, updateMoodInput: UpdateMoodInput, userId: string): Promise<Mood> {
    const mood = await this.findOne(id);

    if (mood.userId !== userId) {
      throw new Error('You do not have permission to update this mood');
    }

    return await this.postgraphileService.update(this.moodsTable, id, updateMoodInput) as Mood;
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const mood = await this.findOne(id);

    if (mood.userId !== userId) {
      throw new Error('You do not have permission to delete this mood');
    }

    return await this.postgraphileService.delete(this.moodsTable, id);
  }

  async getUserMoodStreak(userId: string): Promise<number> {
    // Get all user moods using postgraphile
    const moodsQuery = `
      SELECT * FROM ${this.moodsTable}
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
    `;
    
    const { rows: moods } = await this.postgraphileService.query(moodsQuery, [userId]);

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