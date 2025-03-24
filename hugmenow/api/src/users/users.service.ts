import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
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

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
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

    const user = this.usersRepository.create({
      ...createUserData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    // If password is provided, hash it
    if (updateUserData.password) {
      const salt = await bcrypt.genSalt();
      updateUserData.password = await bcrypt.hash(updateUserData.password, salt);
    }

    Object.assign(user, { 
      ...updateUserData,
      updatedAt: new Date(),
    });

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    if (result.affected && result.affected > 0) {
      return true;
    }
    throw new NotFoundException(`User with ID ${id} not found`);
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