import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
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
@Entity('hugs')
export class Hug {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field(() => HugType)
  @Column({
    type: 'enum',
    enum: HugType,
    default: HugType.QUICK,
  })
  type: HugType;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  message?: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Field()
  @Column({ name: 'sender_id' })
  senderId: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Field()
  @Column({ name: 'recipient_id' })
  recipientId: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isRead: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}