const ErrorHandlers = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error--
  if (err.name === "CastError") {
    const message = `Resource not found Invalid : ${err.path}`;
    err = ErrorHandlers(message, 400);
  }

  // message dupalicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandlers(message, 400);
  }

  // wrong Jwt error
  if (err.code === "JsonWebTokenError") {
    const message = `json Web token is invalid, try again`;
    err = new ErrorHandlers(message, 400);
  }

  // jwt expire error
  if (err.code === "TokenExpiredError") {
    const message = `Json web token Expire, try again`;
    err = new ErrorHandlers(message, 400);
  }

  res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};
