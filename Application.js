const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "selected", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// One candidate can apply to a job only once
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
