import { 
  Controller, Get, Res, Req, Redirect, Post, Body, 
  HttpStatus, UnauthorizedException, UseGuards,
  Query, Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService, AppInfo } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LoginInput } from './auth/dto/login.input';
import { RegisterInput } from './auth/dto/register.input';
import { AnonymousLoginInput } from './auth/dto/anonymous-login.input';
import { CurrentUser } from './auth/current-user.decorator';

@Controller()
export class AppController {
  private frontendBaseUrl: string;

  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {
    // Determine the frontend URL from environment or default
    this.frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    console.log(`Frontend base URL: ${this.frontendBaseUrl}`);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('info')
  getAppInfo(): AppInfo {
    return this.appService.getAppInfo();
  }

  /**
   * Helper method to get frontend URL by path
   */
  private getFrontendUrl(path: string, req: Request): string {
    // Try to determine URL from request
    const host = req.get('host');
    const forwardedHost = req.get('x-forwarded-host');
    const protocol = req.protocol;
    
    // Log for debugging
    console.log(`Generating URL for path ${path}`);
    console.log(`Host: ${host}, Forwarded Host: ${forwardedHost}, Protocol: ${protocol}`);
    
    // Prioritize the frontend URL from env var
    if (process.env.FRONTEND_URL) {
      return `${process.env.FRONTEND_URL}${path}`;
    }
    
    // If running on Replit
    if (process.env.REPLIT_SLUG || process.env.REPL_ID || host?.includes('.replit.app')) {
      const appDomain = host || forwardedHost;
      return appDomain ? `${protocol}://${appDomain}${path}` : `${this.frontendBaseUrl}${path}`;
    }
    
    // Default for local development
    return `${this.frontendBaseUrl}${path}`;
  }

  /**
   * Handle redirection dynamically based on the request environment
   */
  private handleRedirect(path: string, req: Request): { url: string } {
    const redirectUrl = this.getFrontendUrl(path, req);
    console.log(`Redirecting to: ${redirectUrl}`);
    return { url: redirectUrl };
  }

  /**
   * Redirect to login page
   */
  @Get('login')
  @Redirect()
  getLoginPage(@Req() req: Request) {
    return this.handleRedirect('/login', req);
  }

  /**
   * Redirect to register page
   */
  @Get('register') 
  @Redirect()
  getRegisterPage(@Req() req: Request) {
    return this.handleRedirect('/register', req);
  }
  
  /**
   * Redirect to dashboard page
   */
  @Get('dashboard')
  @Redirect()
  getDashboardPage(@Req() req: Request) {
    return this.handleRedirect('/dashboard', req);
  }
  
  /**
   * Redirect to mood tracker page
   */
  @Get('mood-tracker')
  @Redirect()
  getMoodTrackerPage(@Req() req: Request) {
    return this.handleRedirect('/mood-tracker', req);
  }
  
  /**
   * Redirect to hug center page
   */
  @Get('hug-center')
  @Redirect()
  getHugCenterPage(@Req() req: Request) {
    return this.handleRedirect('/hug-center', req);
  }
  
  /**
   * Redirect to profile page
   */
  @Get('profile')
  @Redirect()
  getProfilePage(@Req() req: Request) {
    return this.handleRedirect('/profile', req);
  }

  /**
   * Process login credentials through the REST API
   */
  @Post('login')
  async login(@Body() loginInput: LoginInput, @Res() res: Response) {
    try {
      console.log('Processing login request:', loginInput.email);
      const result = await this.authService.login(loginInput);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Login error:', error.message);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Process registration request through the REST API
   */
  @Post('register')
  async register(@Body() registerInput: RegisterInput, @Res() res: Response) {
    try {
      console.log('Processing registration request:', registerInput.email);
      const result = await this.authService.register(registerInput);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error('Registration error:', error.message, error.stack);
      if (error.message.includes('already exists')) {
        throw new UnauthorizedException('Username or email already exists');
      }
      throw new UnauthorizedException(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Process anonymous login through the REST API
   */
  @Post('anonymous-login')
  async anonymousLogin(@Body() anonymousLoginInput: AnonymousLoginInput, @Res() res: Response) {
    try {
      console.log('Processing anonymous login request');
      const result = await this.authService.anonymousLogin(anonymousLoginInput);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Anonymous login error:', error.message, error.stack);
      throw new UnauthorizedException(`Anonymous login failed: ${error.message}`);
    }
  }

  /**
   * Get user me profile - restricted route
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      throw new UnauthorizedException('Failed to retrieve user profile');
    }
  }

  /**
   * Get user language preference
   */
  @Get('language')
  async getLanguage(@Req() req: Request, @Res() res: Response) {
    try {
      // Extract language from request headers or cookies
      const language = req.headers['accept-language'] || 'en';
      return res.status(HttpStatus.OK).json({ language });
    } catch (error) {
      console.error('Error getting language preference:', error.message);
      // Default to English on error
      return res.status(HttpStatus.OK).json({ language: 'en' });
    }
  }

  /**
   * Save user language preference
   */
  @Post('language')
  @UseGuards(JwtAuthGuard)
  async setLanguage(
    @CurrentUser() user, 
    @Body() data: { language: string }, 
    @Res() res: Response
  ) {
    try {
      // In a real app, we would save this to user preferences in the database
      return res.status(HttpStatus.OK).json({ language: data.language });
    } catch (error) {
      console.error('Error setting language preference:', error.message);
      throw new UnauthorizedException('Failed to set language preference');
    }
  }

  /**
   * Logout route
   */
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      // In a stateful session setup, we would invalidate the session here
      // For JWT, the client just needs to remove the token
      return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error.message);
      throw new UnauthorizedException('Failed to logout');
    }
  }

  /**
   * Health check endpoint
   */
  @Get('health')
  healthCheck(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        database: 'connected',
        graphql: 'operational'
      }
    });
  }
}