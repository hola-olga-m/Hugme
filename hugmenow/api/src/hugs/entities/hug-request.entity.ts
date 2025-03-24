import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
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
@Entity('hug_requests')
export class HugRequest {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  message?: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Field()
  @Column({ name: 'requester_id' })
  requesterId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient?: User;

  @Field({ nullable: true })
  @Column({ name: 'recipient_id', nullable: true })
  recipientId?: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isCommunityRequest: boolean;

  @Field(() => HugRequestStatus)
  @Column({
    type: 'enum',
    enum: HugRequestStatus,
    default: HugRequestStatus.PENDING,
  })
  status: HugRequestStatus;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  respondedAt?: Date;
}