export const errorHandler = (err, req, res, next) => {
  console.error({
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
    requestId: req.requestId,
  });
};
