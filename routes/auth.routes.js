const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword,
  logout,
} = require("../controllers/auth.controller");
const { authCheck } = require("../middleware/authCheck");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authCheck, changePassword);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp",forgetPassword)
router.post("/reset-password",resetPassword);
router.post("/logout",logout)
module.exports = router;