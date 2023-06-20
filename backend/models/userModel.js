const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30, "Name cannot exceed 30 charactor"],
    minLength: [4, "Name should have more then 4 charactor"],
  },
  email: {
    type: String,
    required: [true, "please enter your name"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "password should be greater then 6 charactor"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
});

// yah password ko bcrypt kar dega ok--
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password =await bcrypt.hash(this.password,10);
});

//yah token generate kar dega-- JWT TOKEN--
userSchema.methods.getJWTToken = function () {
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}


//compare password --
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}


//generating reset password token
userSchema.methods.getResetPasswordToken = function(){
  
  //generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hashing and adding resetpasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  this.resetPasswordExpired = Date.now() + 15 * 60 * 1000;

  return resetToken;

}

module.exports = mongoose.model("User", userSchema);
