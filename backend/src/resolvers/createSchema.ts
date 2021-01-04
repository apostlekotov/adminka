import { buildSchema } from 'type-graphql';

import { ForgotPasswordResolver } from './user/ForgotPassword';
import { LoginResolver } from './user/Login';
import { LogoutResolver } from './user/Logout';
import { RegisterResolver } from './user/Register';
import { UserResolver } from './user/Users';
import { PostResolver } from './posts/Posts';

export const createSchema = () =>
	buildSchema({
		resolvers: [
			LoginResolver,
			LogoutResolver,
			RegisterResolver,
			ForgotPasswordResolver,
			UserResolver,
			PostResolver,
		],
	});
