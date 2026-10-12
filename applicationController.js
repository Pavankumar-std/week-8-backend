const Application = require("../models/Application");
const Job = require("../models/Job");
const { AppError, asyncHandler, sendSuccess } = require("../utils/helpers");

// POST /api/applications   body: { jobId, coverLetter }
exports.applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;
  if (!jobId) throw new AppError("Job ID is required", 400);

  const job = await Job.findById(jobId);
  if (!job) throw new AppError("Job not found", 404);

  const already = await Application.findOne({ job: jobId, candidate: req.user._id });
  if (already) throw new AppError("You have already applied for this job", 400);

  const application = await Application.create({
    job: jobId,
    candidate: req.user._id,
    coverLetter,
  });
  sendSuccess(res, 201, "Applied successfully", application);
});

// GET /api/applications/my
exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate("job", "title company location type")
    .sort({ createdAt: -1 });
  sendSuccess(res, 200, "Your applications", applications);
});

// GET /api/applications/:id
exports.getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("job")
    .populate("candidate", "name email");
  if (!application) throw new AppError("Application not found", 404);

  // Allowed: admin, the candidate, or the recruiter who posted the job
  const isAdmin = req.user.role === "admin";
  const isCandidate = application.candidate._id.equals(req.user._id);
  const isRecruiter = application.job.postedBy.equals(req.user._id);
  if (!isAdmin && !isCandidate && !isRecruiter) {
    throw new AppError("You cannot view this application", 403);
  }

  sendSuccess(res, 200, "Application fetched", application);
});

// PUT /api/applications/:id/status   body: { status }
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["applied", "shortlisted", "selected", "rejected"].includes(status)) {
    throw new AppError("Status must be applied, shortlisted, selected or rejected", 400);
  }

  const application = await Application.findById(req.params.id).populate("job");
  if (!application) throw new AppError("Application not found", 404);

  if (req.user.role !== "admin" && !application.job.postedBy.equals(req.user._id)) {
    throw new AppError("You can only update applications for your own jobs", 403);
  }

  application.status = status;
  await application.save();
  sendSuccess(res, 200, "Status updated successfully", application);
});

// DELETE /api/applications/:id
exports.deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new AppError("Application not found", 404);

  if (req.user.role !== "admin" && !application.candidate.equals(req.user._id)) {
    throw new AppError("You can only delete your own applications", 403);
  }

  await application.deleteOne();
  sendSuccess(res, 200, "Application deleted successfully", {});
});
