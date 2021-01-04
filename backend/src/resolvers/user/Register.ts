import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { validate } from 'class-validator';

import { ContextType } from '../../utils/types';
import { UserResponse, FieldError } from '../../utils/perfectResponse';

import { User } from '../../entities/User';

@Resolver(User)
export class RegisterResolver {
	@Mutation(() => UserResponse)
	async register(
		@Arg('username') username: string,
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { req }: ContextType
	): Promise<UserResponse> {
		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
			confirmed: false,
		});

		let newErrorsArray: FieldError[] = [];

		if (
			validate(user).then((errorsArray) => {
				errorsArray.map((err) => {
					newErrorsArray.push({
						target: err.property,
						message: err.constraints?.matches || `${err.property} is not valid`,
					});
				});
			})
		) {
			return {
				errors: newErrorsArray,
			};
		}

		try {
			user.save();

			req.session.userId = user.id;

			return { user };
		} catch (err) {
			if (err.detail.includes('already exists')) {
				return {
					errors: [
						{
							target: 'email',
							message: 'user already exists',
						},
					],
				};
			}
		}

		return { user };
	}
}
