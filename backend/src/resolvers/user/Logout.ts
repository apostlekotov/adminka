import { Ctx, Mutation, Resolver } from 'type-graphql';
import { ContextType } from '../../utils/types';

import { User } from '../../entities/User';
@Resolver(User)
export class LogoutResolver {
	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: ContextType) {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				res.clearCookie('qid');
				if (err) {
					console.log(err);
					resolve(false);
					return;
				}

				resolve(true);
			})
		);
	}
}
