const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled in");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }
  const match = await bcrypt.compare(password, user.password);
  if(!match) {
    throw Error("Incorrect password, please try again")
  }
  return user;
};

// static signup method
userSchema.statics.signup = async function (email, password, confirmPassword) {
  // validation
  if (!email || !password || !confirmPassword) {
    throw Error("All fields must be filled");
  }
  if(password !== confirmPassword) {
    throw Error("Please make sure passwords match");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email must be a valid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password must be a valid strong password");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  // password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // send user to database
  const user = await this.create({ email, password: hash });

  return user;
};

module.exports = mongoose.model("User", userSchema);
