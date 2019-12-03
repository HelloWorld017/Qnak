const bytes = require('bytes');
const chalk = require('chalk');
const onFinished = require('on-finished');

const httpTypes = {get: '↓', post: '↑', patch: '▲', put: '≫', delete: '×', etc: '◆'};

module.exports = expressLogger => (req, res, next) => {
	req.startTime = Date.now();
	
	onFinished(res, () => {
		const icon = `${httpTypes[req.method.toLowerCase()] || httpTypes.etc} ${req.method.toLowerCase()}`;
		
		let color = 'cyan';
		const statusType = Math.floor(res.statusCode / 100);
		if (statusType === 2) color = 'green';
		else if(statusType === 4) color = 'yellow';
		else if (statusType === 5) color = 'red';
		
		const method = chalk[color](icon);
		const url = chalk.grey(req.originalUrl);
		const status = chalk[color](res.statusCode);
		
		const elapsed = Date.now() - req.startTime;
		const elapsedStr = chalk.grey(
			(elapsed < 10000) ? elapsed.toString() + 'ms' :
				(elapsed < 1e7) ? Math.floor(elapsed / 1000).toString() + 's' : '-----'
		);
		
		let length = '';
		const size = res.getHeader('content-length');
		if (~[204, 205, 304].indexOf(res.statusCode)) {
			length = ''
		} else if (size == null) {
			length = '-'
		} else {
			length = bytes(size);
		}
		length = chalk.grey(length);
		
		const user = req.friendlyUid ? chalk.cyan(`@${req.friendlyUid}`) : '';
		
		expressLogger.http(`${method} ${url} ${status} ${elapsedStr} ${length} ${user}`);
	});
	
	next();
};
