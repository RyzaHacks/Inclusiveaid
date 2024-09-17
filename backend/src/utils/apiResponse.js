//inclusive-aid\backend\src\utils\apiResponse.js

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  
  const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  };
  
  module.exports = { successResponse, errorResponse };