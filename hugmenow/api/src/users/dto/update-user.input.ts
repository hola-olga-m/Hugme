import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';
import { IsString, MinLength, IsOptional } from 'class-validator';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['email', 'username'] as const),
) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}