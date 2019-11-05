const createHasAcl = require('../utils/createHasAcl');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
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
		req.user = user;
		req.acl = createHasAcl(user.acl);
	} catch(err) {
		req.authState = false;
		req.acl = createHasAcl('guest');
	}
	
	next();
};
