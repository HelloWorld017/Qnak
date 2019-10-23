const config = require('./config');
const database = require('./database');
const express = require('express');
const loggers = require('./logger');
const middlewareAcl = require('./middlewares/acl');
const middlewareAuth = require('./middlewares/auth');
const middlewareLogger = require('./middlewares/logger');
const routeArchive = require('./routes/archive');
const routeBoard = require('./routes/board');
const routeUser = require('./routes/user');

(async () => {
	await config.init();
	await database.init();
	
	const app = express();
	app.use(middlewareLogger(loggers.express));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(cookieParser());
	app.use((req, res, next) => {
		req.config = config.store;
		req.mongo = database.mongo;
		req.elastic = database.elastic;
	});
	app.use(middlewareAuth());
	app.use(middlewareAcl());
	app.use('/archive', routeArchive);
	app.use('/board', routeBoard);
	app.use('/user', routeUser);
})();
