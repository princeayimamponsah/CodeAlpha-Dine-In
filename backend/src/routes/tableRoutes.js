const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { validateTable, validateRequest } = require('../utils/validators');
const tableController = require('../controllers/tableController');

const router = express.Router();

router.get('/', tableController.getAllTables);
router.get('/available', tableController.getAvailableTables);
router.get('/statistics', authenticateToken, authorizeRole('admin'), tableController.getTableStatistics);
router.get('/:id', tableController.getTableById);

router.post('/', authenticateToken, authorizeRole('admin'), validateTable, validateRequest, tableController.createTable);
router.patch('/:id', authenticateToken, authorizeRole('admin'), tableController.updateTable);
router.patch('/:id/status', authenticateToken, tableController.setTableStatus);
router.patch('/:id/free', authenticateToken, tableController.freeTable);
router.delete('/:id', authenticateToken, authorizeRole('admin'), tableController.deleteTable);

module.exports = router;
