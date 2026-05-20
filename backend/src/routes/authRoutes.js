const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const {
  validateUserRegister,
  validateUserLogin,
  validateRequest,
} = require('../utils/validators');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', validateUserRegister, validateRequest, authController.register);
router.post('/login', validateUserLogin, validateRequest, authController.login);
router.get('/me', authenticateToken, authController.getProfile);
router.get('/profile', authenticateToken, authController.getProfile);
router.patch('/profile', authenticateToken, authController.updateProfile);
router.get('/users', authenticateToken, authorizeRole('admin'), authController.getAllUsers);
router.patch('/users/:id/role', authenticateToken, authorizeRole('admin'), authController.updateUserRole);

module.exports = router;
