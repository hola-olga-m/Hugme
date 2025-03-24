import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  message?: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({ name: 'requester_id' })
  @Field()
  requesterId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient?: User;

  @Column({ name: 'recipient_id', nullable: true })
  @Field({ nullable: true })
  recipientId?: string;

  @Field()
  @Column({ default: false })
  isCommunityRequest: boolean;

  @Field(() => HugRequestStatus)
  @Column({
    type: 'enum',
    enum: HugRequestStatus,
    default: HugRequestStatus.PENDING,
  })
  status: HugRequestStatus;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ name: 'responded_at', nullable: true })
  respondedAt?: Date;
}