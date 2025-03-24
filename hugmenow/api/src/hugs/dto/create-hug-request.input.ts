import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsString, IsBoolean } from 'class-validator';

@InputType()
export class CreateHugRequestInput {
  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  recipientId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;

  @Field()
  @IsBoolean()
  isCommunityRequest: boolean;
}