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
			},

			redis: {
				url: 6379
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
					'post.read',
					'post.read.search',
					'comment.read'
				]
			},

			user: {
				base: 'guest',
				privileged: [
					'user.auth', 'user.update',
					'post.update.my', 'post.delete.my',
					'post.write.ask', 'post.write.answer', 'post.write.ask.anonymous', 'post.write.answer.anonymous',
					'comment.write', 'comment.update.my', 'comment.delete.my',
					'report.create'
				]
			},

			admin: {
				base: 'user',
				privileged: [
					'admin',
					'board.setAcl',
					'user.setAcl',
					'ratelimit.bypass',
					'post.lock', 'post.update', 'post.delete', 'post.showRealName',
					'comment.update', 'comment.delete',
					'report.view', 'report.delete'
				]
			}
		},

		ratelimit: {
			// Score is resetted per 10 minutes
			score: 30000,
			resetAfter: 10 * 60 * 1000,

			// Decreasing score
			// All children of acl node are combined
			entries: {
				'post.read': 10,		// 3000 per 10 minutes
				'post.read.search': 100,// 300 per 10 minuntes
				'post.write': 500,		// 60 per 10 minutes
				'post.update': 500,		// 60 per 10 minutes
				'post.delete': 500,		// 60 per 10 minutes
				'report.create': 500,	// 60 per 10 minutes
				'user.updateInfo': 500	// 60 per 10 minutes
			}
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
	},

	middleware() {
		return (req, res, next) => {
			req.config = this.store;
			next();
		};
	}
};
