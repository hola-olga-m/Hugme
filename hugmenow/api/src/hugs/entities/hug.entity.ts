import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

export enum HugType {
  QUICK = 'QUICK',
  WARM = 'WARM',
  SUPPORTIVE = 'SUPPORTIVE',
  COMFORTING = 'COMFORTING',
  ENCOURAGING = 'ENCOURAGING',
  CELEBRATORY = 'CELEBRATORY',
}

registerEnumType(HugType, {
  name: 'HugType',
  description: 'The type of hug sent',
});

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

  @Field(() => User)
  recipient: User;

  @Field()
  recipientId: string;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;
}