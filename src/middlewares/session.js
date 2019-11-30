const crypto = require('crypto');

module.exports = async (req, res, next) => {
	let session = {};
	let buffer = new Map;
	let sessKey = '';
	
	const descriptor = {
		get(key) {
			if(buffer.has(key))
				return buffer.get(key);
			
			else if(session.hasOwnProperty(key))
				return session[key];
			
			return undefined;
		},
		
		set(key, value) {
			buffer.set(key, value);
		},
		
		async flush() {
			const hsetArgs = [sessKey];
			buffer.forEach((value, key) => hsetArgs.push(key, value));
			
			await req.redis.hset(hsetArgs);
		},
		
		async reallocate() {
			const random = await new Promise((resolve, reject) => {
				crypto.randomBytes(32, (err, randomBytes) => {
					if(err) return reject(err);
					resolve(randomBytes.toString('hex'));
				});
			});
			
			sessKey = `sess_${random}`;
			
			res.cookie('sessKey', random, {
				httpOnly: true,
				secure: req.app.get('env') === 'development',
				maxAge: req.config.security.sessionExpiresIn
			});
		}
	};
	
	if(req.cookies.sessKey && typeof req.cookies.sessKey === 'string') {
		sessKey = `sess_${req.cookies.sessKey}`;
		session = await req.redis.hgetall(sessKey);
	} else {
		await descriptor.reallocate();
	}
	
	req.session = new Proxy(session, {
		get(target, key) {
			if(descriptor.hasOwnProperty(key))
				return descriptor[key];
			
			return descriptor.get(key);
		},
		
		set(target, key, value) {
			if(descriptor.hasOwnProperty(key))
				return;
			
			descriptor.set(key, value);
		}
	});
	
	next();
};
