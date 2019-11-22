const config = require('../config');
const multer = require('multer');

let upload;
const uploadMap = {};

module.exports = (name, ...descriptor) => async (req, res, next) => {
	if(!upload) {
		upload = multer(req.config.post.uploads);
	}
	
	if(!uploadMap[name]) {
		uploadMap[name] = upload.fields(descriptor);
	}
	
	uploadMap[name](req, res, next);
};
