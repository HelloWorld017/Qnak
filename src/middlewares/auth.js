const createHasAcl = require('../utils/createHasAcl');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = () => {
	createHasAcl.init();
	
	return async (req, res, next) => {
		const authToken = req.get('Qnak-Authorization');

		let token = {};

		try {
			token = await promisify(jwt.verify)(authToken, req.config.$secret);

			const user = await req.mongo.collection('users').findOne({
				userId: token.userId
			});

			if(token.lastUpdate !== user.lastUpdate) {
				throw new Error("Token Invalidated");
			}

			req.authState = true;
			req.userId = token.userId;
			req.username = token.username;
			req.friendlyUid = token.friendlyUid;
			req.user = user;
			req.acl = createHasAcl(user.acl, req);
		} catch(err) {
			req.authState = false;
			req.acl = createHasAcl('guest', req);
		}

		next();
	};
};
