import 'reflect-metadata';

import { createConnection } from 'typeorm';
import connectRedis from 'connect-redis';

import Redis from 'ioredis';
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';

import { createSchema } from './src/resolvers/createSchema';

import colors from 'colors';

colors.enable();

const __prod__ = process.env.NODE_ENV === 'production';

(async () => {
	await createConnection();

	const app = express();

	const RedisStore = connectRedis(session);
	const redis = new Redis();

	app.use(
		session({
			name: 'qid',
			store: new RedisStore({ client: redis, disableTouch: true }),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: 'lax', // csrf
				secure: __prod__, // cookie only works in https
				domain: __prod__ ? '.com' : undefined,
			},
			secret: 'rknfdl',
			resave: false,
			saveUninitialized: false,
		})
	);

	const schema = await createSchema();

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({
			req,
			res,
			redis,
		}),
	});

	apolloServer.applyMiddleware({ app });

	app.listen(process.env.PORT, () => {
		console.log(
			`🚀Server started on http://localhost:${process.env.PORT}/graphql`.yellow
				.bold
		);
	});
})().catch((err) => console.log(`Error ${err.message}`.red));
