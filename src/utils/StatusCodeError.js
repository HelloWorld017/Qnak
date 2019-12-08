class StatusCodeError extends Error {
	constructor(statusCode, message) {
		super(message);

		this.qnakStatusCode = statusCode;
	}
}

module.exports = StatusCodeError;
