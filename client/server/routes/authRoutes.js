const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// protected route
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;