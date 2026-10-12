const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/database");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();
const app = express();

// Security
app.use(helmet()); // secure headers
app.use(cors({ origin: "http://localhost:3000" })); // only allow our frontend
app.use(express.json({ limit: "10kb" })); // request size limit
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, message: "Too many requests, try again later" } }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

// Errors (always last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
