const express = require("express");
const {
  getSwipes,
  getSwipe,
  createSwipe,
  deleteSwipe,
  updateSwipe,
} = require("../controllers/swipesController");

// Require auth for swipe routes
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

// GET all swipes
router.get("/", getSwipes);

// Get single swipe
router.get("/:id", getSwipe);

// POST a single swipe
router.post("/", createSwipe);

// DELETE a single swipe
router.delete("/:id", deleteSwipe);

// UPDATE a single swipe
router.patch("/:id", updateSwipe);

module.exports = router;
