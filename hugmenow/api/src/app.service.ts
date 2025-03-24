import { Injectable } from '@nestjs/common';

export interface AppInfo {
  name: string;
  version: string;
  description: string;
  endpoints: {
    graphql: string;
    api: string;
  };
  paths: {
    login: string;
    register: string;
    dashboard: string;
    moodTracker: string;
    hugCenter: string;
    profile: string;
    info: string;
  };
  features: string[];
  status: string;
}

@Injectable()
export class AppService {
  getHome(): string {
    // create Home page content from HomePage.tsx
    return this.getHomeContent();
  }

  getHomeContent(): string {
    return `
    <Home />
    `;
  }
  getAppInfo(): AppInfo {
    return {
      name: 'Hug Me Now',
      version: '1.0.0',
      description:
        'A platform for emotional wellness through virtual hugs and mood tracking',
      endpoints: {
        graphql: '/graphql',
        api: '/api',
      },
      paths: {
        login: '/login',
        register: '/register',
        dashboard: '/dashboard',
        moodTracker: '/mood-tracker',
        hugCenter: '/hug-center',
        profile: '/profile',
        info: '/info',
      },
      features: [
        'User authentication with JWT',
        'Mood tracking and history',
        'Virtual hugs exchange',
        'Hug requests',
        'Public and private mood sharing',
      ],
      status: 'online',
    };
  }
}
