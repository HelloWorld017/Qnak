const config = require('./src/config');
const database = require('./src/database');
const loggers = require('./src/loggers');

(async () => {
	await config.init();
	await database.init();
	
	loggers.root.info('[1 / 2] Setting elasticsearch...');
	try {
		const noriAnalyzer = {
			type: "text",
			fields: {
				analyzed: {
					type: "text",
					analyzer: "nori"
				}
			}
		};
		
		const elastic = database.elastic;
		await elastic.indices.create({
			index: 'qnak-posts',
			body: {
				settings: {
					analysis: {
						analyzer: {
							nori: {
								tokenizer: "nori_tokenizer"
							}
						}
					}
				},
				
				mappings: {
					properties: {
						title: noriAnalyzer,
						excerpt: noriAnalyzer,

						postId: {type: "keyword"},
						commentId: {type: "keyword"},
						tags: {type: "keyword"},
						author: {type: "keyword"},
						date: {type: "date"},
						college: {type: "keyword"},
						subject: {type: "keyword"},
						anonymous: {type: "boolean"},

						relation: {
							type: "join",
							relations: {
								"question": ["answer", "comment"]
							}
						},
						
						attachments: noriAnalyzer
					}
				}
			}
		});
	} catch(e) {
		loggers.root.fatal(e);
		if(e.meta && e.meta.body && e.meta.body.error) {
			loggers.root.fatal(e.meta.body.error.reason);
		}
	}
	
	loggers.root.info('[2 / 2] Setting mongodb...');
	try {
		const mongo = database.mongo;
		
		await mongo.createCollection('boards');
		await mongo.collection('boards').createIndex({boardId: -1});
		
		await mongo.createCollection('posts');
		await mongo.collection('posts').createIndex({postId: -1});
		
		await mongo.createCollection('users');
		await mongo.collection('users').createIndex({userId: -1});
	} catch(e) {
		loggers.root.fatal(e);
	}
	
	loggers.root.finish("Done install Qnak!");
})();
