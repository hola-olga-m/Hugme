import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateHugRequestInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  recipientId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isCommunityRequest: boolean;
}