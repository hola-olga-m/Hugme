import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class AnonymousLoginInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(30)
  nickname: string;

  @Field({ nullable: true })
  avatarUrl?: string;
}