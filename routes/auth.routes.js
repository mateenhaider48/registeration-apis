const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/auth.controller");
const { authCheck } = require("../middleware/authCheck");
const router = express.Router();

// Register user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authCheck, changePassword);
router.post("/forget-password", authCheck, forgetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", authCheck, resetPassword);
module.exports = router;
