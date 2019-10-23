const {MongoClient} = require('mongodb');
const {Client: ElasticClient} = require('@elastic/elasticsearch');

module.exports = {
	mongo: null,
	elastic: null,
	
	async init() {
		await this.initMongo();
		this.initElastic();
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
	}
};
