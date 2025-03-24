import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { HugRequestStatus } from '../entities/hug-request.entity';

@InputType()
export class RespondToRequestInput {
  @Field()
  @IsUUID()
  requestId: string;

  @Field(() => String)
  @IsEnum(HugRequestStatus, {
    message: 'Status must be either ACCEPTED, DECLINED, or CANCELLED',
  })
  status: HugRequestStatus;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;
}