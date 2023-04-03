const express = require("express");

const router = express.Router();

// Controller functions
const {
  loginUser,
  signupUser,
  addFriend,
} = require("../controllers/userController");

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// add friend route
router.post("/:user_id/friends", addFriend);

module.exports = router;
