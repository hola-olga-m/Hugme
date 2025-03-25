import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsOptional, IsUrl } from 'class-validator';

@InputType()
export class AnonymousLoginInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(30)
  nickname: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;
}