// Middleware for error hanfling
const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';
  
  console.error(`Error: ${message}`);
  
  // Send structured error response
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      statusCode,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    },
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
