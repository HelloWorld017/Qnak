const config = require('./config');

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
	
	const hasAcl = acl => calculated.includes(acl);
	hasAcl.value = calculated;
	
	return hasAcl;
};
