const { Task } = require("../models");
const { validationResult } = require("express-validator");
const taskRules = require("../utils/validators/taskRules");

// Create a new task with input validation
exports.createTask = [
  ...taskRules.createTask,
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
    
    const { name, description, status, priority, project_id, assigned_to, due_date } = req.body;
    
    try {
      const newTask = await Task.create({
        name,
        description,
        status,
        priority,
        project_id,
        assigned_to,
        due_date
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
  const { status, project_id, due_date } = req.query;
  const query = {};

  // Apply filters if provided
  if (status) query.status = status;
  if (project_id) query.project_id = project_id;
  if (due_date) query.due_date = due_date;

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
  ...taskRules.updateTask,
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
      const { taskId } = req.params;

      // Find the task by ID
      const task = await Task.findOne({ where: { id: taskId } });
      if (!task) {
        return res.status(404).json({
          status: "fail",
          message: "Task not found",
        });
      }

      // Update only the provided fields (cleaner logic)
      const { name, description, status, priority, assigned_to, due_date } = req.body;

      if (name) task.name = name;
      if (description) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (assigned_to) task.assigned_to = assigned_to;
      if (due_date) task.due_date = due_date;

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