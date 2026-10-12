const { AppError } = require("../utils/helpers");

// Example: authorizeRole("admin", "recruiter")
const authorizeRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to do this", 403));
  }
  next();
};

module.exports = { authorizeRole };
