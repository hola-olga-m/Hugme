import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';

export enum ExternalRecipientType {
  EMAIL = 'email',
  TELEGRAM = 'telegram',
}

registerEnumType(ExternalRecipientType, {
  name: 'ExternalRecipientType',
  description: 'The type of external recipient contact',
});

@InputType()
export class ExternalRecipientInput {
  @Field(() => ExternalRecipientType)
  @IsEnum(ExternalRecipientType)
  type: ExternalRecipientType;

  @Field()
  @IsString()
  contact: string;
}