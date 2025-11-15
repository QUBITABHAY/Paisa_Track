export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists'
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found'
    });
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
