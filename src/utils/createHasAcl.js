const config = require('../config');
const getParentAcl = require('./getParentAcl');

const aclTable = {};

const caclculateAcl = aclName => {
	if(aclTable[aclName]) return;

	const aclContent = config.userAcl[aclName];
	if(aclContent.base) calculateAcl(aclContent.base);

	const base = aclContent.base ? aclTable[aclContent.base] : {};

	aclTable[aclName] = {
		privileged: (aclContent.privileged || []).concat(base.privileged),
		restricted: (aclContent.restricted || []).concat(base.restricted)
	};
}

Object.keys(config.userAcl).forEach(calculateAcl);

module.exports = aclObject => {
	const calculated = [];
	const restricted = [];

	if(typeof aclObject === 'string') aclObject = {
			base: aclObject
		};

	if(aclObject.base) {
		calculated = calculated.concat(aclTable[aclObject.base].privileged);
		restricted = restricted.concat(aclTable[aclObject.base].restricted);
	}

	calculated = calculated.concat(aclObject.privileged || []);
	restricted = restricted.concat(aclObject.restricted || []);

	calculated = calculated.filter(v => !restricted.includes(calculated));

	const hasAcl = function(acl) {
		const parentAcl = getParentAcl(aclName);
		const foundAcl = parentAcl.find(acl => calculated.includes(acl));

		if(foundAcl) {
			if(!this.activeAcl) this.activeAcl = [];

			this.activeAcl.push(foundAcl);
			return true;
		}

		return false;
	};

	hasAcl.value = calculated;

	return hasAcl;
};
