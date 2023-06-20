
//create token and save in cookie---

const sendToken = (user, statesCode, res) => {
  const token = user.getJWTToken();

  // option for cookie---
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statesCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;