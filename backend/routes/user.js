const express = require("express");

const router = express.Router();

// Controller functions
const {
  loginUser,
  signupUser,
  addFriend,
  getFriends,
} = require("../controllers/userController");

// Require auth for friend routes
const requireAuth = require("../middleware/requireAuth");

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

router.use(requireAuth);

// add friend route
router.post("/addfriends", addFriend);

router.get("/getfriends", getFriends);

module.exports = router;
