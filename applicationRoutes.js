const router = require("express").Router();
const {
  applyToJob, getMyApplications, getApplication, updateStatus, deleteApplication,
} = require("../controllers/applicationController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

router.use(authenticateUser); // all application routes are protected

router.post("/", authorizeRole("candidate"), applyToJob);
router.get("/my", authorizeRole("candidate"), getMyApplications); // must be above /:id
router.get("/:id", getApplication);
router.put("/:id/status", authorizeRole("recruiter", "admin"), updateStatus);
router.delete("/:id", authorizeRole("candidate", "admin"), deleteApplication);

module.exports = router;
