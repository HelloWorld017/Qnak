const deepmerge = require('deepmerge');
const fs = require('fs');
const logger = require('./logger');

module.exports = {
	store: {},
	path: './config.json',
	default: {
		$secret: [...Array(10)]
			.map(() => Math.random().toString(36).slice(2))
			.join('')
			.slice(0, Math.floor(Math.random() * 32) + 64)
			.split('')
			.map(v => Math.random() < 0.5 ? v.toUpperCase() : v.toLowerCase())
			.join(''),

		db: {
			mongodb: {
				url: 'localhost',
				port: 27017,
				name: 'qnak',
				id: 'USERNAME',
				pw: 'PASSWORD'
			},
			
			elastic: {
				url: 'localhost',
				port: 9200
			}
		},
		
		site: {
			url: 'localhost'
		},

		post: {
			maxLength: 50000
		},

		userAcl: {
			guest: {
				privileged: [
					'post.read'
				]
			},
			
			user: {
				base: 'guest',
				privileged: [
					'user.auth', 'user.updateInfo',
					'post.update.my', 'post.delete.my',
					'post.write.ask', 'post.write.answer', 'post.write.ask.anonymous', 'post.write.answer.anonymous',
					'report.create'
				]
			},
			
			admin: {
				base: 'user',
				privileged: [
					'admin',
					'board.setAcl',
					'post.lock', 'post.update.any', 'post.delete.any', 'post.showRealName',
					'user.authAsAnyone', 'user.setAcl', 'user.updateInfo',
					'ratelimit.bypass',
					'report.view', 'report.delete',
				]
			}
		},
		
		// Maximum request per 10 minutes
		// All children of acl node are combined
		ratelimit: {
			'post.read': 3000,
			'post.write': 60,
			'post.update': 60,
			'post.delete': 60,
			'report.create': 60,
			'user.updateInfo': 60
		}
	},

	async generate() {
		this.store = deepmerge({}, this.default);
		await this.save();
	},

	async load(configPath) {
		this.path = configPath || this.path;

		try {
			const content = JSON.parse(await fs.readFile(this.path, 'utf8'));
			
			this.store = deepmerge(
				this.default,
				content,
				{arrayMerge: (dest, source, opt) => source}
			);
		} catch(e) {
			if(e.code === 'ENOENT') {
				logger.info("Generated new configuration file.");
				this.store = deepmerge({}, this.default);
			} else {
				logger.error("Error while reading configuration file!");
				throw new Error("Error while reading configuration file!");
			}
		}

		await this.save();
	},

	async save() {
		await fs.promises.writeFile(this.path, JSON.stringify(this.store, null, '\t'));
	},

	async init() {
		await this.load();
	}
};
