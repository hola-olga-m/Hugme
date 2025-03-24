import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString, IsBoolean, IsOptional, Min, Max } from 'class-validator';

@InputType()
export class CreateMoodInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field()
  @IsBoolean()
  isPublic: boolean;
}