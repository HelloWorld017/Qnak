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
	const excerpt = sanitizer.sanitizeAsText(content);
	if(title.length === 0 || excerpt.length === 0)
		throw new StatusCodeError(422, "some-content-is-empty");

	board = await req.mongo.collection('boards')
		.findOne({boardId: subject});

	if(!board)
		throw new StatusCodeError(422, "no-such-board");

	if(!req.authState)
		throw new StatusCodeError(403, "not-authorized");

	if((anonymous && !req.acl('post.write.ask.anonymous')) || (!anonymous && !req.acl('post.write.ask.public')))
		throw new StatusCodeError(403, "not-allowed-to-do-this-job");

	let tagsParsed = tags.split(',');
	tagsParsed = tagsParsed.filter((v, i) => !~tagsParsed.indexOf(v, i + 1));
	tagsParsed = tagsParsed.filter(v => RegexPalette.tag.test(v)).slice(0, 16);

	const date = Date.now();

	const postFeatureIndex = Math.floor(content.length / 2);
	const postIdHex =
		crypto.createHash('md5')
			.update(req.userId + content.slice(postFeatureIndex, postFeatureIndex + 30))
			.digest('hex').slice(0, 7) +
		Math.floor(Math.random() * 100).toString(16) +
		Date.now().toString(16);

	const postId = BigInt(`0x${postIdHex}`).toString();
	const attachments = await handleAttachments(req, postId, (req.files && req.files.postUpload) || []);

	await req.mongo.collection('posts').insertOne({
		postId,
		title,
		author: req.friendlyUid,
		authorName: req.username,
		content,
		excerpt: excerpt.slice(0, 256),
		date,
		college: board.college,
		subject,
		tags: tagsParsed,
		anonymous,
		attachments,
		upvote: 0,
		downvote: 0,
		answers: [],
		comments: []
	});

	await req.elastic.index({
		index: 'qnak-posts',
		routing: postId,
		body: {
			postId,
			title,
			author: req.friendlyUid,
			excerpt,
			date,
			college: board.college,
			subject,
			relation: 'question',
			tags: tagsParsed,
			anonymous,
			attachments
		}
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

	req.getPostMetadata = async (option) => {
		const postMetadata = await req.mongo.collection('posts').findOne({
			postId
		}, option);

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
	const postMetadata = await req.getPostMetadata();

	const post = Object.assign({}, postMetadata);
	if(post.subject) {
		post.board = Filter.filterBoard(
			await req.mongo.collection('boards').findOne({
				boardId: post.subject
			})
		);
	}

	res.json({
		ok: true,
		post: Filter.filterPost(post)
	});
});

router.get('/:postId/vote', aclRate('post.read'), async (req, res) => {
	const { postId } = req.params;

	if(typeof postId !== 'string')
		throw new StatusCodeError(422, "wrong-given-for-postId");

	const voteQuery = await req.getPostMetadata({
		projection: { upvote: 1, downvote: 1, _id: 0 }
	});

	if(!voteQuery)
		throw new StatusCodeError(404, "no-such-post");

	const result = {
		ok: true,
		upvote: voteQuery.upvote,
		downvote: voteQuery.downvote
	};

	if(req.authState) {
		if(req.user.upvotedPosts.includes(req.params.postId))
			result.voted = 'upvote';

		else if(req.user.downvotedPosts.includes(req.params.postId))
			result.voted = 'downvote';

		else
			result.voted = false;
	}

	res.json(result);
});

router.post('/:postId/vote', aclRate('post.vote'), async (req, res) => {
	if(!req.authState)
		throw new StatusCodeError(403, "not-authorized");

	const postId = req.params.postId;
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

	let voted = false;
	if(req.query.voteType === 'upvote') {
		if(incObject.upvote === 0) {
			incObject.upvote++;
			userUpdateObject.$push = {
				upvotedPosts: req.params.postId
			};
			voted = 'upvote';
		}
	} else if(req.query.voteType === 'downvote') {
		if(incObject.downvote === 0) {
			incObject.downvote++;
			userUpdateObject.$push = {
				downvotedPosts: req.params.postId
			};
			voted = 'downvote';
		}
	}

	let post = null;
	if(incObject.downvote !== 0 || incObject.upvote !== 0) {
		const { value: postExists } = await req.mongo.collection('posts').findOneAndUpdate({
			postId: req.params.postId
		}, {
			$inc: incObject
		}, { projection: {_id: 0, upvote: 1, downvote: 1}, returnOriginal: false });

		if(!postExists)
			throw new StatusCodeError(404, "no-such-post");

		post = postExists;

		await req.mongo.collection('users').findOneAndUpdate({
			userId: req.userId
		}, userUpdateObject, { projection: {_id: 1} });
	} else {
		post = await req.mongo.collection('posts').findOne({
			postId: req.params.postId
		});

		if(!post)
			throw new StatusCodeError(404, "no-such-post");
	}

	res.json({
		ok: true,
		upvote: post.upvote,
		downvote: post.downvote,
		voted
	});
});

router.post('/:postId/answer', aclRate('post.write.answer'), upload('postUpload', {name: 'attachments'}), async (req, res) => {
	if(!req.body || typeof req.body !== 'object')
		throw new StatusCodeError(422, "post-description-not-given");

	const parentId = req.params.postId;
	const parentPost = await req.getPostMetadata({ projection: { _id: 1, answers: 1 } });
	if(!Array.isArray(parentPost.answers))
		throw new StatusCodeError(404, "no-such-post");

	const {body: parentIdResult} = await req.elastic.search({
		index: 'qnak-posts',
		body: {
			query: {
				bool: {
					filter: {
						match: {postId: parentId}
					}
				}
			}
		}
	});

	if(parentIdResult.hits.hits.length < 1)
		throw new StatusCodeError(404, "no-such-post");

	const parentElasticId = parentIdResult.hits.hits[0]._id;

	let {content, anonymous} = req.body;
	if(typeof content !== 'string' || typeof anonymous !== 'boolean')
		throw new StatusCodeError(422, "wrong-given-for-post-description");

	content = sanitizer.sanitizeContent(content);
	const excerpt = sanitizer.sanitizeAsText(content);

	if(excerpt.length === 0)
		throw new StatusCodeError(422, "some-content-is-empty");

	if(!req.authState)
		throw new StatusCodeError(403, "not-authorized");

	if((anonymous && !req.acl('post.write.answer.anonymous')) || (!anonymous && !req.acl('post.write.answer.public')))
		throw new StatusCodeError(403, "not-allowed-to-do-this-job");

	const date = Date.now();

	const postFeatureIndex = Math.floor(excerpt.length / 2);
	const postIdHex =
		crypto.createHash('md5')
			.update(req.userId + excerpt.slice(postFeatureIndex, postFeatureIndex + 30))
			.digest('hex').slice(0, 7) +
		Math.floor(Math.random() * 100).toString(16) +
		Date.now().toString(16);

	const postId = BigInt(`0x${postIdHex}`).toString();
	const attachments = await handleAttachments(req, postId, (req.files && req.files.postUpload) || []);

	await req.mongo.collection('posts').insertOne({
		postId,
		author: req.friendlyUid,
		authorName: req.username,
		content,
		excerpt: excerpt.slice(0, 256),
		date,
		anonymous,
		attachments,
		upvote: 0,
		downvote: 0,
		parent: parentId,
		comments: []
	});

	await req.elastic.index({
		index: 'qnak-posts',
		routing: parentId,
		body: {
			postId,
			author: req.friendlyUid,
			excerpt,
			date,
			relation: {
				name: 'answer',
				parent: parentElasticId
			},
			anonymous,
			attachments
		}
	});

	await req.mongo.collection('posts').findOneAndUpdate({
		postId: parentId
	}, {
		$push: {
			answers: postId
		}
	}, {
		projection: { _id: 1 }
	});

	res.json({
		ok: true,
		id: postId
	});
});

router.get('/:postId/comment', aclRate('comment.read'), async (req, res) => {
	const postInfo = await req.getPostMetadata({
		projection: {
			comments: 1
		}
	});
	
	const postComments = await req.mongo.collection('comments').find({
		commentId:{
			$in: postInfo.comments
		}
	}).toArray();
	
	res.json({
		ok: true,
		comments: postComments
	});
});

router.post('/:postId/comment', aclRate('comment.write'), async (req, res) => {
	const parentId = req.params.postId;
	await req.getPostMetadata({ projection: { _id: 1 } });
	
	const {body: parentIdResult} = await req.elastic.search({
		index: 'qnak-posts',
		body: {
			query: {
				bool: {
					filter: {
						match: {postId: parentId}
					}
				}
			}
		}
	});

	if(parentIdResult.hits.hits.length < 1)
		throw new StatusCodeError(404, "no-such-post");

	const parentElasticId = parentIdResult.hits.hits[0]._id;
	
	if(!req.authState)
		throw new StatusCodeError(403, "not-authorized");
	
	const {content} = req.body;
	
	if(typeof content !== 'string' || content.length === 0)
		throw new StatusCodeError(422, "wrong-given-for-content");
	
	const date = Date.now();
	const postFeatureIndex = Math.floor(content.length / 2);
	const commentIdHex =
		crypto.createHash('md5')
			.update(req.userId + content.slice(postFeatureIndex, postFeatureIndex + 30))
			.digest('hex').slice(0, 7) +
		Math.floor(Math.random() * 100).toString(16) +
		Date.now().toString(16);

	const commentId = BigInt(`0x${commentIdHex}`).toString();
	
	await req.mongo.collection('comments').insertOne({
		commentId,
		author: req.friendlyUid,
		authorName: req.username,
		content,
		date,
		parent: parentId
	});

	await req.elastic.index({
		index: 'qnak-posts',
		routing: parentId,
		body: {
			commentId,
			author: req.friendlyUid,
			excerpt: content,
			date,
			relation: {
				name: 'comment',
				parent: parentElasticId
			}
		}
	});

	await req.mongo.collection('posts').findOneAndUpdate({
		postId: parentId
	}, {
		$push: {
			comments: commentId
		}
	}, {
		projection: { _id: 1 }
	});
	
	res.json({
		ok: true,
		comment: {
			commentId,
			author: req.friendlyUid,
			authorName: req.username,
			content,
			date
		}
	});
});

module.exports = router;
