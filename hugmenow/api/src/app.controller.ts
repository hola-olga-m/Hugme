import { Controller, Get, Res, Redirect, Post, Body, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AppService, AppInfo } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginInput } from './auth/dto/login.input';
import { RegisterInput } from './auth/dto/register.input';
import { AnonymousLoginInput } from './auth/dto/anonymous-login.input';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('info')
  getAppInfo(): AppInfo {
    return this.appService.getAppInfo();
  }

  /**
   * Redirect to login page
   */
  @Get('login')
  @Redirect()
  getLoginPage() {
    // Return URL for redirection to frontend login page
    return { url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : 'http://localhost:3001/login' };
  }

  /**
   * Redirect to register page
   */
  @Get('register') 
  @Redirect()
  getRegisterPage() {
    // Return URL for redirection to frontend register page
    return { url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/register` : 'http://localhost:3001/register' };
  }

  /**
   * Process login credentials through the REST API
   */
  @Post('login')
  async login(@Body() loginInput: LoginInput, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginInput);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Process registration request through the REST API
   */
  @Post('register')
  async register(@Body() registerInput: RegisterInput, @Res() res: Response) {
    try {
      const result = await this.authService.register(registerInput);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      throw new UnauthorizedException('Registration failed');
    }
  }

  /**
   * Process anonymous login through the REST API
   */
  @Post('anonymous-login')
  async anonymousLogin(@Body() anonymousLoginInput: AnonymousLoginInput, @Res() res: Response) {
    try {
      const result = await this.authService.anonymousLogin(anonymousLoginInput);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new UnauthorizedException('Anonymous login failed');
    }
  }
}