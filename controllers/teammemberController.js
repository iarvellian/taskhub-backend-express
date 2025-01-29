const { Teammember } = require("../models");
const { validationResult } = require("express-validator");
const teammemberRules = require("../utils/validators/teammemberRules");

// Create a new team member with input validation
exports.createTeammember = [
  ...teammemberRules.createTeammember,
  async (req, res) => {
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
    
    const { team_id, user_id, role_in_team } = req.body;
    
    try {
      const newTeammember = await Teammember.create({
        team_id,
        user_id,
        role_in_team,
      });

      res.status(201).json({
        status: "success",
        message: "Team member created successfully",
        data: newTeammember,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error creating team member",
        error: error.message,
      });
    }
  },
];

// Get all team members (with optional filters like status or dueDate)
exports.getTeammembers = async (req, res) => {
  const { team_id, user_id } = req.query;
  const query = {};

  // Apply filters if provided
  if (team_id) query.team_id = team_id;
  if (user_id) query.user_id = user_id;

  try {
    const teammembers = await Teammember.findAll({ where: query });

    res.status(200).json({
      status: "success",
      message: "Team members retrieved successfully",
      data: teammembers,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching team members",
      error: error.message,
    });
  }
};

// Get a single team member by ID
exports.getTeammemberById = async (req, res) => {
  const { teammemberId } = req.params;

  try {
    const teammember = await Teammember.findOne({ where: { id: teammemberId } });

    if (!teammember) {
      return res.status(404).json({
        status: "fail",
        message: "Team member not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Team member retrieved successfully",
      data: teammember,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching team member",
      error: error.message,
    });
  }
};

// Update an existing team member by ID with validation
exports.updateTeammember = [
  ...teammemberRules.updateTeammember,
  async (req, res) => {
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
      const { teammemberId } = req.params;

      // Find the team member by ID
      const teammember = await Teammember.findOne({ where: { id: teammemberId } });
      if (!teammember) {
        return res.status(404).json({
          status: "fail",
          message: "Team member not found",
        });
      }

      // Update only the provided fields (cleaner logic)
      const { role_in_team } = req.body;

      if (role_in_team) teammember.role_in_team = role_in_team;

      await teammember.save();

      res.status(200).json({
        status: "success",
        message: "Team member updated successfully",
        data: teammember,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error updating team member",
        error: error.message,
      });
    }
  },
];

// Delete a team member by ID
exports.deleteTeammember = async (req, res) => {
  const { teammemberId } = req.params;

  try {
    const teammember = await Teammember.findOne({ where: { id: teammemberId } });

    if (!teammember) {
      return res.status(404).json({
        status: "fail",
        message: "Team member not found",
      });
    }

    await teammember.destroy();

    res.status(204).json({
      status: "success",
      message: "Team member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting team member",
      error: error.message,
    });
  }
};