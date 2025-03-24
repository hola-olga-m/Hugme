import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsInt, IsString, IsBoolean, IsOptional, Min, Max, IsUUID } from 'class-validator';

@InputType()
export class UpdateMoodInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  score?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}