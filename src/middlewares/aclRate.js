const StatusCodeError = require('../utils/StatusCodeError');

const config = require('../config');
const getParentAcl = require('../utils/getParentAcl');

module.exports = aclName => {
	const parentAcls = getParentAcl(aclName);
	const appliedRateLimit = parentAcls.find(key => config.store.ratelimit.entries[key] !== undefined);
	const appliedScore = config.store.ratelimit.entries[appliedRateLimit];

	return async (req, res, next) => {
		if(!req.acl.fromAllNodes(aclName)) {
			throw new StatusCodeError(403, "Not allowed for the user to do this job.");
		}

		if(req.acl('ratelimit.bypass')) {
			next();
			return;
		}

		const userAclKey = `acl_${req.authState ? req.userId : req.ip}`;
		const update = req.redis.multi();
		
		let rateData = await req.redis.hgetall(userAclKey);
		let allowed = false, modified = false;
		
		if(!rateData.lastUpdate) {
			rateData = {
				lastUpdate: 0,
				score: 0
			};
		}
		
		if(rateData.lastUpdate + config.store.ratelimit.resetAfter < Date.now()) {
			update.hset(userAclKey, 'lastUpdate', Date.now());
			update.hset(userAclKey, 'score', config.store.ratelimit.score);
			
			rateData.score = config.store.ratelimit.score;
			modified = true;
		}

		if(rateData.score > appliedScore) {
			update.hincrby(userAclKey, 'score', -appliedScore);
			allowed = true;
			modified = true;
		}
		
		if(modified) {
			update.expire(userAclKey, config.store.ratelimit.resetAfter / 1000);
			await update.exec();
		}

		if(allowed) {
			next();
		} else {
			res.set({
				'Retry-After': rateData.lastUpdate + config.store.ratelimit.resetAfter - Date.now()
			});
			
			throw new StatusCodeError(429, "Too many requests requested.");
		}
	};
};
