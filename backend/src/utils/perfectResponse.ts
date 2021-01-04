import { ObjectType, Field } from 'type-graphql';
import { User } from '../entities/User';
import { Post } from '../entities/Post';

@ObjectType()
export class FieldError {
	@Field()
	statusCode?: number;
	@Field()
	target?: string;
	@Field()
	message: string;
}

@ObjectType()
export class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@ObjectType()
export class PostResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Post, { nullable: true })
	post?: Post;
}

@ObjectType()
export class SuccessResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Boolean)
	success: Boolean;
}
