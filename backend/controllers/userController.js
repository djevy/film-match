const User = require("../models/userModel");
const Swipes = require("../models/swipesModel");
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

// get all friends
const getFriends = async (req, res) => {
  const user_id = req.user._id;
  try {
    const userFriends = await User.find(user_id).populate("friends");
    console.log(
      userFriends.map((friend) => friend.friends.map((f) => f._id)).flat()
    );
    const friendEmails = userFriends
      .map((friend) => friend.friends.map((f) => f.email))
      .flat();
    res.status(200).json({ friendEmails });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// add friend to friend list
const addFriend = async (req, res) => {
  const user_id = req.user._id;
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

// find matches
const findMatches = async (req, res) => {
  const user_id = req.user._id;
  try {
    const userFriends = await User.find(user_id).populate("friends");
    const friendIds = userFriends
      .map((friend) => friend.friends.map((f) => f._id))
      .flat();
    const friendEmails = userFriends
      .map((friend) => friend.friends.map((f) => f.email))
      .flat();
    const userSwipes = await Swipes.find({ user_id }).sort({ createdAt: -1 });
    const friendSwipes = await Swipes.find({
      user_id: { $in: friendIds },
    }).sort({ createdAt: -1 });

    //  filter the user's swipes and the friend's swipes to find matching swipes
    const matchedSwipes = userSwipes.filter((userSwipe) => {
      return friendSwipes.some((friendSwipe) => {
        return (
          friendSwipe.name === userSwipe.name &&
          friendSwipe.liked === true &&
          userSwipe.liked === true &&
          friendSwipe.user_id.toString() === friendSwipe.user_id.toString()
        );
      });
    });
    res.status(200).json({ matchedSwipes });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser, addFriend, getFriends, findMatches };
