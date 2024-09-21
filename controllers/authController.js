const { User } = require("../models");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const { signAccessToken, signRefreshToken } = require("../utils/tokenUtils");
const multer = require("multer");
const path = require("path");

// Password validation function (at least 8 characters, one symbol, and one number)
const validatePassword = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return regex.test(password);
};

// Configure multer for file uploads (profile pictures)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_pictures/"); // Set your destination folder for profile pictures
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure the uploaded file has a unique name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
    }
  },
}).single("profile_picture");

// User registration
exports.register = [
  // Input validation middleware
  check("name", "Name is required").notEmpty(),
  check("email", "Email is required").notEmpty(),
  check("password", "Password is required").notEmpty(),

  check("email", "Invalid email format")
    .if((value, { req }) => req.body.email)
    .isEmail(),
  check(
    "password",
    "Password must be at least 8 characters and contain at least one symbol and one number"
  )
    .if((value, { req }) => req.body.password)
    .custom(validatePassword),

  async (req, res) => {
    const { name, email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
        errors: errors.array(),
      });
    }

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
  // Input validation middleware
  check("email", "Email is required").notEmpty(),
  check("password", "Password is required").notEmpty(),

  async (req, res) => {
    const { email, password } = req.body;

    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid input data",
        errors: errors.array(),
      });
    }

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

// Get user profile with JWT verification
exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
        error: {
          code: 404,
          details: "No user with the provided ID exists",
        },
      });
    }

    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching user profile",
      error: {
        code: 500,
        details: error.message,
      },
    });
  }
};

// Update user profile
exports.updateProfile = [
  // Validation middleware
  check("name", "Name is required").optional().notEmpty(),
  check("email", "Invalid email format").optional().isEmail(),
  check(
    "password",
    "Password must be at least 8 characters and contain at least one symbol and one number"
  )
    .optional()
    .custom((value) => {
      if (!value) return true; // Skip validation if no password is provided
      const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
      return regex.test(value);
    }),

  (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: "fail",
          message: err.message || "File upload failed",
        });
      }

      const { name, email, password } = req.body;
      const userId = req.user.id;

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid input data",
          errors: errors.array(),
        });
      }

      try {
        // Find user by ID
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({
            status: "fail",
            message: "User not found",
            error: {
              code: 404,
              details: "No user with the provided ID exists",
            },
          });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }

        // Handle profile picture upload
        if (req.file) {
          user.profile_picture = `/uploads/profile_pictures/${req.file.filename}`; // Save file path in DB
        }

        // Save updated user details
        await user.save();

        res.status(200).json({
          status: "success",
          message: "Profile updated successfully",
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              profile_picture: user.profile_picture,
            },
          },
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Error updating profile",
          error: {
            code: 500,
            details: error.message,
          },
        });
      }
    });
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