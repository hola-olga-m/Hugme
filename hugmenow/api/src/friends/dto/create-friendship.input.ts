import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class CreateFriendshipInput {
  @Field()
  @IsUUID()
  recipientId: string;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  followMood?: boolean;
}