const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');
const database = require('./database');
const express = require('express');
const loggers = require('./loggers');
const middlewareAuth = require('./middlewares/auth');
const middlewareLogger = require('./middlewares/logger');
const routeArchive = require('./routes/archive');
const routeBoard = require('./routes/board');
const routePost = require('./routes/post');
const routeUser = require('./routes/user');

const port = parseInt(process.env.PORT) || '8080';

(async () => {
	config.init();
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
	app.get('/', (req, res) => {
		res.status(418).json({
			'qnak': 'A QnA-like application',
			'server': 'Qnak API Server',
			'ok': true
		});
	});
	app.use('/archive', routeArchive);
	app.use('/board', routeBoard);
	app.use('/post', routePost);
	app.use('/user', routeUser);
	app.use((err, req, res, next) => {
		if(err.statusCode) {
			res.status(err.statusCode).json({
				ok: false,
				reason: err.message
			});
			return;
		}
		
		res.status(500).json({
			ok: false,
			reason: 'internal-server'
		});
		
		loggers.express.fatal(err);
	});
	
	app.listen(app.get('port'));
	
	loggers.root.info(`Listening on port ${port}`);
})();
