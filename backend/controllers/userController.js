const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// user register --
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is simple id",
      url: "this is simple url",
    },
  });

  // yah ek alag se func banaya hua hai yah token ko cookie me set kar dega ok.
  sendToken(user, 201, res);
});

// user login ---
exports.logIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invailid email & password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invailid email & password", 401));
  }

  // yah ek alag se func banaya hua hai yah token ko cookie me set kar dega ok.
  sendToken(user, 200, res);
});

// logout user ---
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  }),
    res.status(200).json({
      success: true,
      message: "logged out",
    });
});

// forgot password ---
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\nif you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password--
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  user.save();

  sendToken(user, 200, res);
});

//get user details--
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: false,
    user,
  });
});

//change user password--
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is invalid", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update Profile --
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    email: req.body.email,
    name: req.body.name,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "changes successfully",
  });
});



// get all users (admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});



// get single user details (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});




// update user role -- admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    email: req.body.email,
    name: req.body.name,
    role:req.body.role
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "changes successfully",
  });
});


// delete user -- admin
exports.deleteUser = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.params.id)
  
  if(!user){
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
  }

  await user.deleteOne({})

  res.status(200).json({
    success:true,
    message:"User deleted successfully"
  })

})