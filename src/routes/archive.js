const Filter = require('../utils/Filter');
const StatusCodeError = require('../utils/StatusCodeError');

const aclRate = require('../middlewares/aclRate');
const createAsyncRouter = require('../utils/createAsyncRouter');
const router = createAsyncRouter();

router.get('/:archive?', aclRate('post.read.search'), async (req, res) => {
	const query = {
		filter: []
	};

	const archive = req.params.archive;
	if(typeof archive === 'string' && archive.length > 0) {
		const archiveSplit = archive.split(':');
		switch(archiveSplit[0]) {
			case 'user':
				query.filter.push({term: {author: `${archiveSplit[1]}#${archiveSplit[2]}`}});
				break;

			case 'college':
				query.filter.push({term: {college: archiveSplit[1]}});
				break;

			case 'subject':
				query.filter.push({term: {subject: archiveSplit[1]}});
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
		query.bool.filter.push({terms: {tags: tagsParsed}});
	}

	const dateStart = parseInt(req.query.from);
	const dateEnd = parseInt(req.query.to);
	if(
		(isFinite(dateStart) && dateStart > 0) ||
		(isFinite(dateEnd) && dateEnd > 0)
	) {
		const rangeFilter = {};

		if(typeof dateStart === 'number')
			rangeFilter.date.gte = dateStart;

		if(typeof dateEnd === 'number')
			rangeFilter.date.lte = dateEnd;
			
		query.bool.filter.push({range: rangeFilter});
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
