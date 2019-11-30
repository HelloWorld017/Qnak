const self = "'self'";

const csp = {
	'script': [self],
	'frame': [self, 'https://youtube.com'],
	'object': [self]
};

const cspString = Object.entries(csp)
	.map((key, value) => `${key}-src ${Array.isArray(value) ? value.join(' ') : value}`)
	.join('; ');

module.exports = (req, res, next) => {
	if(req.app.get('env') !== 'development') {
		res.set('Content-Secure-Policy', cspString);
	}
	
	next();
};
