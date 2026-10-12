const router = require("express").Router();
const { getProfile, updateProfile, deleteProfile } = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.use(authenticateUser); // all user routes are protected

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.delete("/profile", deleteProfile);

module.exports = router;
