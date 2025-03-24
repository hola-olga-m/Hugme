import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
  description: 'Status of a hug request',
});

@ObjectType()
@Entity('hug_requests')
export class HugRequest {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ nullable: true })
  message?: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'requesterId' })
  requester: User;

  @Field()
  @Column()
  requesterId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'recipientId' })
  recipient?: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recipientId?: string;

  @Field()
  @Column({ default: true })
  isCommunityRequest: boolean;

  @Field(() => HugRequestStatus)
  @Column({
    type: 'enum',
    enum: HugRequestStatus,
    default: HugRequestStatus.PENDING,
  })
  status: HugRequestStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
  
  @Field({ nullable: true })
  @Column({ nullable: true })
  respondedAt?: Date;
}