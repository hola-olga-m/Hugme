import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { HugRequestStatus } from '../entities/hug-request.entity';

@InputType()
export class RespondToRequestInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @Field(() => HugRequestStatus)
  @IsNotEmpty()
  @IsEnum(HugRequestStatus)
  status: HugRequestStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;
}