const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User validation
const validateUserRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'staff'])
    .withMessage('Role must be admin or staff'),
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Menu validation
const validateMenuItem = [
  body('name').trim().notEmpty().withMessage('Menu item name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative number'),
];

// Table validation
const validateTable = [
  body('tableNumber').isInt({ gt: 0 }).withMessage('Valid table number is required'),
  body('capacity').isInt({ gt: 0 }).withMessage('Capacity must be greater than 0'),
];

// Reservation validation
const validateReservation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('tableId').isMongoId().withMessage('Valid table ID is required'),
  body('reservationTime').isISO8601().withMessage('Valid reservation time is required'),
  body('guests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
];

// Order validation
const validateOrder = [
  body('tableId').isMongoId().withMessage('Valid table ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItemId').isMongoId().withMessage('Valid menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

module.exports = {
  validateRequest,
  validateUserRegister,
  validateUserLogin,
  validateMenuItem,
  validateTable,
  validateReservation,
  validateOrder,
};
