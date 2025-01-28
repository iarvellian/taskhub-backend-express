const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middleware/authenticateToken');

// Define route
router.post('/', authenticateToken, projectController.createProject);
router.get('/', authenticateToken, projectController.getProjects);
router.get('/:projectId', authenticateToken, projectController.getProjectById);
router.put('/:projectId', authenticateToken, projectController.updateProject);
router.delete('/:projectId', authenticateToken, projectController.deleteProject);

module.exports = router;