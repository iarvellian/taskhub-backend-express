const { Project } = require("../models");
const { validationResult } = require("express-validator");
const projectRules = require("../utils/validators/projectRules");

// Create a new project with input validation
exports.createProject = [
  ...projectRules.createProject,
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

    
    const { name, description, status, owner_id, start_date, end_date } = req.body;
    
    try {
      const newProject = await Project.create({
        name,
        description,
        status,
        owner_id,
        start_date,
        end_date
      });

      res.status(201).json({
        status: "success",
        message: "Project created successfully",
        data: newProject,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error creating project",
        error: error.message,
      });
    }
  },
];

// Get all projects (with optional filters like status or dueDate)
exports.getProjects = async (req, res) => {
  const { status, owner_id } = req.query;
  const query = {};

  // Apply filters if provided
  if (status) query.status = status;
  if (owner_id) query.owner_id = owner_id;

  try {
    const projects = await Project.findAll({ where: query });

    res.status(200).json({
      status: "success",
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({ where: { id: projectId } });

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching project",
      error: error.message,
    });
  }
};

// Update an existing project by ID with validation
exports.updateProject = [
  ...projectRules.updateProject,
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
      const { projectId } = req.params;

      // Find the project by ID
      const project = await Project.findOne({ where: { id: projectId } });
      if (!project) {
        return res.status(404).json({
          status: "fail",
          message: "Project not found",
        });
      }

      // Update only the provided fields (cleaner logic)
      const { name, description, status, start_date, end_date } = req.body;

      if (name) project.name = name;
      if (description) project.description = description;
      if (status) project.status = status;
      if (start_date) project.start_date = start_date;
      if (end_date) project.end_date = end_date;

      await project.save();

      res.status(200).json({
        status: "success",
        message: "Project updated successfully",
        data: project,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error updating project",
        error: error.message,
      });
    }
  },
];

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({ where: { id: projectId } });

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }

    await project.destroy();

    res.status(204).json({
      status: "success",
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting project",
      error: error.message,
    });
  }
};