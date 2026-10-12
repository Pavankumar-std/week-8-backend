// 404 for unknown routes
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

// One place to handle all errors (no stack trace is sent)
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)[0].message;
  } else if (err.name === "CastError") {
    status = 404;
    message = "Resource not found";
  } else if (err.code === 11000) {
    status = 400;
    message = "Already exists (duplicate value)";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    status = 401;
    message = "Invalid or expired token";
  } else if (!err.statusCode) {
    status = 500;
    message = "Something went wrong on the server";
  }

  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
