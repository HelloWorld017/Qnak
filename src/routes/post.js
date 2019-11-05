const Filter = require('../utils/Filter');
const RegexPalette = require('../utils/RegexPalette');
const StatusCodeError = require('../utils/StatusCodeError');

const aclRate = require('../middlewares/aclRate');
const createAsyncRouter = require('../utils/createAsyncRouter');
const router = createAsyncRouter();

router.post('/', aclRate('post.write'), async (req, res) => {

});

router.param('postId', async (req, res, next, postId) => {
	if(!RegexPalette.postId.test(postId)) {
		throw new StatusCodeError(422, "Wrong Post ID");
	}

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
		throw new StatusCodeError(404, "No such post");
	}

	req.qnakPost = postData.hits.hits[0];
});

router.get('/:postId', aclRate('post.read'), async (req, res) => {


	const postMetadata = await req.mongo.findOne()
});

router.patch('/:postId', aclRate('post.update.my'), async (req, res) => {
	if(req.activeAcl.includes('post.update.my')) {

	}
});

router.get('/:postId/comment', aclRate('comment.read'), async (req, res) => {

});

router.get('/:postId/answer', aclRate('post.read'), async (req, res) => {

});

router.post('/:postId/answer', aclRate('post.write'))
