class ApiError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = message;
    this.message = message;
  }
}

module.exports = ApiError;
