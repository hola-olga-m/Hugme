import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MoodsService } from '../moods/moods.service';
import { HugsService } from '../hugs/hugs.service';

@Injectable()
export class ContextBuilder {
  private readonly logger = new Logger(ContextBuilder.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private moodsService: MoodsService,
    private hugsService: HugsService
  ) {}

  async build({ req, connection }): Promise<any> {
    // Handle WebSocket connections for subscriptions
    if (connection) {
      return {
        ...connection.context,
        dataSources: {
          usersService: this.usersService,
          moodsService: this.moodsService,
          hugsService: this.hugsService
        }
      };
    }

    // Handle HTTP requests
    const request = req as Request;
    const context: any = {
      req,
      dataSources: {
        usersService: this.usersService,
        moodsService: this.moodsService,
        hugsService: this.hugsService
      }
    };

    try {
      // Extract token from Authorization header
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decodedToken = this.jwtService.verify(token);
        
        if (decodedToken && decodedToken.sub) {
          // Fetch full user from the database
          const user = await this.usersService.findOne(decodedToken.sub);
          if (user) {
            context.user = user;
            this.logger.debug(`User ${user.id} authenticated`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error building context: ${error.message}`);
      // Do not throw, just don't add user to context
    }

    return context;
  }
}