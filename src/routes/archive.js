const Filter = require('../utils/Filter');
const StatusCodeError = require('../utils/StatusCodeError');

const aclRate = require('../middlewares/aclRate');
const createAsyncRouter = require('../utils/createAsyncRouter');
const router = createAsyncRouter();

router.get('/:archive?', aclRate('post.read.search'), async (req, res) => {
	const query = {};

	const archive = req.params.archive;
	if(typeof archive === 'string' && archive.length > 0) {
		if(!query.filter) query.filter = {};
		if(!query.filter.term) query.filter.term = {};

		const archiveSplit = archive.split(':');
		switch(archiveSplit[0]) {
			case 'user':
				query.filter.term.author = `${archiveSplit[1]}#${archiveSplit[2]}`;
				break;

			case 'college':
				query.filter.term.college = archiveSplit[1];
				break;

			case 'subject':
				query.filter.term.subject = archiveSplit[1];
				break;

			case 'relevant':
				break;

			case 'relevant_post':
				break;
		}
	}

	const searchQuery = req.query.search;
	const searchFrom = req.query.searchFrom;
	if(
		typeof searchQuery === 'string' && typeof searchFrom === 'string' &&
		searchQuery.length > 0 && searchFrom.length > 0
	) {
		if(!query.should)
			query.should = [];

		const searchFromParsed = searchFrom.split(',');
		if(searchFromParsed.includes('content')) {
			query.should.push({match: {'excerpt.analyzed': searchQuery}});
		}

		if(searchFromParsed.includes('title')) {
			query.should.push({match: {'title.analyzed': searchQuery}});
		}

		if(searchFromParsed.includes('comment')) {
			query.should.push({
				has_child: {
					type: "comment",
					query: {match: {'excerpt.analyzed': searchQuery}}
				}
			});
		}

		if(searchFromParsed.includes('answer')) {
			query.should.push({
				has_child: {
					type: "answer",
					query: {match: {'excerpt.analyzed': searchQuery}}
				}
			});
		}

		if(query.should.length > 0) {
			query.minimum_should_match = 1;
		}
	}

	const tags = req.query.tags;
	if(typeof tags === 'string' && tags.length > 0) {
		const tagsParsed = tags.split(',');
		if(!query.filter) query.filter = {};
		if(!query.filter.terms) query.filter.terms = {};

		query.bool.filter.terms.tags = tagsParsed;
	}

	const dateStart = parseInt(req.query.from);
	const dateEnd = parseInt(req.query.to);
	if(
		(isFinite(dateStart) && dateStart > 0) ||
		(isFinite(dateEnd) && dateEnd > 0)
	) {
		if(!query.filter) query.filter = {};
		if(!query.filter.range) query.filter.range = {date: {}};

		if(typeof dateStart === 'number')
			query.filter.range.date.gte = dateStart;

		if(typeof dateEnd === 'number')
			query.filter.range.date.lte = dateEnd;
	}

	const page = parseInt(req.query.page);
	const paginationFrom =
		(isFinite(page) && page >= 0) ?
		Math.min(req.config.post.pagination.maxPage, page) * req.config.post.pagination.pageBy :
		0;

	const {body: result} = await req.elastic.search({
		index: 'qnak-posts',
		body: {
			query: {
				bool: query
			},
			size: req.config.post.pagination.pageBy,
			from: paginationFrom,
			_source: ["postId"]
		}
	});

	const posts = await req.mongo.collection('posts').find({
		postId: {$in: result.hits.hits.map(v => v._source.postId)}
	}, {
		projection: {content: 0}
	}).toArray();

	res.json({
		ok: true,
		posts: Filter.filterPosts(posts)
	});
});

module.exports = router;
