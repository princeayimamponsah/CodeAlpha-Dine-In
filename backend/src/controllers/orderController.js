const orderService = require('../services/orderService');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { ApiResponse } = require('../utils/apiResponse');

exports.createOrder = catchAsyncErrors(async (req, res) => {
  const order = await orderService.createOrder({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json(
    new ApiResponse(201, order, 'Order created successfully')
  );
});

exports.getOrderById = catchAsyncErrors(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, order, 'Order fetched successfully')
  );
});

exports.getAllOrders = catchAsyncErrors(async (req, res) => {
  const { status, paymentStatus, startDate, endDate } = req.query;
  const filters = {};

  if (status) {
    filters.status = status;
  }

  if (paymentStatus) {
    filters.paymentStatus = paymentStatus;
  }

  if (startDate && endDate) {
    filters.dateRange = { start: startDate, end: endDate };
  }

  const orders = await orderService.getAllOrders(filters);

  res.status(200).json(
    new ApiResponse(200, orders, 'Orders fetched successfully')
  );
});

exports.updateOrderStatus = catchAsyncErrors(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, status);

  res.status(200).json(
    new ApiResponse(200, order, 'Order status updated successfully')
  );
});

exports.updateOrderItemStatus = catchAsyncErrors(async (req, res) => {
  const { itemIndex, status } = req.body;
  const order = await orderService.updateOrderItemStatus(
    req.params.id,
    itemIndex,
    status
  );

  res.status(200).json(
    new ApiResponse(200, order, 'Order item status updated successfully')
  );
});

exports.processPayment = catchAsyncErrors(async (req, res) => {
  const order = await orderService.processPayment(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, order, 'Payment processed successfully')
  );
});

exports.addItemToOrder = catchAsyncErrors(async (req, res) => {
  const order = await orderService.addItemToOrder(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, order, 'Item added to order successfully')
  );
});

exports.removeItemFromOrder = catchAsyncErrors(async (req, res) => {
  const { itemIndex } = req.body;
  const order = await orderService.removeItemFromOrder(req.params.id, itemIndex);

  res.status(200).json(
    new ApiResponse(200, order, 'Item removed from order successfully')
  );
});

exports.getActiveOrders = catchAsyncErrors(async (req, res) => {
  const orders = await orderService.getActiveOrders();

  res.status(200).json(
    new ApiResponse(200, orders, 'Active orders fetched successfully')
  );
});

exports.getDailySales = catchAsyncErrors(async (req, res) => {
  const { date } = req.query;
  const salesData = await orderService.getDailySales(date || new Date());

  res.status(200).json(
    new ApiResponse(200, salesData, 'Daily sales fetched successfully')
  );
});
