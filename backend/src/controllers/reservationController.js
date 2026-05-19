const reservationService = require('../services/reservationService');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { ApiResponse } = require('../utils/apiResponse');

exports.createReservation = catchAsyncErrors(async (req, res) => {
  const reservation = await reservationService.createReservation({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json(
    new ApiResponse(201, reservation, 'Reservation created successfully')
  );
});

exports.getAllReservations = catchAsyncErrors(async (req, res) => {
  const { status, startDate, endDate } = req.query;
  const filters = {};

  if (status) {
    filters.status = status;
  }

  if (startDate && endDate) {
    filters.dateRange = { start: startDate, end: endDate };
  }

  const reservations = await reservationService.getAllReservations(filters);

  res.status(200).json(
    new ApiResponse(200, reservations, 'Reservations fetched successfully')
  );
});

exports.getReservationById = catchAsyncErrors(async (req, res) => {
  const reservation = await reservationService.getReservationById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, reservation, 'Reservation fetched successfully')
  );
});

exports.updateReservation = catchAsyncErrors(async (req, res) => {
  const reservation = await reservationService.updateReservation(
    req.params.id,
    req.body
  );

  res.status(200).json(
    new ApiResponse(200, reservation, 'Reservation updated successfully')
  );
});

exports.confirmReservation = catchAsyncErrors(async (req, res) => {
  const reservation = await reservationService.confirmReservation(req.params.id);

  res.status(200).json(
    new ApiResponse(200, reservation, 'Reservation confirmed successfully')
  );
});

exports.completeReservation = catchAsyncErrors(async (req, res) => {
  const reservation = await reservationService.completeReservation(req.params.id);

  res.status(200).json(
    new ApiResponse(200, reservation, 'Reservation completed successfully')
  );
});

exports.cancelReservation = catchAsyncErrors(async (req, res) => {
  const reservation = await reservationService.cancelReservation(req.params.id);

  res.status(200).json(
    new ApiResponse(200, reservation, 'Reservation cancelled successfully')
  );
});

exports.deleteReservation = catchAsyncErrors(async (req, res) => {
  await reservationService.deleteReservation(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, 'Reservation deleted successfully')
  );
});

exports.getUpcomingReservations = catchAsyncErrors(async (req, res) => {
  const reservations = await reservationService.getUpcomingReservations();

  res.status(200).json(
    new ApiResponse(200, reservations, 'Upcoming reservations fetched successfully')
  );
});
