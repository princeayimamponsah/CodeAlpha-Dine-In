const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { validateOrder, validateRequest } = require('../utils/validators');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', authenticateToken, orderController.getAllOrders);
router.get('/active', authenticateToken, orderController.getActiveOrders);
router.get('/daily-sales', authenticateToken, authorizeRole('admin'), orderController.getDailySales);
router.get('/:id', authenticateToken, orderController.getOrderById);

router.post('/', authenticateToken, validateOrder, validateRequest, orderController.createOrder);
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus);
router.patch('/:id/item-status', authenticateToken, orderController.updateOrderItemStatus);
router.patch('/:id/payment', authenticateToken, orderController.processPayment);
router.patch('/:id/add-item', authenticateToken, orderController.addItemToOrder);
router.patch('/:id/remove-item', authenticateToken, orderController.removeItemFromOrder);

module.exports = router;
