const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const {
  validateMenuItem,
  validateRequest,
} = require('../utils/validators');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.getAllMenuItems);
router.get('/available', menuController.getAvailableItems);
router.get('/low-stock', authenticateToken, authorizeRole('admin'), menuController.getLowStockItems);
router.get('/:id', menuController.getMenuItemById);

router.post('/', authenticateToken, authorizeRole('admin'), validateMenuItem, validateRequest, menuController.createMenuItem);
router.patch('/:id', authenticateToken, authorizeRole('admin'), menuController.updateMenuItem);
router.patch('/:id/availability', authenticateToken, authorizeRole('admin'), menuController.updateItemAvailability);
router.delete('/:id', authenticateToken, authorizeRole('admin'), menuController.deleteMenuItem);

module.exports = router;
