
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string | undefined): Promise<User | null> {
    if (!email) return null;
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string | undefined): Promise<User | null> {
    if (!username) return null;
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserData: Partial<User>): Promise<User> {
    // Check if email exists
    if (createUserData.email) {
      const emailExists = await this.findByEmail(createUserData.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Check if username exists
    if (createUserData.username) {
      const usernameExists = await this.findByUsername(createUserData.username);
      if (usernameExists) {
        throw new Error('Username already exists');
      }
    }

    const user = this.usersRepository.create(createUserData);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserData);
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async createAnonymousUser(nickname: string, avatarUrl?: string): Promise<User> {
    return this.create({
      id: uuidv4(),
      username: `anon_${uuidv4().slice(0, 8)}`,
      nickname,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4().slice(0, 8)}`,
      isAnonymous: true,
    });
  }
}
