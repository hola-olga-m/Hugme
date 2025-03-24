import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => HugType)
  @Column({
    type: 'enum',
    enum: HugType,
    default: HugType.SUPPORTIVE,
  })
  type: HugType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  message?: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ name: 'sender_id' })
  @Field()
  senderId: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column({ name: 'recipient_id' })
  @Field()
  recipientId: string;

  @Field()
  @Column({ default: false })
  isRead: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}