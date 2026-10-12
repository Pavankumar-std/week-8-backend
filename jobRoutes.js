const router = require("express").Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require("../controllers/jobController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");
const { jobValidator } = require("../validators/jobValidator");

const recruiterOrAdmin = [authenticateUser, authorizeRole("recruiter", "admin")];

router.get("/", getJobs);
router.get("/:id", getJob);
router.post("/", recruiterOrAdmin, jobValidator, createJob);
router.put("/:id", recruiterOrAdmin, updateJob);
router.delete("/:id", recruiterOrAdmin, deleteJob);

module.exports = router;
