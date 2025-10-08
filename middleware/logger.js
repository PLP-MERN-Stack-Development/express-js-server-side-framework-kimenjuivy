// middleware/logger.js - Custom request logger middleware

/**
 * Custom logger middleware that logs request method, URL, timestamp, and response time
 */
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  
  // Log request body for POST, PUT, PATCH requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const logBody = { ...req.body };
    // Remove sensitive data from logs
    if (logBody.password) delete logBody.password;
    if (logBody.apiKey) delete logBody.apiKey;
    console.log('📦 Request Body:', logBody);
  }
  
  // Capture when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${logLevel} ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = logger;