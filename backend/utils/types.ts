import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type ContextType = {
	req: Request & { session: Express.Session };
	res: Response;
	redis: Redis;
};
