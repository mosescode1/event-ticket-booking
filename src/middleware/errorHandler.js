import ApiError from "../utils/ApiError.js";

function errorHandler(err, req, res, next) {
  // Standardize unknown errors
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal Server Error";

  // Optionally include stack in non-production
  const response = {
    statusCode,
    message,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && !(err instanceof ApiError)) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}

export default errorHandler;
