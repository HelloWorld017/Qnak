const Filter = require('../utils/Filter');
const RegexPalette = require('../utils/RegexPalette');
const Sanitizer = require('../utils/Sanitizer');
const StatusCodeError = require('../utils/StatusCodeError');

const aclRate = require('../middlewares/aclRate');
const createAsyncRouter = require('../utils/createAsyncRouter');
const crypto = require('crypto');
const handleAttachments = require('../utils/handleAttachments');
const path = require('path');
const upload = require('../middlewares/upload');

const router = createAsyncRouter();
const sanitizer = new Sanitizer();

router.post('/', aclRate('post.write.ask'), upload('postUpload', {name: 'attachments'}), async (req, res) => {
	if(!req.body || typeof req.body !== 'object') {
		throw new StatusCodeError(422, "post-description-not-given");
	}
	
	let {title, content, subject, anonymous} = req.body;
	if(
		typeof title !== 'string' || typeof content !== 'string' ||
		typeof subject !== 'string' || typeof anonymous !== 'boolean'
	) {
		throw new StatusCodeError(422, "wrong-given-for-post-description");
	}
	
	content = sanitizer.sanitizeContent(content);
	if(title.length === 0 || content.length === 0)
		throw new StatusCodeError(422, "some-content-is-empty");
	
	board = await req.mongo.collection('boards')
		.findOne({boardId: subject});
	
	if(!board)
		throw new StatusCodeError(422, "no-such-board");
	
	if(!userId)
		throw new StatusCodeError(403, "not-authorized");
	
	if((anonymous && !req.acl('post.write.ask.anonymous')) || (!anonymous && !req.acl('post.write.ask.public')))
		throw new StatusCodeError(403, "not-allowed-to-do-this-job");
	
	const postFeatureIndex = Math.floor(content.length / 2);
	const postIdHex =
		crypto.createHash('md5')
			.update(userId + content.slice(postFeatureIndex, postFeatureIndex + 30))
			.digest('hex').slice(0, 7) +
		Math.floor(Math.random() * 100).toString(16) +
		Date.now().toString(16);
	
	const postId = BigInt(`0x${postIdHex}`).toString();
	
	const postObject = {
		postId,
		title,
		author: req.userId,
		content,
		date: Date.now(),
		college: board.college,
		subject,
		relation: 'post',
		anonymous,
		attachments: await handleAttachments(req, postId, (req.files && req.files.postUpload) || [])
	};
	
	await req.elastic.index({
		index: 'qnak-posts',
		routing: postId,
		body: postObject
	});
	
	res.json({
		ok: true,
		id: postId
	});
});

router.param('postId', async (req, res, next, postId) => {
	if(!RegexPalette.postId.test(postId)) {
		throw new StatusCodeError(422, "wrong-post-id");
	}
	
	req.getPostContent = async () => {
		const {body: postData} = await req.elastic.search({
			index: 'qnak-posts',
			body: {
				query: {
					bool: {
						filter: {
							match: {postId}
						}
					}
				}
			}
		});
		
		if(postData.hits.hits.length === 0) {
			throw new StatusCodeError(404, "no-such-post");
		}
		
		return postData.hits.hits[0];
	};
	
	req.getPostMetadata = async () => {
		const postMetadata = await req.mongo.collection('posts').findOne({
			postId
		});
		
		return postMetadata;
	};
	
	next();
});

router.get('/:postId', aclRate('post.read'), async (req, res) => {
	const postMetadata = await req.getPostMetadata();
	const postContent = await req.getPostContent();
	
	res.json({
		ok: true,
		post: Object.assign({}, postMetadata, postContent)
	});
});

router.patch('/:postId', aclRate('post.update'), async (req, res) => {
	if(req.activeAcl.includes('post.update.my')) {
		
	}
});

router.get('/:postId/comment', aclRate('comment.read'), async (req, res) => {

});

router.get('/:postId/answer', aclRate('post.read'), async (req, res) => {

});

router.post('/:postId/answer', aclRate('post.write'), async (req, res) => {
	
});

router.get('/:postId/answer/:answerId/comment', aclRate('comment.read'), async (req, res) => {
	
});

module.exports = router;
