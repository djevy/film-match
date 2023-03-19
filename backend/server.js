require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");



// Express app
const app = express();

// Route handler
app.use("/api/user", userRoutes);

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