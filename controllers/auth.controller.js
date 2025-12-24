const userModal = require("../models/user.model");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const otpModal = require("../models/otp.model");
const { sendEmail } = require("../configDb/send.email");
const bcrypt = require('bcryptjs');


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if all fields are provided
    if (!name || !email || !password || !role) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Validate password length
    if (password.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters",
      });
    }

    // 3. Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // 4. Check if user already exists
    const existingUser = await userModal.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password,12)

    // 6. Create new user
    const newUser = new userModal({
      name,
      email,
      password: hashPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Something went wrong while registering user", error);

    if (error.message.includes("timeout")) {
      return res.status(500).json({
        success: false,
        message: "It looks like your internet is slow, please try again",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Ye hamari ghalti hai",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Required all fields",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Please Enter Valid Email",
      });
    }

    // find user by email
    const user = await userModal.findOne({ email })
    console.log("This is user from login", user);

    // user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // password check (plain text)
    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api",
      maxAge: 15 * 24 * 60 * 60,
    });

    user.password = undefined;

    // login success
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("timeout")) {
      return res.status(500).json({
        success: false,
        message: "It looks like your internet is slow, please try again",
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong while logging in, please try again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await userModal.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Enter correct old password",
      });
    }

    const newHashPassword = await bcrypt.hash(newPassword, 12);
    user.password = newHashPassword;

    const saveUser = await user.save();

    if (saveUser) {
      return res.status(200).json({
        succes: true,
        message: "Password change successfully.",
      });
    }

    if (!saveUser) {
      return res.ststus(401).json({
        succes: true,
        message: "Password not update successfully.",
      });
    }
  } catch (error) {
    if (error.message.includes("timeout")) {
      return res.status(500).json({
        success: false,
        message: "It looks like your internet is slow, please try again",
      });
    }
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while changing in password, please try again",
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email from req.body in controller", email);

    const user = await userModal.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Otp in controller", otp);

    const newOtp = new otpModal({
      otp,
      email,
    });

    await newOtp.save();

    console.log("This is newOTP in controller", newOtp);

    const message = `Yor verification code for password reset is ${otp}`;
    console.log("This is generated message in controller:", message);
    const subject = "Reset Password";

    const isSend = await sendEmail(email, subject, message);

    console.log("this is isSend response", isSend);

    if (isSend) {
      return res.status(200).json({
        success: true,
        message: "OTP is send to your email",
      });
    }
  } catch (error) {
    console.log("This is error in forget password:", error);
    if (error.message.includes("timeout")) {
      return res.status(500).json({
        success: false,
        message: "Network error, please try again later",
      });
    }
    res.status(500).json({
      success: false,
      message: "error occurs",
    });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const verified = await otpModal.findOne({ email, otp });
    const expiresAt = 10 * 60 * 1000;
    if (!verified || Date.now() > verified.createdAt.getTime() + expiresAt) {
      return res.status(400).json({
        message: "Invalid or Expired OTP",
      });
    } else {
      return res.status(200).json({
        message: "OTP verified.",
      });
    }
  } catch (error) {
    if (error.message.includes("timeout")) {
      return res.status(500).json({
        success: false,
        message: "Network error, please try again later",
      });
    }
    return res.status(500).json({
      success: false,
      message: "error occurs",
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const verified = await otpModal.findOne({ email, otp });

    if (!verified || Date.now > verified.createdAt.getTime() + 600) {
      res.status(400).json({
        message: "Invalid or Expired OTP",
      });
    }

    const user = await userModal.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "user not exists",
      });
    }
    const newHashPassword = await bcrypt.hash(newPassword,12)
    user.password = newHashPassword;
    await user.save();
    await otpModal.deleteMany({ email });
    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error.message.includes("timeout")) {
      res.status(500).json({
        success: false,
        message: "Network error, please try again later",
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong while reseting password, please try again",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  forgetPassword,
  verifyOtp,
  resetPassword,
};
