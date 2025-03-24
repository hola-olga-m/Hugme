import { Injectable } from '@nestjs/common';

export interface AppInfo {
  name: string;
  version: string;
  description: string;
  endpoints: {
    graphql: string;
    api: string;
  };
  features: string[];
  status: string;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Hug Me Now API!';
  }

  getAppInfo(): AppInfo {
    return {
      name: 'Hug Me Now',
      version: '1.0.0',
      description: 'A platform for emotional wellness through virtual hugs and mood tracking',
      endpoints: {
        graphql: '/graphql',
        api: '/api',
      },
      features: [
        'User authentication with JWT',
        'Mood tracking and history',
        'Virtual hugs exchange',
        'Hug requests',
        'Public and private mood sharing',
      ],
      status: 'online'
    };
  }
}