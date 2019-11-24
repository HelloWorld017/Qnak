const config = require('../config');
const multer = require('multer');

const upload = multer(config.store.post.uploads);
const uploadMap = {};

module.exports = (name, ...descriptor) => {
	uploadMap[name] = upload.fields(descriptor);
	
	return async (req, res, next) => {
		uploadMap[name](req, res, next);
	};
};
