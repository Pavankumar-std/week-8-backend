const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError, asyncHandler } = require("../utils/helpers");

// Checks the JWT token and finds the logged-in user
const authenticateUser = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // error handler deals with bad tokens

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("User no longer exists", 401);

  req.user = user;
  next();
});

module.exports = { authenticateUser };
