import { ObjectType, Field, ID } from 'type-graphql';
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
	ManyToOne,
	RelationId,
} from 'typeorm';

import { User } from './User';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ unique: true })
	title!: string;

	@Field()
	@Column()
	description!: string;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.posts)
	// @TypeormLoader(() => User, (post: Post) => post.publisherId)
	publisher: User;

	@RelationId((post: Post) => post.publisher)
	publisherId: number;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;
}
