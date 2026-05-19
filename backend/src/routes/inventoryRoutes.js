const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.get('/', authenticateToken, authorizeRole('admin'), inventoryController.getFullInventory);
router.get('/low-stock', authenticateToken, authorizeRole('admin'), inventoryController.getLowStockItems);
router.get('/status', authenticateToken, authorizeRole('admin'), inventoryController.getInventoryStatus);
router.get('/:id', authenticateToken, authorizeRole('admin'), inventoryController.getInventoryItem);

router.patch('/:id', authenticateToken, authorizeRole('admin'), inventoryController.updateInventory);
router.patch('/:id/restock', authenticateToken, authorizeRole('admin'), inventoryController.restockItem);
router.patch('/:id/deduct', authenticateToken, authorizeRole('admin'), inventoryController.deductStock);

module.exports = router;
