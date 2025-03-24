import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { HugType } from '../entities/hug.entity';

@InputType()
export class SendHugInput {
  @Field()
  @IsUUID()
  recipientId: string;

  @Field(() => String)
  @IsEnum(HugType)
  type: HugType;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;
}