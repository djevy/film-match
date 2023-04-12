const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // verify the authenticated user
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, exp } = jwt.verify(token, process.env.SECRET_KEY);
    if (Date.now() >= exp * 1000) {
      // token has expired
      return res.status(401).json({ error: "Token has expired" });
    }
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
