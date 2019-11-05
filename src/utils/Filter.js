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
			'postId', 'title', 'content', 'date', 'college', 'subject', 'anonymous',
			...(post.anonymous ? [] : ['author'])
		];
		
		return Filter.filterObject(post, allowedKeys);
	},
	
	filterPosts(posts) {
		return posts.map(post => Filter.filterPost(post));
	},
	
	filterUser(user, isMe = false) {
		const allowedKeys = ['userId', 'username', 'plusPoint'];
		if(isMe)
			allowedKeys.push('point', 'minusPoint');
		
		return Filter.filterObject(user, allowedKeys);
	}
};

module.exports = Filter;
