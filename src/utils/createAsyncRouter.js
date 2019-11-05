const {Router} = require('express');
const loggers = require('../loggers');

function wrapAsyncHandler(fn, nextLocation = null) {
	return (...fnArgs) => {
		const nextAt = nextLocation === null ? fnArgs.length - 1 : nextLocation;
		const nextOriginal = fnArgs[nextAt];
		
		let nextCalled = false;
		fnArgs[nextAt] = (...nextArgs) => {
			nextCalled = true;
			return nextOriginal(...nextArgs);
		};
		
		fn(...fnArgs).catch(err => {
			if(!nextCalled) {
				nextOriginal(err);
				return;
			}
			
			loggers.root.fatal(err);
		});
	};
}

module.exports = function createAsyncRouter() {
	const router = new Router();
	const monkeyPatchNames = [
		"all", "checkout", "copy", "delete", "get", "head",
		"lock", "merge", "mkactivity", "mkcol", "move",
		"m-search", "notify", "options", "patch", "post",
		"purge", "put", "report", "search", "subscribe",
		"trace", "unlock", "unsubscribe", "use"
	];
	
	return new Proxy(router, {
		get(target, name) {
			if(monkeyPatchNames.includes(name)) {
				return (...args) => {
					args.map(fn => {
						if(typeof fn !== 'function') return fn;
						
						return wrapAsyncHandler(fn);
					});
					
					return target[name](...args);
				};
			}
			
			if(name === 'param') {
				return (...args) => {
					args[args.length - 1] = wrapAsyncHandler(
						args[args.length - 1],
						2
					);
					
					return target[name](...args);
				};
			}
			
			return target[name];
		}
	});
};
