// middleware/auth.js - API key authentication middleware

const { UnauthorizedError } = require('../utils/errors');

/**
 * Middleware to validate API key from request headers
 * Expected header: x-api-key: your-secret-api-key
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // In a real application, you would validate against a database
  // For this assignment, we'll use a hardcoded key or environment variable
  const validApiKey = process.env.API_KEY || 'secret-api-key-2024';
  
  if (!apiKey) {
    return next(new UnauthorizedError('API key is required. Please include x-api-key in headers.'));
  }
  
  if (apiKey !== validApiKey) {
    return next(new UnauthorizedError('Invalid API key.'));
  }
  
  // API key is valid, proceed to next middleware
  next();
};

module.exports = {
  validateApiKey
};