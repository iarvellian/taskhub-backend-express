const { Team } = require("../models");
const { validationResult } = require("express-validator");
const teamRules = require("../utils/validators/teamRules");

// Create a new team with input validation
exports.createTeam = [
  ...teamRules.createTeam,
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
    
    const { name, created_by } = req.body;
    
    try {
      const newTeam = await Team.create({
        name,
        created_by
      });

      res.status(201).json({
        status: "success",
        message: "Team created successfully",
        data: newTeam,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error creating team",
        error: error.message,
      });
    }
  },
];

// Get all teams (with optional filters like status or dueDate)
exports.getTeams = async (req, res) => {
  const { created_by } = req.query;
  const query = {};

  // Apply filters if provided
  if (created_by) query.created_by = created_by;

  try {
    const teams = await Team.findAll({ where: query });

    res.status(200).json({
      status: "success",
      message: "Teams retrieved successfully",
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching teams",
      error: error.message,
    });
  }
};

// Get a single team by ID
exports.getTeamById = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findOne({ where: { id: teamId } });

    if (!team) {
      return res.status(404).json({
        status: "fail",
        message: "Team not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Team retrieved successfully",
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching team",
      error: error.message,
    });
  }
};

// Update an existing team by ID with validation
exports.updateTeam = [
  ...teamRules.updateTeam,
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
      const { teamId } = req.params;

      // Find the team by ID
      const team = await Team.findOne({ where: { id: teamId } });
      if (!team) {
        return res.status(404).json({
          status: "fail",
          message: "Team not found",
        });
      }

      // Update only the provided fields (cleaner logic)
      const { name } = req.body;

      if (name) team.name = name;

      await team.save();

      res.status(200).json({
        status: "success",
        message: "Team updated successfully",
        data: team,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error updating team",
        error: error.message,
      });
    }
  },
];

// Delete a team by ID
exports.deleteTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findOne({ where: { id: teamId } });

    if (!team) {
      return res.status(404).json({
        status: "fail",
        message: "Team not found",
      });
    }

    await team.destroy();

    res.status(204).json({
      status: "success",
      message: "Team deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting team",
      error: error.message,
    });
  }
};