const express = require('express');
const router = express.Router();
const teammemberController = require('../controllers/teammemberController');
const authenticateToken = require('../middleware/authenticateToken');

// Define route
router.post('/', authenticateToken, teammemberController.createTeammember);
router.get('/', authenticateToken, teammemberController.getTeammembers);
router.get('/:teammemberId', authenticateToken, teammemberController.getTeammemberById);
router.put('/:teammemberId', authenticateToken, teammemberController.updateTeammember);
router.delete('/:teammemberId', authenticateToken, teammemberController.deleteTeammember);

module.exports = router;