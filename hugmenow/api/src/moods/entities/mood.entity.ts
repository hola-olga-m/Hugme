import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Min, Max } from 'class-validator';

@ObjectType()
export class Mood {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  @Min(1)
  @Max(10)
  score: number;

  @Field({ nullable: true })
  note?: string;

  @Field()
  isPublic: boolean;

  @Field(() => User)
  user: User;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;
}