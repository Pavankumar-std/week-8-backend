const router = require("express").Router();
const { register, login, getMe, logout } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidator");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/me", authenticateUser, getMe);
router.post("/logout", authenticateUser, logout);

module.exports = router;
