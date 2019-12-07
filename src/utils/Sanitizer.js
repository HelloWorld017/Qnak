const htmlToText = require('html-to-text');
const sanitizeHtml = require('sanitize-html');

class Sanitizer {
	sanitizeContent(content) {
		//TODO update specification
		
		return sanitizeHtml(content, {
			allowedTags: ['b', 'i', 'em', 'a', 'img', 'h1', 'h2', 'code', 'pre', 'p'],
			allowedAttributes: {
				a: ['href'],
				img: ['src', 'alt']
			},
			allowedIframeHostnames: [],
			allowedSchemesByTag: {
				'a': ['http', 'https', 'mailto'],
				'img': ['http', 'https']
			},
			allowedSchemesAppliedToAttributes: ['href', 'src'],
			allowProtocolRelative: true
		});
	}
	
	sanitizeAsText(content) {
		return htmlToText.fromString(content);
	}
}

module.exports = Sanitizer;
