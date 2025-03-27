import { Injectable, NotFoundException } from '@nestjs/common';
import { Mood } from './entities/mood.entity';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
import { UsersService } from '../users/users.service';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
import { FriendsService } from '../friends/friends.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MoodsService {
  private readonly moodsTable = 'moods';
  
  constructor(
    private postgraphileService: PostGraphileService,
    private usersService: UsersService,
    private friendsService: FriendsService,
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

  async findPublic(limit?: number, offset?: number): Promise<Mood[]> {
    let query = `
      SELECT * FROM ${this.moodsTable}
      WHERE is_public = TRUE
      ORDER BY created_at DESC
    `;
    
    const queryParams: any[] = [];
    
    if (limit !== undefined) {
      query += ' LIMIT $1';
      queryParams.push(limit);
      
      if (offset !== undefined) {
        query += ' OFFSET $2';
        queryParams.push(offset);
      }
    }
    
    const { rows: publicMoods } = await this.postgraphileService.query(query, queryParams);
    
    // Convert to Mood entities
    const moods: Mood[] = [];
    for (const row of publicMoods) {
      moods.push(await this.convertToMoodEntity(row));
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
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    const { rows: moods } = await this.postgraphileService.query(moodsQuery, [userId]);

    if (moods.length === 0) {
      return 0;
    }

    // Initialize streak counter
    let streak = 1;
    let currentDate = new Date(moods[0].created_at);
    currentDate.setHours(0, 0, 0, 0);

    // Check for consecutive days
    for (let i = 1; i < moods.length; i++) {
      const moodDate = new Date(moods[i].created_at);
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

  /**
   * Helper method to convert database row to Mood entity
   * @param row Database row
   * @returns Partial Mood entity
   */
  private async convertToMoodEntity(row: any): Promise<Mood> {
    // Create a partial mood object
    const mood = new Mood();
    mood.id = row.id;
    mood.score = row.score || row.mood_rating || 0;
    mood.note = row.note || row.mood_description || '';
    mood.isPublic = row.is_public;
    mood.userId = row.user_id;
    mood.createdAt = row.created_at;
    
    // Load user data
    if (row.user_id) {
      try {
        mood.user = await this.usersService.findOne(row.user_id);
      } catch (error) {
        // If user not found, create a default user (will be replaced later)
        mood.user = await this.usersService.findOne(row.user_id);
      }
    }
    
    return mood;
  }

  /**
   * Find moods from a user's friends
   * @param userId The user ID whose friends' moods to find
   * @param limit Optional limit on the number of moods to return, default 20
   * @param offset Optional offset for pagination
   * @returns Array of friends' recent moods
   */
  async findFriendsMoods(userId: string, limit: number = 20, offset?: number): Promise<Mood[]> {
    // Get the user's friends
    const friendships = await this.friendsService.findFriends(userId);
    
    if (!friendships || friendships.length === 0) {
      return [];
    }

    // Extract friend IDs
    const friendIds = friendships.map(friendship => 
      friendship.requesterId === userId ? friendship.recipientId : friendship.requesterId
    );

    // Query to get recent public moods from friends
    let moodsQuery = `
      SELECT * FROM ${this.moodsTable}
      WHERE user_id = ANY($1) AND is_public = TRUE
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    const queryParams = [friendIds, limit];
    
    if (offset !== undefined) {
      moodsQuery += ' OFFSET $3';
      queryParams.push(offset);
    }
    
    const { rows: friendMoods } = await this.postgraphileService.query(
      moodsQuery, 
      queryParams
    );

    // Convert to Mood entities
    const moods: Mood[] = [];
    for (const row of friendMoods) {
      moods.push(await this.convertToMoodEntity(row));
    }
    
    return moods;
  }
}