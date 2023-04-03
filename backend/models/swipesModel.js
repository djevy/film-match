const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const swipesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imdb_id: {
      type: String,
      required: true,
    },
    liked: {
      type: Boolean,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Swipes", swipesSchema);
