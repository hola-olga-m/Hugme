import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
  description: 'Types of hugs that can be sent',
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
    default: HugType.QUICK,
  })
  type: HugType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  message?: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Field()
  @Column()
  senderId: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Field()
  @Column()
  recipientId: string;

  @Field()
  @Column({ default: false })
  isRead: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}