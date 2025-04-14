const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Default error
    let statusCode = 500;
    let message = 'Server Error';
    let errors = [];
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
      
      // Extract validation errors
      for (const field in err.errors) {
        errors.push({
          field,
          message: err.errors[field].message
        });
      }
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
      
      // Extract duplicate field
      const field = Object.keys(err.keyValue)[0];
      errors.push({
        field,
        message: `${field} already exists`
      });
    }
    
    // Mongoose cast error (invalid ID)
    if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Resource not found';
      errors.push({
        field: err.path,
        message: `Invalid ${err.path}`
      });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
    
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }
    
    // Response with error details
    res.status(statusCode).json({
      success: false,
      message,
      errors: errors.length > 0 ? errors : undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  module.exports = errorHandler;