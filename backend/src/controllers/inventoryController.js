const inventoryService = require('../services/inventoryService');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { ApiResponse } = require('../utils/apiResponse');

exports.getFullInventory = catchAsyncErrors(async (req, res) => {
  const inventory = await inventoryService.getFullInventory();

  res.status(200).json(
    new ApiResponse(200, inventory, 'Inventory fetched successfully')
  );
});

exports.getInventoryItem = catchAsyncErrors(async (req, res) => {
  const item = await inventoryService.getInventoryItem(req.params.id);

  res.status(200).json(
    new ApiResponse(200, item, 'Inventory item fetched successfully')
  );
});

exports.getLowStockItems = catchAsyncErrors(async (req, res) => {
  const items = await inventoryService.getLowStockItems();

  res.status(200).json(
    new ApiResponse(200, items, 'Low stock items fetched successfully')
  );
});

exports.updateInventory = catchAsyncErrors(async (req, res) => {
  const item = await inventoryService.updateInventory(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, item, 'Inventory updated successfully')
  );
});

exports.getInventoryStatus = catchAsyncErrors(async (req, res) => {
  const status = await inventoryService.getInventoryStatus();

  res.status(200).json(
    new ApiResponse(200, status, 'Inventory status fetched successfully')
  );
});

exports.restockItem = catchAsyncErrors(async (req, res) => {
  const { quantity, supplier, cost } = req.body;
  const item = await inventoryService.restockItem(
    req.params.id,
    quantity,
    supplier,
    cost
  );

  res.status(200).json(
    new ApiResponse(200, item, 'Item restocked successfully')
  );
});

exports.deductStock = catchAsyncErrors(async (req, res) => {
  const { quantity } = req.body;
  const item = await inventoryService.deductStock(req.params.id, quantity);

  res.status(200).json(
    new ApiResponse(200, item, 'Stock deducted successfully')
  );
});
