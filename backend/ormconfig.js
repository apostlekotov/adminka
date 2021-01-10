module.exports = {
	type: process.env.DB_TYPE,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	synchronize: process.env.SYNCHRONIZE,
	logging: process.env.DB_LOGGING,
	username: process.env.DB_USERNAME,
	database: process.env.DB_DATABASE,
	entities: ['entities/*.*'],
};
