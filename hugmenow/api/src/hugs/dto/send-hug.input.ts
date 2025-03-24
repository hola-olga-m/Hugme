import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { HugType } from '../entities/hug.entity';

@InputType()
export class SendHugInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @Field(() => HugType)
  @IsNotEmpty()
  @IsEnum(HugType)
  type: HugType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;
}