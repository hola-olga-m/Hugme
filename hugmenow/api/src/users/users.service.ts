import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

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
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserData: Partial<User>): Promise<User> {
    // Check if email already exists
    const emailExists = await this.findByEmail(createUserData.email);
    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    // Check if username already exists
    const usernameExists = await this.findByUsername(createUserData.username);
    if (usernameExists) {
      throw new ConflictException('Username already in use');
    }

    // Hash password if provided
    if (createUserData.password) {
      createUserData.password = await bcrypt.hash(createUserData.password, 10);
    }

    const user = this.usersRepository.create(createUserData);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserData: Partial<User>): Promise<User> {
    // Check if user exists
    await this.findOne(id);

    // Hash password if updated
    if (updateUserData.password) {
      updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
    }

    await this.usersRepository.update(id, updateUserData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected > 0;
  }

  async createAnonymousUser(nickname: string, avatarUrl?: string): Promise<User> {
    const anonymousUser = this.usersRepository.create({
      username: `anon_${Date.now()}`,
      email: `anon_${Date.now()}@anonymous.com`,
      name: nickname,
      password: await bcrypt.hash(Math.random().toString(36), 10),
      avatarUrl,
      isAnonymous: true,
    });

    return this.usersRepository.save(anonymousUser);
  }
}