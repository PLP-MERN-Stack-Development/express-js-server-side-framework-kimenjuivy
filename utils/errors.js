// utils/errors.js - Custom error classes for better error handling

/**
 * Base custom error class
 */
class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for resource not found (404)
 */
class NotFoundError extends CustomError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

/**
 * Error for validation failures (400)
 */
class ValidationError extends CustomError {
  constructor(errors = []) {
    super('Validation failed', 400);
    this.errors = errors;
  }
}

/**
 * Error for unauthorized access (401)
 */
class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

/**
 * Error for forbidden access (403)
 */
class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden access') {
    super(message, 403);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError
};