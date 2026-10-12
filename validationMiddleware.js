const { AppError } = require("../utils/helpers");

// Checks that all given fields are present in req.body
const requireFields = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body[field]) {
      const name = field.charAt(0).toUpperCase() + field.slice(1);
      return next(new AppError(`${name} is required`, 400));
    }
  }
  next();
};

module.exports = { requireFields };
