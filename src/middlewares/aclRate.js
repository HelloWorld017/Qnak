const StatusCodeError = require('../utils/StatusCodeError');

const config = require('../config');
const getParentAcl = require('../utils/getParentAcl');

module.exports = aclName => {
	const parentAcls = getParentAcl(aclName);
	const appliedRateLimit = parentAcls.find(key => config.ratelimit.entries[key] !== undefined);
	const appliedScore = config.ratelimit.entries[appliedRateLimit];

	return async (req, res, next) => {
		if(!req.acl(aclName)) {
			throw new StatusCodeError(403, "Not allowed for the user to do this job.");
		}

		if(req.acl('ratelimit.bypass')) {
			next();
			return;
		}

		const userId = req.authState ? req.userId : req.ip;
		const rateData = await req.redis.hgetall(userId);
		const update = client.multi();
		let allowed = false;

		if(rateData.lastUpdate + config.ratelimit.resetAfter < Date.now()) {
			update.hset(userId, 'lastUpdate', Date.now());
			update.hset(userId, 'score', config.ratelimit.score);
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
				'Retry-After': rateData.lastUpdate + config.ratelimit.resetAfter - Date.now()
			});

			throw new StatusCodeError(429, "Too many requests requested.");
		}
	};
};
