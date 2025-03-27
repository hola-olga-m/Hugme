import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { ExternalRecipientType } from '../dto/external-recipient.input';

export enum HugType {
  QUICK = 'QUICK',
  WARM = 'WARM',
  SUPPORTIVE = 'SUPPORTIVE',
  COMFORTING = 'COMFORTING',
  ENCOURAGING = 'ENCOURAGING',
  CELEBRATORY = 'CELEBRATORY',
  // Map PNG types to enum values
  StandardHug = 'STANDARD',
  ComfortingHug = 'COMFORTING',
  EnthusiasticHug = 'ENCOURAGING',
  GroupHug = 'GROUP',
  SupportiveHug = 'SUPPORTIVE',
  VirtualHug = 'VIRTUAL',
  RelaxingHug = 'RELAXING',
  WelcomeHug = 'WELCOME',
  FriendlyHug = 'FRIENDLY',
  GentleHug = 'GENTLE',
  FamilyHug = 'FAMILY',
  SmilingHug = 'SMILING',
}

registerEnumType(HugType, {
  name: 'HugType',
  description: 'The type of hug sent',
});

@ObjectType()
export class ExternalRecipient {
  @Field(() => String)
  type: ExternalRecipientType;

  @Field()
  contact: string;
}

@ObjectType()
export class Hug {
  @Field(() => ID)
  id: string;

  @Field(() => HugType)
  type: HugType;

  @Field({ nullable: true })
  message?: string;

  @Field(() => User)
  sender: User;

  @Field()
  senderId: string;

  @Field(() => User, { nullable: true })
  recipient?: User;

  @Field({ nullable: true })
  recipientId?: string;

  @Field(() => ExternalRecipient, { nullable: true })
  externalRecipient?: ExternalRecipient;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;
}