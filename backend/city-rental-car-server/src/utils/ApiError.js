export class ApiError extends Error {
  constructor(statusCode, message, error = {}) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.error = error
  }
}
