import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLMeshService } from './graphql-mesh.service';
import { GraphQLMeshController } from './graphql-mesh.controller';
import { GraphQLMeshResolver } from './graphql-mesh.resolver';

@Module({
  imports: [ConfigModule],
  providers: [GraphQLMeshService, GraphQLMeshResolver],
  controllers: [GraphQLMeshController],
  exports: [GraphQLMeshService],
})
export class GraphQLMeshModule {}