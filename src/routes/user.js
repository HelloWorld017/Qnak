const aclRate = require('../middlewares/aclRate');
const config = require('../config');
const createAsyncRouter = require('../utils/createAsyncRouter');
const session = require('../middlewares/session');

const SSOClient = require('../utils/SSOClient');
const StatusCodeError = require('../utils/StatusCodeError');

const router = createAsyncRouter();
const ssoClient = new SSOClient('test4bc872bb1371bc6d', '0a9a32efaaeb2deb4855')

router.get('/auth', session, (req, res) => {
	if(!req.session.ssoState) {
		throw new StatusCodeError(400, "Authentication haven't started.");
	}
	
	const newState = req.query.state;
	if(newState !== req.session.ssoState) {
		throw new StatusCodeError(400, "Session might be hijacked.");
	}
	
	const code = req.query.code;
	const userData = ssoClient.getUserInfo(code);
	
	let qnakUser = await req.mongo.collection('users').findOne({
		userId: userData.uid
	});
	
	if(!qnakUser) {
		qnakUser = {
			userId: userData.uid,
			username: `${userData.first_name} ${userData.last_name}`,
			point: req.config.points.initialPoint,
			minusPoint: 0,
			totalMinusPoint: 0,
			plusPoint: 0,
			totalPlusPoint: 0,
			upvotedPosts: [],
			downvotedPosts: [],
			requestedBoards: [],
			lastUpdate: Date.now()
		};
		
		await req.mongo.collection('users').insertOne(qnakUser);
	}
	
	const random = await new Promise((resolve, reject) => {
		crypto.randomBytes(32, (err, randomBytes) => {
			if(err) return reject(err);
			resolve(randomBytes.toString('hex'));
		});
	});
	
	const message = `TokenVerification:${random}`;
	const privateKey = eccrypto.generatePrivate();
	const publicKey = eccrypto.getPublic(privateKey);
	
	const signature = await eccrypto.sign(privateKey, message);
	
	const token = await new Promise((reject, resolve) => {
		jwt.sign({
			publicKey: publicKey.toString('hex'),
			userId: qnakUser.userId,
			username: qnakUser.username,
			lastUpdate: qnakUser.lastUpdate
		}, req.config.$secret, {
			expiresIn: req.config.security.tokenExpiresIn
		}, (err, token) => {
			if(err) return reject(err);
			resolve(token);
		});
	});
	
	res.cookie('jwtVerification', signature.toString('hex'), {
		httpOnly: true,
		maxAge: req.config.security.sessionExpiresIn
	});
});

router.post('/auth', aclRate('user.auth'), session, async (req, res) => {
	const {state, url} = ssoClient.getLoginParams();
	
	await req.session.reallocate();
	req.session.ssoState = state;
	
	res.json({
		ok: true,
		url
	});
});

router.param('userId', (req, res, next, userId) => {
	if(!userId.startsWith('~')) return next();
});

router.get('/:userId', (req, res) => {
	
});

router.patch('/:userId', (req, res) => {
	
});

module.exports = router;
