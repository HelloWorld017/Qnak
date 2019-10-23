const {Router} = require('express');
const router = new Router();

router.get('/:archive?', (req, res) => {
	const query = {
		bool: {};
	};
	
	const archive = req.params.archive;
	if(typeof archive === 'string') {
		
	}
	
	const tags = req.query.tags;
	if(typeof tags === 'string') {
		if(!query.bool.filter)
			query.bool.filter = {};
		
		query.bool.filter.term
	}
	
	const dateStart = req.query.from;
	const dateEnd = req.query.to;
	if(typeof dateStart === 'number' || typeof dateEnd === 'number') {
		if(!query.bool.filter)
			query.bool.filter = {};
		
		if(!query.bool.filter.range)
			query.bool.filter.range = {
				date: {}
			};
		
		if(typeof dateStart === 'number')
			query.bool.filter.range.date.gte = dateStart;
		
		if(typeof dateEnd === 'number')
			query.bool.filter.range.date.lte = dateEnd;
	}
	
	await client.search({
		index: 'qnak-posts',
		body: {
			query: {
				
			}
		}
	})
});

router.get('/post/:postId', (req, res) => {
	
});

module.exports = router;
