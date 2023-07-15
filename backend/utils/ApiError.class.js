class ApiError extends Error {
    statusCode;
    message;

    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ApiError