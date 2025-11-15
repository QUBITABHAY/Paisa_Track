export const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
  const response = {
    success: true,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode = 500, message = "Internal server error") => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

export const sendValidationError = (res, message) => {
  return sendError(res, 400, message);
};

export const sendAuthError = (res, message = "Not authenticated") => {
  return sendError(res, 401, message);
};

export const sendNotFoundError = (res, message = "Resource not found") => {
  return sendError(res, 404, message);
};

export const sendConflictError = (res, message = "Resource already exists") => {
  return sendError(res, 409, message);
};
