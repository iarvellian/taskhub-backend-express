const { User } = require("../models");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const userRules = require("../utils/validators/userRules");

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
  ...userRules.updateProfile,
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