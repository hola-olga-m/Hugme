import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import modules
import { UsersModule } from './users/users.module';
import { MoodsModule } from './moods/moods.module';
import { HugsModule } from './hugs/hugs.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';

// Import Postgraphile module
import { PostGraphileModule } from './postgraphile/postgraphile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Replace TypeORM with Postgraphile
    PostGraphileModule.forRootAsync(),
    
    // Keep existing GraphQL endpoint for backward compatibility
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    
    // Feature modules
    UsersModule,
    MoodsModule,
    HugsModule,
    AuthModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}