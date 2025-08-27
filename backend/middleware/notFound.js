// Middleware to handle 404 errors
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl} is not a valid route`,
    error: {
      statusCode: 404,
      path: req.path,
      method: req.method,
    },
  });
};

module.exports = notFound; 
