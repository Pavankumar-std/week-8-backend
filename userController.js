const User = require("../models/User");
const { asyncHandler, sendSuccess } = require("../utils/helpers");

// GET /api/users/profile
exports.getProfile = (req, res) => {
  sendSuccess(res, 200, "Profile fetched", req.user);
};

// PUT /api/users/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  await user.save();

  sendSuccess(res, 200, "Profile updated successfully", user);
});

// DELETE /api/users/profile
exports.deleteProfile = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  sendSuccess(res, 200, "Account deleted successfully", {});
});
