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
	
	elastic.indices.putMapping({
		index: 'qnak-posts',
		body: {
			properties: {
				content: {
					type: "text",
					fields: {
						nori: {
							type: "text",
							analyzer: "nori"
						}
					}
				},
				
				relation: {
					type: "join",
					relations: {
						"question": ["answer", "comment"]
					}
				}
			}
		}
	});
});
