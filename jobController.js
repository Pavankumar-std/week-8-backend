const Job = require("../models/Job");
const { AppError, asyncHandler, sendSuccess, escapeRegex } = require("../utils/helpers");

// GET /api/jobs?search=react&type=internship&location=remote&skill=react&sort=newest&page=1&limit=10
exports.getJobs = asyncHandler(async (req, res) => {
  const { search, type, location, skill, sort } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  // Filters (String() stops query injection like ?type[$ne]=x)
  const filter = {};
  if (type) filter.type = String(type).toLowerCase();
  if (location) filter.location = new RegExp(escapeRegex(String(location)), "i");
  if (skill) filter.skills = new RegExp("^" + escapeRegex(String(skill)) + "$", "i");

  // Search in title, company, skills and location
  if (search) {
    const regex = new RegExp(escapeRegex(String(search)), "i");
    filter.$or = [{ title: regex }, { company: regex }, { skills: regex }, { location: regex }];
  }

  // Sorting
  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    deadline: { deadline: 1 },
  };
  const sortBy = sortOptions[sort] || sortOptions.newest;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("postedBy", "name email"),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Jobs fetched successfully",
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: jobs,
  });
});

// GET /api/jobs/:id
exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("postedBy", "name email");
  if (!job) throw new AppError("Job not found", 404);
  sendSuccess(res, 200, "Job fetched successfully", job);
});

// POST /api/jobs
exports.createJob = asyncHandler(async (req, res) => {
  const { title, company, description, location, type, skills, deadline } = req.body;
  const job = await Job.create({
    title, company, description, location, type, skills, deadline,
    postedBy: req.user._id,
  });
  sendSuccess(res, 201, "Job created successfully", job);
});

// PUT /api/jobs/:id  (only the owner recruiter or admin)
exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);
  if (req.user.role !== "admin" && !job.postedBy.equals(req.user._id)) {
    throw new AppError("You can only update your own jobs", 403);
  }

  const fields = ["title", "company", "description", "location", "type", "skills", "deadline"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) job[f] = req.body[f];
  });
  await job.save();

  sendSuccess(res, 200, "Job updated successfully", job);
});

// DELETE /api/jobs/:id  (only the owner recruiter or admin)
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);
  if (req.user.role !== "admin" && !job.postedBy.equals(req.user._id)) {
    throw new AppError("You can only delete your own jobs", 403);
  }

  await job.deleteOne();
  sendSuccess(res, 200, "Job deleted successfully", {});
});
