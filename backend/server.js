require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const swipesRoutes = require("./routes/swipes");



// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Route handler
app.use("/api/user", userRoutes);
app.use("/api/swipes", swipesRoutes);

// Connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen on port
    app.listen(process.env.PORT, () => {
      console.log(`Connected to db and listening on ${process.env.PORT}!`);
    });
  })
  .catch((error) => {
    console.log(error);
  });