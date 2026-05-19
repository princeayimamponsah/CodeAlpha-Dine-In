const menuService = require('../services/menuService');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { ApiResponse } = require('../utils/apiResponse');

exports.createMenuItem = catchAsyncErrors(async (req, res) => {
  const menuItem = await menuService.createMenuItem(req.body);

  res.status(201).json(
    new ApiResponse(201, menuItem, 'Menu item created successfully')
  );
});

exports.getAllMenuItems = catchAsyncErrors(async (req, res) => {
  const { category, search } = req.query;
  const items = await menuService.getAllMenuItems({ category, search });

  res.status(200).json(
    new ApiResponse(200, items, 'Menu items fetched successfully')
  );
});

exports.getMenuItemById = catchAsyncErrors(async (req, res) => {
  const item = await menuService.getMenuItemById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, item, 'Menu item fetched successfully')
  );
});

exports.updateMenuItem = catchAsyncErrors(async (req, res) => {
  const item = await menuService.updateMenuItem(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, item, 'Menu item updated successfully')
  );
});

exports.deleteMenuItem = catchAsyncErrors(async (req, res) => {
  await menuService.deleteMenuItem(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, 'Menu item deleted successfully')
  );
});

exports.getLowStockItems = catchAsyncErrors(async (req, res) => {
  const items = await menuService.getLowStockItems();

  res.status(200).json(
    new ApiResponse(200, items, 'Low stock items fetched successfully')
  );
});

exports.getAvailableItems = catchAsyncErrors(async (req, res) => {
  const items = await menuService.getAvailableItems();

  res.status(200).json(
    new ApiResponse(200, items, 'Available items fetched successfully')
  );
});

exports.updateItemAvailability = catchAsyncErrors(async (req, res) => {
  const { isAvailable } = req.body;
  const item = await menuService.updateItemAvailability(
    req.params.id,
    isAvailable
  );

  res.status(200).json(
    new ApiResponse(200, item, 'Item availability updated successfully')
  );
});
