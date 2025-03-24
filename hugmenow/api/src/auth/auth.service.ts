import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../users/entities/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AnonymousLoginInput } from './dto/anonymous-login.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return {
      accessToken: this.generateToken(user),
      user,
    };
  }

  async register(registerInput: RegisterInput) {
    // Check if username or email already exists
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: registerInput.username },
        { email: registerInput.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerInput.password, 10);

    // Create new user
    const newUser = this.usersRepository.create({
      ...registerInput,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);
    const { password, ...result } = savedUser;

    return {
      accessToken: this.generateToken(result),
      user: result,
    };
  }

  async anonymousLogin(anonymousLoginInput: AnonymousLoginInput) {
    // Create a random email for anonymous user
    const randomEmail = `anonymous_${uuidv4()}@hug-me-now.temp`;
    const randomUsername = `guest_${uuidv4().substring(0, 8)}`;
    const randomPassword = uuidv4();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create anonymous user
    const newUser = this.usersRepository.create({
      username: randomUsername,
      email: randomEmail,
      name: anonymousLoginInput.nickname,
      password: hashedPassword,
      avatarUrl: anonymousLoginInput.avatarUrl,
      isAnonymous: true,
    });

    const savedUser = await this.usersRepository.save(newUser);
    const { password, ...result } = savedUser;

    return {
      accessToken: this.generateToken(result),
      user: result,
    };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
}