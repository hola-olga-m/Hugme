import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HugType } from '../entities/hug.entity';
import { ExternalRecipientInput } from './external-recipient.input';

@InputType()
export class SendHugInput {
  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  recipientId?: string;

  @Field(() => ExternalRecipientInput, { nullable: true })
  @ValidateNested()
  @Type(() => ExternalRecipientInput)
  @IsOptional()
  externalRecipient?: ExternalRecipientInput;

  @Field(() => HugType)
  @IsEnum(HugType)
  type: HugType;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;
}