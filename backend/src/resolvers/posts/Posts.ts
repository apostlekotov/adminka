import { Query, Resolver, Arg, Mutation, Ctx } from 'type-graphql';
import { PostResponse, SuccessResponse } from '../../utils/perfectResponse';
import { ContextType } from '../../utils/types';

import { Post } from '../../entities/Post';
import { User } from '../../entities/User';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	async posts() {
		return await Post.find({ relations: ['publisher'] });
	}

	@Mutation(() => PostResponse)
	async createPost(
		@Arg('title') title: string,
		@Arg('description') description: string,
		@Ctx() { req }: ContextType
	): Promise<PostResponse> {
		let post = undefined;

		const user = await User.findOne({ id: req.session.userId });

		try {
			const post = await Post.create({
				title: title,
				description: description,
				publisher: user,
			}).save();

			return { post };
		} catch (err) {
			if (err.detail.includes('already exists')) {
				return {
					errors: [
						{
							target: 'title',
							message: 'The title has to be unique',
						},
					],
				};
			}

			return { post };
		}
	}

	@Mutation(() => SuccessResponse)
	async deletePost(@Arg('id') id: number): Promise<SuccessResponse> {
		if (!(await Post.findOne({ id }))) {
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

		await Post.delete({ id });

		return { success: true };
	}
}
