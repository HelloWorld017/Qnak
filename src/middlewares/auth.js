const createHasAcl = require('../utils/createHasAcl');
const eccrypto = require('eccrypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = () => {
	createHasAcl.init();
	
	return async (req, res, next) => {
		const authToken = req.get('Qnak-Authorization');

		let token = {};

		try {
			token = await promisify(jwt.verify)(authToken, req.config.$secret);
			
			const publicKey = Buffer.from(token.publicKey, 'base64');
			const message = Buffer.from(token.authVerification, 'base64');
			const signature = Buffer.from(req.cookies.tokenVerification, 'base64');
			await eccrypto.verify(publicKey, message, signature);
			
			const user = await req.mongo.collection('users').findOne({
				friendlyUid: token.friendlyUid
			});

			if(token.lastUpdate !== user.lastUpdate) {
				throw new Error("Token Invalidated");
			}

			req.authState = true;
			req.userId = user.userId;
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
