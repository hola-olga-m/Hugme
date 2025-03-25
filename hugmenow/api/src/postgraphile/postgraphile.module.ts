import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostGraphileProvider } from './postgraphile.provider';
import { PostGraphileService } from './postgraphile.service';
import { PostGraphileController } from './postgraphile.controller';
import { MigrationRunner } from './migration.runner';

@Module({})
export class PostGraphileModule {
  static forRootAsync(): DynamicModule {
    return {
      module: PostGraphileModule,
      imports: [ConfigModule],
      providers: [
        PostGraphileProvider,
        PostGraphileService,
        MigrationRunner, // Added migration runner
      ],
      controllers: [PostGraphileController],
      exports: [PostGraphileService],
      global: true,
    };
  }
}