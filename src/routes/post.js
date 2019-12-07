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
	
	let {title, content, subject, tags, anonymous} = req.body;
	if(
		typeof title !== 'string' || typeof content !== 'string' ||
		typeof subject !== 'string' || typeof anonymous !== 'boolean' ||
		typeof tags !== 'string'
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
	
	if(!req.authState)
		throw new StatusCodeError(403, "not-authorized");
	
	if((anonymous && !req.acl('post.write.ask.anonymous')) || (!anonymous && !req.acl('post.write.ask.public')))
		throw new StatusCodeError(403, "not-allowed-to-do-this-job");
	
	const tagsParsed = tags.split(',');
	
	const postFeatureIndex = Math.floor(content.length / 2);
	const postIdHex =
		crypto.createHash('md5')
			.update(req.userId + content.slice(postFeatureIndex, postFeatureIndex + 30))
			.digest('hex').slice(0, 7) +
		Math.floor(Math.random() * 100).toString(16) +
		Date.now().toString(16);
	
	const postId = BigInt(`0x${postIdHex}`).toString();
	
	const postObject = {
		postId,
		title,
		author: req.friendlyUid,
		excerpt: sanitizer.sanitizeAsText(content),
		date: Date.now(),
		college: board.college,
		subject,
		relation: 'question',
		tags: tagsParsed,
		anonymous,
		attachments: await handleAttachments(req, postId, (req.files && req.files.postUpload) || [])
	};
	
	await req.mongo.collection('posts').insertOne({
		postId,
		content,
		author: req.friendlyUid,
		upvote: 0,
		downvote: 0,
		answers: [],
		comments: []
	});
	
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
		
		return postData.hits.hits[0]._source;
	};
	
	req.getPostMetadata = async () => {
		const postMetadata = await req.mongo.collection('posts').findOne({
			postId
		});
		
		if(!postMetadata)
			throw new StatusCodeError(404, "no-such-post");
		
		return postMetadata;
	};
	
	next();
});

router.patch('/:postId', aclRate('post.update'), async (req, res) => {
	if(req.activeAcl.includes('post.update.my')) {
		
	}
});

router.get('/:postId', aclRate('post.read'), async (req, res) => {
	const postContent = await req.getPostContent();
	const postMetadata = await req.getPostMetadata();

	const post = Object.assign({}, postContent, postMetadata);
	post.board = Filter.filterBoard(
		await req.mongo.collection('boards').findOne({
			boardId: post.subject
		})
	);
	
	res.json({
		ok: true,
		post: Filter.filterPost(post)
	});
});

router.get('/:postId/vote', aclRate('post.read'), async (req, res) => {
	const { postId } = req.params;
	
	if(typeof postId !== 'string')
		throw new StatusCodeError(422, "wrong-given-for-postId");
	
	const voteQuery = await req.mongo.collection('posts').findOne({ postId }, {
		projection: { upvote: 1, downvote: 1, _id: 0 }
	});
	
	if(!voteQuery)
		throw new StatusCodeError(404, "no-such-post");
	
	const result = {
		ok: true,
		upvote: voteQuery.upvote,
		downvote: voteQuery.downvote
	};
	
	if(!req.authState) {
		/* const voted = await req.mongo.collection('users').findOne({
			userId: req.userId,
			$or: [
				{$in: {upvotedPosts: req.params.postId}},
				{$in: {downvotedPosts: req.params.postId}}
			]
		});
		
		result.voted = !!voted;
		*/
		
		result.voted = req.user.upvotedPosts.includes(req.params.postId) ||
			req.user.downvotedPosts.includes(req.params.postId);
	}
	
	res.json(result);
});

router.post('/:postId/vote', aclRate('post.vote'), async (req, res) => {
	if(!req.authState)
		throw new StatusCodeError(403, "not-authorized");
	
	if(typeof postId !== 'string')
		throw new StatusCodeError(422, "wrong-given-for-postId");
	
	const incObject = {
		upvote: 0,
		downvote: 0
	};
	
	const userUpdateObject = {};
	
	if(req.user.upvotedPosts.includes(req.params.postId)) {
		incObject.upvote--;
		userUpdateObject.$pull = {
			upvotedPosts: req.params.postId
		};
	} else if(req.user.downvotedPosts.includes(req.params.postId)) {
		incObject.downvote--;
		userUpdateObject.$pull = {
			downvotedPosts: req.params.postId
		};
	}
	
	let voted = true;
	if(req.query.voteType === 'upvote') {
		incObject.upvote++;
		userUpdateObject.$push = {
			upvotedPosts: req.params.postId
		};
	} else if(req.query.voteType === 'downvote') {
		incObject.downvote++;
		userUpdateObject.$push = {
			downvotedPosts: req.params.postId
		};
	} else {
		voted = false;
	}
	
	const { value: postExists } = await req.mongo.collection('posts').findOneAndUpdate({
		postId: req.params.postId
	}, {
		$inc: incObject
	}, { projection: {_id: 0, upvote: 1, downvote: 1} });
	
	if(!postExists)
		throw new StatusCodeError(404, "no-such-post");
	
	await req.mongo.collection('users').findOneAndUpdate({
		userId: req.userId
	}, userUpdateObject, { projection: {_id: 1} });
	
	res.json({
		ok: true,
		upvote: postExists.upvote,
		downvote: postExists.downvote,
		voted
	});
});

router.get('/:postId/comment', aclRate('comment.read'), async (req, res) => {

});

router.get('/:postId/answer', aclRate('post.read'), async (req, res) => {

});

router.post('/:postId/answer', aclRate('post.write'), async (req, res) => {
	
});

module.exports = router;
