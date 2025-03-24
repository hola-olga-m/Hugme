import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Min, Max } from 'class-validator';

@ObjectType()
@Entity('moods')
export class Mood {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  @Min(1)
  @Max(10)
  score: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note?: string;

  @Field()
  @Column({ default: false })
  isPublic: boolean;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field()
  @Column()
  userId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}