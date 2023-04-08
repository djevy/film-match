const Swipes = require("../models/swipesModel");
const mongoose = require("mongoose");

// Get all swipes
const getSwipes = async (req, res) => {
  const user_id = req.user._id;
  const swipes = await Swipes.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(swipes);
};

// Get a single swipe
const getSwipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such swipe found" });
  }

  const swipe = await Swipes.findById(id);
  if (!swipe) {
    return res.status(404).json({ error: "No such swipe found" });
  }

  res.status(200).json(swipe);
};

// Create a new swipes
const createSwipe = async (req, res) => {
  const { name, imdb_id, mediaType, liked } = req.body;

  let emptyFields = [];

  if (!name) {
    emptyFields.push("name");
  }
  if (!imdb_id) {
    emptyFields.push("imdb_id");
  }
  if (!mediaType) {
    emptyFields.push("mediaType");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // Add document to db
  try {
    const user_id = req.user._id;
    const swipe = await Swipes.create({ name, imdb_id, mediaType, liked, user_id });
    res.status(200).json({ message: "Swipe created successfully", swipe });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a swipe
const deleteSwipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such swipe found" });
  }

  const swipe = await Swipes.findOneAndDelete({ _id: id });

  if (!swipe) {
    return res.status(404).json({ error: "No such swipe found" });
  }
  res.status(200).json({ message: "Swipe deleted successfully", swipe });
};

// Update a swipe
const updateSwipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such swipe found" });
  }

  const swipe = await Swipes.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!swipe) {
    return res.status(404).json({ error: "No such swipe found" });
  }
  res.status(200).json({ message: "Swipe updated successfully", swipe });
};

module.exports = {
  getSwipes,
  getSwipe,
  createSwipe,
  deleteSwipe,
  updateSwipe,
};
