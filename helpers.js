const jwt = require("jsonwebtoken");

// Custom error with a status code
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Wraps async functions so errors go to the error middleware
const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Same success format for every API
const sendSuccess = (res, statusCode, message, data) => {
  res.status(statusCode).json({ success: true, message, data });
};

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// Stops special regex characters in search text
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { AppError, asyncHandler, sendSuccess, generateToken, escapeRegex };
