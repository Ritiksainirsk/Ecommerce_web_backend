const jwt = require("jsonwebtoken");
const ErrorHandlers = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandlers("please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

// yah admin ke liye hai login hua hua hoga to role me admin hoga to access kar payega nahi to nahi...
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandlers(
          `Role: ${req.user.role} is not allowed to access this role`,
          403
        )
      );
    }

    next();
  };
};
