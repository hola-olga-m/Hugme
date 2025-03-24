import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsString, IsEnum, IsOptional } from 'class-validator';
import { HugType } from '../entities/hug.entity';

@InputType()
export class SendHugInput {
  @Field()
  @IsUUID()
  recipientId: string;

  @Field(() => HugType)
  @IsEnum(HugType)
  type: HugType;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;
}