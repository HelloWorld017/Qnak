const createAsyncRouter = require('../utils/createAsyncRouter');
const Filter = require('../utils/Filter');
const StatusCodeError = require('../utils/StatusCodeError');

const router = createAsyncRouter();

router.param('board', (req, res, next, boardId) => {
	req.getBoard = async () => {
		return await req.mongo.collection('boards').findOne({ boardId });
	};
	
	next();
});

router.get('/:board', async (req, res) => {
	const board = await req.getBoard();
	if(!board)
		throw new StatusCodeError(422, "no-such-board");
	
	res.json({
		ok: true,
		board: Filter.filterBoard(board)
	});
});

router.post('/:board/request', (req, res) => {
	
});

module.exports = router;
