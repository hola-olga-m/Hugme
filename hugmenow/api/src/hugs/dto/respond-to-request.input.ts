import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';
import { HugRequestStatus } from '../entities/hug-request.entity';

@InputType()
export class RespondToRequestInput {
  @Field()
  @IsUUID()
  requestId: string;

  @Field(() => HugRequestStatus)
  @IsEnum(HugRequestStatus)
  status: HugRequestStatus;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;
}