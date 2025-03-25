import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

export enum HugRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(HugRequestStatus, {
  name: 'HugRequestStatus',
  description: 'The status of a hug request',
});

@ObjectType()
export class HugRequest {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => User)
  requester: User;

  @Field()
  requesterId: string;

  @Field(() => User, { nullable: true })
  recipient?: User;

  @Field({ nullable: true })
  recipientId?: string;

  @Field()
  isCommunityRequest: boolean;

  @Field(() => HugRequestStatus)
  status: HugRequestStatus;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  respondedAt?: Date;
}