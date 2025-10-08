// middleware/errorHandler.js - Global error handling middleware

const { ValidationError, NotFoundError, UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Global error handling middleware
 * Catches all errors and returns consistent error responses
 */
const errorHandler = (err, req, res, next) => {
  console.error('💥 Error Stack:', err.stack);
  
  // Default error response
  let errorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500
  };
  
  // Handle known custom errors
  if (err instanceof ValidationError) {
    errorResponse = {
      error: 'Validation Error',
      message: err.message,
      errors: err.errors,
      statusCode: err.statusCode
    };
  } else if (err instanceof NotFoundError) {
    errorResponse = {
      error: 'Not Found',
      message: err.message,
      statusCode: err.statusCode
    };
  } else if (err instanceof UnauthorizedError) {
    errorResponse = {
      error: 'Unauthorized',
      message: err.message,
      statusCode: err.statusCode
    };
  } else if (err instanceof ForbiddenError) {
    errorResponse = {
      error: 'Forbidden',
      message: err.message,
      statusCode: err.statusCode
    };
  } else if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    // JSON parse error
    errorResponse = {
      error: 'Bad Request',
      message: 'Invalid JSON in request body',
      statusCode: 400
    };
  } else if (err.statusCode) {
    // Other errors with statusCode
    errorResponse = {
      error: err.name || 'Error',
      message: err.message,
      statusCode: err.statusCode
    };
  }
  
  // Log the error for debugging
  console.error(`❌ ${errorResponse.statusCode} - ${errorResponse.error}: ${errorResponse.message}`);
  
  // Send error response
  res.status(errorResponse.statusCode).json(errorResponse);
};

module.exports = errorHandler;