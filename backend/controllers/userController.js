const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // create token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// sign up user
const signupUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    const user = await User.signup(email, password, confirmPassword);
    // create token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// add friend to friend list
const addFriend = async (req, res) => {
  const { user_id } = req.params;
  const email = req.body.friendsEmail;
  try {
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(404).json({ error: "No such user found" });
    }
    const user = await User.findByUserId(user_id);

    // Check if the friend exists in the database
    const friend = await User.findFriend(email);

    // Check if the friend already exists in the user's friends list
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Friend already added" });
    }

    if (friend) {
      // Add the friend to the user's friends list
      user.friends.push(friend._id);
      await user.save();
      res.status(200).json({ message: "Friend added" });
    } else {
      return res.status(404).json({ message: "Friend not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser, addFriend };
