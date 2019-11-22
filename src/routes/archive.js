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
		if(!query.filter.terms) query.filter.terms = {};

		const archiveSplit = archive.split(':');
		switch(archiveSplit[0]) {
			case 'user':
				query.filter.terms.author = archiveSplit[1];
				break;

			case 'college':
				query.filter.terms.college = archiveSplit[1];
				break;

			case 'subject':
				query.filter.terms.subject = archiveSplit[1];
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
			query.should.push({match: {'content.analyzed': searchQuery}});
		}

		if(searchFromParsed.includes('title')) {
			query.should.push({match: {'title.analyzed': searchQuery}});
		}

		if(searchFromParsed.includes('comment')) {
			query.should.push({
				has_child: {
					type: "comment",
					query: {'content.analyzed': searchQuery}
				}
			});
		}

		if(searchFromParsed.includes('answer')) {
			query.should.push({
				has_child: {
					type: "answer",
					query: {'content.analyzed': searchQuery}
				}
			});
		}
	}

	const tags = req.query.tags;
	if(typeof tags === 'string' && tags.length > 0) {
		const tagsParsed = tags.split(',');
		if(!query.filter) query.filter = {};
		if(!query.filter.terms) query.filter.terms = {};

		query.bool.filter.terms.tags = tagsParsed;
	}

	const dateStart = req.query.from;
	const dateEnd = req.query.to;
	if(typeof dateStart === 'number' || typeof dateEnd === 'number') {
		if(!query.filter) query.filter = {};
		if(!query.filter.range) query.filter.range = {date: {}};

		if(typeof dateStart === 'number')
			query.filter.range.date.gte = dateStart;

		if(typeof dateEnd === 'number')
			query.filter.range.date.lte = dateEnd;
	}

	const {body: result} = await req.elastic.search({
		index: 'qnak-posts',
		body: {
			query: {
				bool: query
			}
		}
	});

	res.json(
		Filter.filterPosts(result)
	);
});

module.exports = router;
