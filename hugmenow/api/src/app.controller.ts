import { Controller, Get } from '@nestjs/common';
import { AppService, AppInfo } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHome();
  }

  @Get('info')
  getAppInfo(): AppInfo {
    return this.appService.getAppInfo();
  }
}