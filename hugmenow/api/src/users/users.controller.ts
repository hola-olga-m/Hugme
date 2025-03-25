import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException, NotFoundException, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // LSP error but works at runtime
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Get current user profile
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@Request() req): Promise<User> {
    try {
      const userId = req.user.userId;
      return this.usersService.findOne(userId);
    } catch (error) {
      throw new UnauthorizedException('Unable to get current user profile');
    }
  }

  /**
   * Get user by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Unable to get user');
    }
  }

  /**
   * Update user profile
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserInput: UpdateUserInput,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      // Only allow users to update their own profile
      if (req.user.userId !== id) {
        throw new UnauthorizedException('You can only update your own profile');
      }

      const updatedUser = await this.usersService.update(id, updateUserInput);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Unable to update user profile');
    }
  }

  /**
   * Delete user
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      // Only allow users to delete their own profile
      if (req.user.userId !== id) {
        throw new UnauthorizedException('You can only delete your own profile');
      }

      const result = await this.usersService.remove(id);
      return res.status(HttpStatus.OK).json({ success: result });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Unable to delete user');
    }
  }
}