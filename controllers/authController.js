const { User } = require("../models");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const authRules = require("../utils/validators/authRules");
const { signAccessToken, signRefreshToken } = require("../utils/tokenUtils");

// User registration
exports.register = [
  ...authRules.register,
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Get only the first error per field
      const uniqueErrors = {};
      errors.array().forEach((err) => {
        if (!uniqueErrors[err.path]) {
          uniqueErrors[err.path] = err;
        }
      });

      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: "fail",
          message: "Email already in use",
          error: {
            code: 400,
            details: "The provided email is already registered",
          },
        });
      }

      // Hash the password and create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          user: { id: newUser.id, name: newUser.name, email: newUser.email },
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error creating user",
        error: {
          code: 500,
          details: error.message,
        },
      });
    }
  },
];

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshJwt;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    const decoded = await verifyToken(refreshToken);
    const newAccessToken = await signAccessToken(decoded.id);

    // Set new access token cookie
    res.cookie("jwt", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res
      .status(200)
      .json({ status: "success", message: "Token refreshed successfully" });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// Login with detailed error handling
exports.login = [
  ...authRules.login,
  async (req, res) => {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Get only the first error per field
      const uniqueErrors = {};
      errors.array().forEach((err) => {
        if (!uniqueErrors[err.path]) {
          uniqueErrors[err.path] = err;
        }
      });

      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
        errors: errors.array(),
      });
    }
    
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(404)
          .json({ status: "fail", message: "User not found" });
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        return res
          .status(400)
          .json({ status: "fail", message: "Incorrect password" });
      }

      // Generate tokens
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      // Cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };

      // Set cookies for tokens
      res.cookie("jwt", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000,
      }); // 1 hour
      res.cookie("refreshJwt", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); // 7 days

      res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        data: { user: { id: user.id, name: user.name, email: user.email } },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Login failed",
        error: error.message,
      });
    }
  },
];

// Logout by clearing the JWT token
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("refreshJwt");
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
};