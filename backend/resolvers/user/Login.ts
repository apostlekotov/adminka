import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { UserResponse } from '../../utils/perfectResponse';
import { ContextType } from '../../utils/types';

import { User } from '../../entities/User';

@Resolver(User)
export class LoginResolver {
	@Mutation(() => UserResponse)
	async login(
		@Arg('identifier') identifier: string,
		@Arg('password') password: string,
		@Ctx() { req }: ContextType
	): Promise<UserResponse> {
		const user = await User.findOne(
			identifier.includes('@')
				? { where: { email: identifier } }
				: { where: { username: identifier } }
		);

		if (!user) {
			return {
				errors: [
					{
						target: 'identifier',
						message: "User doesn't exist",
					},
				],
			};
		}

		const valid = await bcrypt.compare(password, user.password);

		if (!valid) {
			return {
				errors: [
					{
						target: 'password',
						message: 'Incorrect password',
					},
				],
			};
		}

		req.session.userId = user.id;

		return { user };
	}
}
