module.exports = aclName => aclName.split('.').reduce((prev, curr) => {
	prev.list.push(prefix + curr)
	prev.prefix += `${curr}.`;

	return prev;
}, {prefix: '', list: []}).list.reverse();
