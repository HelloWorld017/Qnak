const config = require('./config');
const express = require('express');
const loggers = require('./logger');
const middlewareAcl = require('./middlewares/acl');
const middlewareAuth = require('./middlewares/auth');
const middlewareLogger = require('./middlewares/logger');

const {MongoClient} = require('mongodb');

(async () => {
	await config.init();
	
	const database = await (async () => {
		let mongoUrl = 'mongodb://';
		
		if(config.store.db.id) {
			mongoUrl += `${config.store.db.id}:${config.store.db.pw}@`;
		}
		mongoUrl += `${config.store.db.url}:${config.store.db.port}`;

		const client = await MongoClient.connect(
			mongoUrl,
			{useNewUrlParser: true}
		);

		return client.db(config.store.db.name);
	})();
	
	const app = express();
	app.use(middlewareLogger(loggers.express));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(cookieParser());
	app.use((req, res, next) => (req.db = database) && next());
	app.use(middlewareAuth());
	app.use(middlewareAcl());

})();
