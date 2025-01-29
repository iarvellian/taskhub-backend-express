const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authenticateToken = require('../middleware/authenticateToken');

// Define route
router.post('/', authenticateToken, teamController.createTeam);
router.get('/', authenticateToken, teamController.getTeams);
router.get('/:teamId', authenticateToken, teamController.getTeamById);
router.put('/:teamId', authenticateToken, teamController.updateTeam);
router.delete('/:teamId', authenticateToken, teamController.deleteTeam);

module.exports = router;