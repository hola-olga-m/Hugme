import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HugsService } from './hugs.service';
import { HugsResolver } from './hugs.resolver';
import { Hug } from './entities/hug.entity';
import { HugRequest } from './entities/hug-request.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hug, HugRequest]),
    UsersModule,
  ],
  providers: [HugsService, HugsResolver],
  exports: [HugsService],
})
export class HugsModule {}