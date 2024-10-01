const { Task } = require("../models");
const { check, validationResult } = require("express-validator");

// Create a new task with input validation
exports.createTask = [
  // Input validation
  check("name", "Name is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
  check("due_date", "Invalid due date").optional().isISO8601(),
  check("status", "Status is required").notEmpty(),
  check("priority", "Priority is required").notEmpty(),
  check("project_id", "Project ID is required").notEmpty(),
  check("assigned_to", "Assigned to user is required").notEmpty(),

  async (req, res) => {
    const { name, description, due_date, status, priority, project_id, assigned_to } = req.body;

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
      const newTask = await Task.create({
        name,
        description,
        due_date,
        status,
        priority,
        project_id,
        assigned_to
      });

      res.status(201).json({
        status: "success",
        message: "Task created successfully",
        data: newTask,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error creating task",
        error: error.message,
      });
    }
  },
];

// Get all tasks (with optional filters like status or dueDate)
exports.getTasks = async (req, res) => {
  const { status, due_date, project_id } = req.query;
  const query = {};

  // Apply filters if provided
  if (status) query.status = status;
  if (due_date) query.due_date = due_date;
  if (project_id) query.project_id = project_id;

  try {
    const tasks = await Task.findAll({ where: query });

    res.status(200).json({
      status: "success",
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching task",
      error: error.message,
    });
  }
};

// Update an existing task by ID with validation
exports.updateTask = [
  // Validation checks
  check("name").optional().notEmpty().withMessage("Name cannot be empty"),
  check("description").optional().notEmpty().withMessage("Description cannot be empty"),
  check("due_date").optional().isISO8601().withMessage("Invalid due date"),
  check("status").optional().notEmpty().withMessage("Status cannot be empty"),
  check("priority").optional().notEmpty().withMessage("Priority cannot be empty"),
  check("assigned_to").optional().notEmpty().withMessage("Assigned user cannot be empty"),

  async (req, res) => {
    const { taskId } = req.params;

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
      // Find the task by ID
      const task = await Task.findOne({ where: { id: taskId } });
      if (!task) {
        return res.status(404).json({
          status: "fail",
          message: "Task not found",
        });
      }

      // Update only the provided fields (cleaner logic)
      const { name, description, due_date, status, priority, assigned_to } = req.body;

      if (name) task.name = name;
      if (description) task.description = description;
      if (due_date) task.due_date = due_date;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (assigned_to) task.assigned_to = assigned_to;

      await task.save();

      res.status(200).json({
        status: "success",
        message: "Task updated successfully",
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error updating task",
        error: error.message,
      });
    }
  },
];

// Delete a task by ID
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    await task.destroy();

    res.status(204).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting task",
      error: error.message,
    });
  }
};