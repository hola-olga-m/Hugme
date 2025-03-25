import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../users/entities/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AnonymousLoginInput } from './dto/anonymous-login.input';
import { UsersService } from '../users/users.service';
import { PostGraphileService } from '../postgraphile/postgraphile.service';

@Injectable()
export class AuthService {
  private readonly usersTable = 'users';
  
  constructor(
    private usersService: UsersService,
    private postgraphileService: PostGraphileService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const users = await this.postgraphileService.findWhere(this.usersTable, { email }) as User[];
      const user = users[0];
      
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      
      return null;
    } catch (error) {
      return null;
    }
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
    try {
      // Check by username
      const usersByUsername = await this.postgraphileService.findWhere(this.usersTable, { username: registerInput.username }) as User[];
      // Check by email
      const usersByEmail = await this.postgraphileService.findWhere(this.usersTable, { email: registerInput.email }) as User[];
      
      if (usersByUsername.length > 0 || usersByEmail.length > 0) {
        throw new ConflictException('Username or email already exists');
      }
      
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(registerInput.password, salt);
      
      // Create new user
      const userData = {
        ...registerInput,
        password: hashedPassword,
        id: uuidv4(),
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const savedUser = await this.postgraphileService.insert(this.usersTable, userData) as User;
      const { password, ...result } = savedUser;
      
      return {
        accessToken: this.generateToken(result),
        user: result,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async anonymousLogin(anonymousLoginInput: AnonymousLoginInput) {
    // Create a random email for anonymous user
    const randomEmail = `anonymous_${uuidv4()}@hug-me-now.temp`;
    const randomUsername = `guest_${uuidv4().substring(0, 8)}`;
    const randomPassword = uuidv4();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Create anonymous user using UsersService
    try {
      const savedUser = await this.usersService.createAnonymousUser(
        anonymousLoginInput.nickname, 
        anonymousLoginInput.avatarUrl
      );
      
      const { password, ...result } = savedUser;
      
      return {
        accessToken: this.generateToken(result),
        user: result,
      };
    } catch (error) {
      throw new Error(`Anonymous login failed: ${error.message}`);
    }
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
}