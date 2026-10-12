const { AppError } = require("../utils/helpers");
const { requireFields } = require("../middleware/validationMiddleware");

const checkEmailAndPassword = (req, res, next) => {
  const { email, password } = req.body;
  if (!/^\S+@\S+\.\S+$/.test(email)) return next(new AppError("Email is not valid", 400));
  if (String(password).length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }
  next();
};

exports.registerValidator = [requireFields(["name", "email", "password"]), checkEmailAndPassword];
exports.loginValidator = [requireFields(["email", "password"])];
