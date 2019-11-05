const config = require('./config');

const {Client: ElasticClient} = require('@elastic/elasticsearch');
const {MongoClient} = require('mongodb');
const RedisClient = require('ioredis');

module.exports = {
	mongo: null,
	elastic: null,
	redis: null,
	
	async init() {
		await this.initMongo();
		this.initElastic();
		this.initRedis();
	},
	
	async initMongo() {
		let mongoUrl = 'mongodb://';
		
		if(config.store.db.mongodb.id) {
			mongoUrl += `${config.store.db.mongodb.id}:${config.store.db.mongodb.pw}@`;
		}
		mongoUrl += `${config.store.db.mongodb.url}:${config.store.db.mongodb.port}`;
	
		const client = await MongoClient.connect(
			mongoUrl,
			{useNewUrlParser: true}
		);
	
		this.mongo = client.db(config.store.db.name);
	},
	
	initElastic() {
		let elasticUrl = 'http://';
		elasticUrl += `${config.store.db.elastic.url}:${config.store.db.elastic.port}`;
		
		const client = new ElasticClient({node: elasticUrl});
		this.elastic = client;
	},
	
	initRedis() {
		this.redis = new RedisClient(config.store.db.redis.url);
	},
	
	middleware() {
		return (req, res, next) => {
			req.mongo = this.mongo;
			req.elastic = this.elastic;
			req.redis = this.redis;
			next();
		};
	}
};
