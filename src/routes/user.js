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
const ssoClient = new SSOClient(config.store.security.ssoId, config.store.security.ssoSecret);

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
			publicKey: publicKey.toString('base64'),
			authVerification: random.toString('base64'),
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
	
	res.cookie('tokenVerification', signature.toString('base64'), {
		httpOnly: true,
		secure: req.app.get('env') !== 'development',
		maxAge: req.config.security.tokenExpiresIn * 1000
	});
	
	res.json({
		ok: true,
		token
	});
});

router.get('/me', async (req, res) => {
	if(req.authState) {
		const user = Object.assign({}, req.user);
		user.boards = (await req.mongo.collection('boards').find({
			boardId: {
				$in: user.boards
			}
		}).toArray()).map(board => Filter.filterBoard(board));
		
		return res.json({
			ok: true,
			authed: true,
			authedAs: Filter.filterUser(user, true),
			acl: req.acl.value
		});
	}
	
	res.json({
		ok: true,
		acl: req.acl.value,
		authed: false
	});
});

router.get('/:userId(~[a-zA-Z가-힣]+:[0-9]+)', async (req, res) => {
	const userId = req.params.userId;
	const match = userId.slice(1).match(RegexPalette.friendlyUidAlternative);
	if(!match)
		throw new StatusCodeError(422, "illegal-friendly-uid");
	
	const [base, hash] = match.slice(1);
	const friendlyUid = `${base}#${hash}`;
	
	const user = await req.mongo.collection('users').findOne({
		friendlyUid
	});
	
	if(!user)
		throw new StatusCodeError(404, "no-such-user");
	
	res.json({
		ok: true,
		user: Filter.filterUser(user, false)
	});
});

router.patch('/:userId(~[a-zA-Z가-힣]+:[0-9]+)', (req, res) => {
	
});

module.exports = router;
