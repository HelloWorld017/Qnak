const Filter = {
	filterObject(object, allowedKeys) {
		const result = {};
		allowedKeys.forEach(key => {
			if(object[key] !== undefined) result[key] = object[key];
		});

		return result;
	},

	filterPost(post) {
		const allowedKeys = [
			'postId', 'title', 'excerpt', 'content', 'date', 'college', 'subject', 'anonymous', 'board',
			'upvote', 'downvote', 'answers', 'tags',
			...(post.anonymous ? [] : ['author', 'authorName'])
		];

		return Filter.filterObject(post, allowedKeys);
	},

	filterPosts(posts) {
		return posts.map(post => Filter.filterPost(post));
	},

	filterUser(user, isMe = false) {
		const allowedKeys = [
			'friendlyUid', 'username',
			'plusPoint', 'minusPoint',
			'profile'
		];

		if(isMe) allowedKeys.push('boards', 'point');

		return Filter.filterObject(user, allowedKeys);
	},

	filterBoard(board) {
		const allowedKeys = [
			'boardId', 'title', 'college', 'created', 'requestCount'
		];

		return Filter.filterObject(board, allowedKeys);
	}
};

module.exports = Filter;
