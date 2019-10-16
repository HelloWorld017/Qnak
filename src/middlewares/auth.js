const calculateAcl = require('../utils/acl');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	const authToken = req.get('Qnak-Authorization');
	const db = database.db;

	let token = {};
	
	try {
		token = await promisify(jwt.verify)(authToken, config.store.$secret);

		const user = await db.collection('users').findOne({
			loginName: token.loginName
		});

		if(token.lastUpdate !== user.lastUpdate) {
			throw new Error("Token Invalidated");
		}
		
		req.authState = true;
		req.username = token.username;
		req.loginName = token.loginName;
		req.user = user;
		req.acl = calculateAcl(user.acl);
	} catch(err) {
		req.authState = false;
		req.acl = calculateAcl('guest');
		next();
		return;
	}

	next();
};
