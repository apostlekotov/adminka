import { Query, Resolver, Arg, Mutation, Ctx } from 'type-graphql';
import { SuccessResponse } from '../../utils/perfectResponse';
import { ContextType } from '../../utils/types';

import { User } from '../../entities/User';

@Resolver()
export class UserResolver {
	@Query(() => [User])
	async users() {
		return await User.find({ relations: ['posts'] });
	}

	@Query(() => User, { nullable: true })
	async me(@Ctx() { req }: ContextType) {
		if (!req.session.userId) {
			return null;
		}

		const user = await User.findOne({ id: req.session.userId });

		return user;
	}

	@Mutation(() => SuccessResponse)
	async deleteUser(@Arg('id') id: number): Promise<SuccessResponse> {
		if (!(await User.findOne({ id }))) {
			return {
				errors: [
					{
						statusCode: 404,
						message: 'User not found',
					},
				],
				success: false,
			};
		}

		await User.delete({ id });

		return { success: true };
	}
}
