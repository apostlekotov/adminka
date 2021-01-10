import { ObjectType, Field, ID } from 'type-graphql';
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
	OneToMany,
	RelationId,
} from 'typeorm';
import { IsEmail, Matches } from 'class-validator';

import { Post } from './Post';

const usernamePattern = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{2,}$/g;

export const Roles = ['superadmin', 'admin', 'moderator'];

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column()
	@Matches(usernamePattern, {
		message: 'Username must match the pattern',
	})
	username!: string;

	@Field()
	@Column({ unique: true })
	@IsEmail()
	email!: string;

	@Field()
	@Column({ default: false })
	confirmed!: boolean;

	@Field()
	@Column({ enum: Roles, nullable: true })
	role: boolean;

	@Column()
	password!: string;

	@Field(() => [Post])
	@OneToMany(() => Post, (post) => post.publisher)
	// @TypeormLoader(() => Post, (user: User) => user.postIds)
	posts?: Post[];

	@RelationId((user: User) => user.posts)
	postIds: number[];

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;
}
