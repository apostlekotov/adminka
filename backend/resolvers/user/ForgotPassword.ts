import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { SuccessResponse, UserResponse } from '../../utils/perfectResponse';
import { ContextType } from '../../utils/types';
import { sendEmail } from '../../utils/sendEmail';

import { User } from '../../entities/User';
@Resolver(User)
export class ForgotPasswordResolver {
	@Mutation(() => SuccessResponse)
	async forgotPassword(
		@Arg('identifier') identifier: string,
		@Ctx() { redis }: ContextType
	): Promise<SuccessResponse> {
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
				success: false,
			};
		}

		const token = v4();

		await redis.set(
			'forget-password:' + token,
			user.id,
			'ex',
			1000 * 60 * 60 * 24 * 3 // 3 days
		);

		const url = process.env.HOST + '/change-password/' + token;

		console.log(url);

		await sendEmail(user.email, url);

		return { success: true };
	}

	@Mutation(() => UserResponse)
	async changePassword(
		@Arg('token') token: string,
		@Arg('newPassword') newPassword: string,
		@Ctx() { redis, req }: ContextType
	): Promise<UserResponse> {
		// TODO: Validate Password

		const key = process.env.FORGET_PASSWORD_PREFIX + token;

		const userId = await redis.get(key);

		if (!userId) {
			return {
				errors: [
					{
						target: 'alert',
						message: 'token expired',
					},
				],
			};
		}

		const user = await User.findOne(parseInt(userId));

		if (!user) {
			return {
				errors: [
					{
						target: 'alert',
						message: 'user no longer exists',
					},
				],
			};
		}

		await User.update(
			{ id: user.id },
			{
				password: await bcrypt.hash(newPassword, 12),
			}
		);

		await redis.del(key);

		req.session.userId = user.id; // log in user after change password

		return { user };
	}
}
