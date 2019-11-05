const config = require('./config');
const database = require('./database');
const express = require('express');
const loggers = require('./loggers');
const middlewareAcl = require('./middlewares/acl');
const middlewareAuth = require('./middlewares/auth');
const middlewareLogger = require('./middlewares/logger');
const routeArchive = require('./routes/archive');
const routeBoard = require('./routes/board');
const routeUser = require('./routes/user');

const port = parseInt(process.env.PORT) || '8080';

(async () => {
	await config.init();
	await database.init();
	
	const app = express();
	app.set('port', port);
	app.set('trust proxy', 'loopback');
	
	app.use(middlewareLogger(loggers.express));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(cookieParser());
	app.use(config.middleware());
	app.use(database.middleware());
	app.use(middlewareAuth());
	app.use(middlewareAcl());
	app.use('/archive', routeArchive);
	app.use('/board', routeBoard);
	app.use('/user', routeUser);
	
	app.listen(app.get('port'));
	
	loggers.root.info(`Listening on port ${port}`);
})();
