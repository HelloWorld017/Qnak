const config = require('../config');
const getParentAcl = require('./getParentAcl');

const aclTable = {};
const calculateAcl = aclName => {
	if(aclTable[aclName]) return;
	
	const aclContent = config.store.userAcl[aclName];
	if(aclContent.base) calculateAcl(aclContent.base);

	const base = aclContent.base ? aclTable[aclContent.base] : {};

	aclTable[aclName] = {
		privileged: (aclContent.privileged || []).concat(base.privileged || []),
		restricted: (aclContent.restricted || []).concat(base.restricted || [])
	};
};

class Acl extends Function {
	constructor(aclObject, req) {
		super();
		
		let calculated = [];
		let restricted = [];
		
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
		
		this.calculated = calculated;
		this.request = req;
		
		return new Proxy(this, {
			apply(target, thisArg, argumentsList) {
				return target.fromParentNode(...argumentsList);
			}
		});
	}
	
	get value() {
		return this.calculated;
	}
	
	checkAndActivate(foundAcl) {
		if(!foundAcl) return false;
		if(!this.request.activeAcl) this.request.activeAcl = [];
		this.request.activeAcl.push(foundAcl);
		
		return true;
	}
	
	/*
	* If user has exact permission, allow.
	*
	* ex) acl: post.delete
	* If user has post.delete, allow.
	*/
	exact (acl) {
		if(!this.calculated.includes(acl)) return false;
		return this.checkAndActivate(acl);
	}
	
	/*
	* If user has parent permission, allows.
	*
	* ex) acl: post.delete
	* If user has post or post.delete, allow.
	*/
	fromParentNode(acl) {
		const parentAcl = getParentAcl(acl);
		const foundAcl = parentAcl.find(acl => this.calculated.includes(acl));
		
		return this.checkAndActivate(foundAcl);
	}
	
	/*
	* If user has children permission, allows.
	*
	* ex) acl: post.write
	* If user has post.write or post.write.ask or post.write.answer, or ..., allow.
	*/
	fromChildNode(acl) {
		const foundAcl = this.calculated.find(
			owningAcl => owningAcl.startsWith(`${acl}.`) || owningAcl === acl
		);
		
		return this.checkAndActivate(foundAcl);
	}
	
	/*
	* If user has children or parent permission, allows.
	*
	* ex) acl: post.write
	* If user has post or post.write or post.write.ask, ... allow.
	*/
	fromAllNodes(acl) {
		if(this.fromChildNode(acl)) return true;
		if(this.fromParentNode(acl)) return true;
		
		return false;
	};
}

module.exports = (aclObject, req) => {
	return new Acl(aclObject, req);
};

module.exports.init = () => {
	Object.keys(config.store.userAcl).forEach(calculateAcl);
};
