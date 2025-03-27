import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { FriendshipStatus } from '../entities/friendship.entity';

@InputType()
export class UpdateFriendshipInput {
  @Field()
  @IsUUID()
  friendshipId: string;

  @Field(() => FriendshipStatus, { nullable: true })
  @IsEnum(FriendshipStatus)
  @IsOptional()
  status?: FriendshipStatus;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  followMood?: boolean;
}