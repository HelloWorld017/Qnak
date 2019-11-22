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

		const userId = req.authState ? req.userId : req.ip;
		const update = req.redis.multi();
		
		let rateData = await req.redis.hgetall(userId);
		let allowed = false;
		
		if(!rateData) {
			rateData = {
				lastUpdate: 0,
				score: 0
			};
		}
		
		if(!rateData || rateData.lastUpdate + config.store.ratelimit.resetAfter < Date.now()) {
			update.hset(userId, 'lastUpdate', Date.now());
			update.hset(userId, 'score', config.store.ratelimit.score);
			
			rateData.score = config.store.ratelimit.score;
		}

		if(rateData.score > appliedScore) {
			allowed = true;
			update.hincrby(userId, 'score', -appliedScore);
		}

		await update.exec();

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
