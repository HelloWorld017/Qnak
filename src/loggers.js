const {Signale} = require('signale');

const options = {
	types: {
		info: {
			badge: '*',
			color: 'cyan',
			label: 'info',
			logLevel: 'warn'
		},
		
		http: {
			badge: '⇆',
			color: 'grey',
			label: 'http',
			logLevel: 'info'
		},

		error: {
			badge: '×',
			color: 'red',
			label: 'Error',
			logLevel: 'error'
		},

		finish: {
			badge: '∴',
			color: 'green',
			label: 'Finish',
			logLevel: 'info'
		}
	}
};

const signale = new Signale(options);
const logger = {
	_logger(...args) {
		signale._logger(...args);
	}
};

const getLogger = instance => new Proxy(instance, {
	get: function(obj, prop) {
		if(logger[prop]) return logger[prop];

		return obj[prop];
	}
});

module.exports = {
	root: getLogger(signale),
	express: getLogger(signale.scope('express'))
};
