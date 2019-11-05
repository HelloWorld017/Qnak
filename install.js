const database = require('./src/database');

(async () => {
	await database.init();

	const elastic = database.elastic;
	elastic.indices.putSettings({
		index: 'qnak-posts',
		body: {
			"analysis": {
				"analyzer": {
					"nori": {
						"tokenizer": "nori_tokenizer"
					}
				}
			}
		}
	});

	const noriAnalyzer = {
		type: "text",
		fields: {
			nori: {
				type: "text",
				analyzer: "nori"
			}
		}
	};
	
	elastic.indices.putMapping({
		index: 'qnak-posts',
		body: {
			properties: {
				title: noriAnalyzer,
				content: noriAnalyzer,

				postId: {type: "keyword"},
				commentId: {type: "keyword"},
				answerId: {type: "keyword"},
				tags: {type: "keyword"},
				author: {type: "keyword"},
				date: {type: "date"},
				college: {type: "keyword"},
				subject: {type: "keyword"},
				anonymous: {type: "boolean"},

				relation: {
					type: "join",
					relations: {
						"question": ["answer", "comment"],
						"answer": "comment"
					}
				}
			}
		}
	});
});
