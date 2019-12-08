const RegexPalette = require('../utils/RegexPalette');

const createAsyncRouter = require('../utils/createAsyncRouter');
const router = createAsyncRouter();

router.get('/', aclRate('tags.list'), async (req, res) => {
	let aggQuery = {
		tags: {
			terms: {
				field: "tags",
				size: req.confing.post.tagsPagination
			}
		}
	};
	
	let prefix = {};
	if(typeof req.query.prefix === 'string') {
		const sanitizedPrefix = req.query.prefix.replace(RegexPalette.illegalTag, '-').slice(32);
		
		prefix = {
			include: `${req.query.prefix}.*`
		};
	}
	
	const { aggregations } = await req.elastic.search({
		index: 'qnak-posts',
		body: {
			aggs: {
				tags: {
					terms: {
						field: "tags",
						size: req.config.post.tagsPagination,
						...prefix
					}
				}
			}
		}
	});
	
	aggregations.tags
});


export default router;
