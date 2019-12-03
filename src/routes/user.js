const aclRate = require('../middlewares/aclRate');
const config = require('../config');
const createAsyncRouter = require('../utils/createAsyncRouter');
const crypto = require('crypto');
const eccrypto = require('eccrypto');
const jwt = require('jsonwebtoken');
const session = require('../middlewares/session');

const Filter = require('../utils/Filter');
const RegexPalette = require('../utils/RegexPalette');
const SSOClient = require('../utils/SSOClient');
const StatusCodeError = require('../utils/StatusCodeError');

const router = createAsyncRouter();
const ssoClient = new SSOClient('test4bc872bb1371bc6d', '0a9a32efaaeb2deb4855')

router.post('/auth', aclRate('user.auth'), session, async (req, res) => {
	if(req.authState) {
		res.status(200).json({
			ok: true,
			alreadyAuthed: true
		});
	}
	
	const {state, url} = ssoClient.getLoginParams();
	
	await req.session.reallocate();
	
	req.session.ssoState = state;
	await req.session.flush();
	
	res.json({
		ok: true,
		url
	});
});

router.post('/auth/finalize', aclRate('user.auth'), session, async (req, res) => {
	if(req.authState) {
		res.status(200).json({
			ok: true,
			alreadyAuthed: true
		});
	}
	
	if(!req.session.ssoState) {
		throw new StatusCodeError(400, "authentication-not-started");
	}
	
	const newState = req.body.state;
	if(typeof newState !== 'string' || newState !== req.session.ssoState) {
		throw new StatusCodeError(400, "session-might-hijacked");
	}
	
	const code = req.body.code;
	if(typeof code !== 'string') {
		throw new StatusCodeError(422, "code-not-given");
	}
	
	let userData;
	
	try {
		userData = await ssoClient.getUserInfo(code);
	} catch(err) {
		throw new StatusCodeError(400, "cannot-get-user-info");
	}
	
	let qnakUser = await req.mongo.collection('users').findOne({
		userId: userData.uid
	});
	
	if(!qnakUser) {
		let friendlyUidBase = `${userData.first_name}${userData.last_name}`
			.replace(RegexPalette.illegalFriendlyUidBase, '');
		
		if(!friendlyUidBase) friendlyUidBase = 'user';
		
		const friendlyUidHash = crypto.createHash('sha256').update(friendlyUidBase).digest('hex');
		let friendlyUidModifier = parseInt(friendlyUidHash.slice(0, 3), 16);
		let doubleHashing = parseInt(friendlyUidHash.slice(3, 5), 16);
		
		// Find nearest available friendlyUid
		while(true) {
			const exists = await req.mongo.collection('user').findOne({
				friendlyUid: `${friendlyUidBase}#${friendlyUidModifier}`
			});
			
			if(!exists) break;
			
			friendlyUidModifier += doubleHashing;
		}
		
		qnakUser = {
			userId: userData.uid,
			friendlyUid: `${friendlyUidBase}#${friendlyUidModifier}`,
			username: `${userData.first_name} ${userData.last_name}`,
			profile: null,
			acl: {
				base: 'user',
				privileged: [],
				restricted: []
			},
			
			point: req.config.points.initialPoint,
			minusPoint: 0,
			totalMinusPoint: 0,
			plusPoint: 0,
			totalPlusPoint: 0,
			
			upvotedPosts: [],
			downvotedPosts: [],
			
			boards: [],
			favoriteBoards: [],
			requestedBoards: [],
			lastUpdate: Date.now()
		};
		
		await req.mongo.collection('users').insertOne(qnakUser);
	}
	
	const random = await new Promise((resolve, reject) => {
		crypto.randomBytes(32, (err, randomBytes) => {
			if(err) return reject(err);
			resolve(randomBytes);
		});
	});
	
	const privateKey = eccrypto.generatePrivate();
	const publicKey = eccrypto.getPublic(privateKey);
	
	const signature = await eccrypto.sign(privateKey, random);
	
	const token = await new Promise((resolve, reject) => {
		jwt.sign({
			publicKey: publicKey.toString('hex'),
			userId: qnakUser.userId,
			username: qnakUser.username,
			friendlyUid: qnakUser.friendlyUid,
			lastUpdate: qnakUser.lastUpdate
		}, req.config.$secret, {
			expiresIn: req.config.security.tokenExpiresIn
		}, (err, token) => {
			if(err) return reject(err);
			resolve(token);
		});
	});
	
	res.cookie('tokenVerification', signature.toString('hex'), {
		httpOnly: true,
		secure: req.app.get('env') !== 'development',
		maxAge: req.config.security.sessionExpiresIn
	});
	
	res.json({
		ok: true,
		token
	});
});

router.get('/me', (req, res) => {
	if(req.authState) {
		return res.json({
			ok: true,
			authed: true,
			authedAs: Filter.filterUser(req.user, true),
			acl: req.acl.value
		});
	}
	
	return res.json({
		ok: true,
		authed: false
	});
});

router.get('/:userId(~[a-zA-Z가-힣]+#[0-9]+)', (req, res) => {
	
});

router.patch('/:userId(~[a-zA-Z가-힣]+#[0-9]+)', (req, res) => {
	
});

module.exports = router;
