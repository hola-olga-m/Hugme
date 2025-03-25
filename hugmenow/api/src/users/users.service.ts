import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PostGraphileService } from '../postgraphile/postgraphile.service';

@Injectable()
export class UsersService {
  private readonly usersTable = 'users';
  
  constructor(
    private postgraphileService: PostGraphileService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.postgraphileService.findAll(this.usersTable) as User[];
  }

  async findOne(id: string): Promise<User> {
    const user = await this.postgraphileService.findById(this.usersTable, id) as User;
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const users = await this.postgraphileService.findWhere(this.usersTable, { email }) as User[];
    const user = users[0];
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const users = await this.postgraphileService.findWhere(this.usersTable, { username }) as User[];
    const user = users[0];
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async create(createUserData: Partial<User>): Promise<User> {
    // If password is provided, hash it
    if (createUserData.password) {
      const salt = await bcrypt.genSalt();
      createUserData.password = await bcrypt.hash(createUserData.password, salt);
    }

    // Add timestamps
    const userData = {
      ...createUserData,
      id: createUserData.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.postgraphileService.insert(this.usersTable, userData) as User;
  }

  async update(id: string, updateUserData: Partial<User>): Promise<User> {
    // Verify user exists
    await this.findOne(id);

    // If password is provided, hash it
    if (updateUserData.password) {
      const salt = await bcrypt.genSalt();
      updateUserData.password = await bcrypt.hash(updateUserData.password, salt);
    }

    // Add update timestamp
    const userData = {
      ...updateUserData,
      updatedAt: new Date(),
    };

    return await this.postgraphileService.update(this.usersTable, id, userData) as User;
  }

  async remove(id: string): Promise<boolean> {
    const success = await this.postgraphileService.delete(this.usersTable, id);
    if (!success) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }

  async createAnonymousUser(nickname: string, avatarUrl?: string): Promise<User> {
    // Generate a random username and email for anonymous users
    const randomId = uuidv4().substring(0, 8);
    const username = `anon_${randomId}`;
    const email = `anon_${randomId}@anonymous.com`;
    
    return this.create({
      username,
      email,
      name: nickname,
      avatarUrl,
      isAnonymous: true,
      password: await bcrypt.hash(uuidv4(), 10), // Random password
    });
  }
}