const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { validateReservation, validateRequest } = require('../utils/validators');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

router.get('/', authenticateToken, reservationController.getAllReservations);
router.get('/upcoming', authenticateToken, reservationController.getUpcomingReservations);
router.get('/:id', authenticateToken, reservationController.getReservationById);

router.post('/', validateReservation, validateRequest, reservationController.createReservation);
router.patch('/:id', authenticateToken, reservationController.updateReservation);
router.patch('/:id/confirm', authenticateToken, authorizeRole('admin', 'staff'), reservationController.confirmReservation);
router.patch('/:id/complete', authenticateToken, authorizeRole('admin', 'staff'), reservationController.completeReservation);
router.patch('/:id/cancel', authenticateToken, reservationController.cancelReservation);
router.delete('/:id', authenticateToken, authorizeRole('admin'), reservationController.deleteReservation);

module.exports = router;
