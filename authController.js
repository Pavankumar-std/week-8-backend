const User = require("../models/User");
const { AppError, asyncHandler, sendSuccess, generateToken } = require("../utils/helpers");

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Nobody can register as admin from the API
  const safeRole = role === "recruiter" ? "recruiter" : "candidate";

  const user = await User.create({ name, email, password, role: safeRole });
  const token = generateToken(user._id);

  sendSuccess(res, 201, "Registered successfully", {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);
  sendSuccess(res, 200, "Login successful", {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /api/auth/me
exports.getMe = (req, res) => {
  sendSuccess(res, 200, "Current user", req.user);
};

// POST /api/auth/logout  (JWT is stateless, so the client deletes the token)
exports.logout = (req, res) => {
  sendSuccess(res, 200, "Logged out successfully", {});
};
