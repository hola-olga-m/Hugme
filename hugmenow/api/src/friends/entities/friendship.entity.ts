import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED'
}

registerEnumType(FriendshipStatus, {
  name: 'FriendshipStatus',
  description: 'The status of a friendship between two users',
});

@ObjectType()
export class Friendship {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  requester: User;

  @Field()
  requesterId: string;

  @Field(() => User)
  recipient: User;

  @Field()
  recipientId: string;

  @Field(() => FriendshipStatus)
  status: FriendshipStatus;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  followsMood: boolean;
}