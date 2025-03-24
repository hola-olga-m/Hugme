import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mood } from './entities/mood.entity';
import { MoodsService } from './moods.service';
import { MoodsResolver } from './moods.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mood]),
    UsersModule,
  ],
  providers: [MoodsService, MoodsResolver],
  exports: [MoodsService],
})
export class MoodsModule {}