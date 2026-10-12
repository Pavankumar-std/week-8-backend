const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    company: { type: String, required: [true, "Company is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    location: { type: String, required: [true, "Location is required"], trim: true },
    type: { type: String, enum: ["job", "internship"], required: [true, "Type is required"] },
    skills: [{ type: String, trim: true }],
    deadline: { type: Date, required: [true, "Deadline is required"] },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference
  },
  { timestamps: true }
);

// Indexes for commonly searched fields
jobSchema.index({ title: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
