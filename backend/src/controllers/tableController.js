const tableService = require('../services/tableService');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { ApiResponse } = require('../utils/apiResponse');

exports.createTable = catchAsyncErrors(async (req, res) => {
  const table = await tableService.createTable(req.body);

  res.status(201).json(
    new ApiResponse(201, table, 'Table created successfully')
  );
});

exports.getAllTables = catchAsyncErrors(async (req, res) => {
  const tables = await tableService.getAllTables();

  res.status(200).json(
    new ApiResponse(200, tables, 'Tables fetched successfully')
  );
});

exports.getTableById = catchAsyncErrors(async (req, res) => {
  const table = await tableService.getTableById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, table, 'Table fetched successfully')
  );
});

exports.updateTable = catchAsyncErrors(async (req, res) => {
  const table = await tableService.updateTable(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, table, 'Table updated successfully')
  );
});

exports.setTableStatus = catchAsyncErrors(async (req, res) => {
  const { status } = req.body;
  const table = await tableService.setTableStatus(req.params.id, status);

  res.status(200).json(
    new ApiResponse(200, table, 'Table status updated successfully')
  );
});

exports.getAvailableTables = catchAsyncErrors(async (req, res) => {
  const { guests } = req.query;
  let tables;

  if (guests) {
    tables = await tableService.getAvailableTablesForCapacity(parseInt(guests));
  } else {
    tables = await tableService.getAvailableTables();
  }

  res.status(200).json(
    new ApiResponse(200, tables, 'Available tables fetched successfully')
  );
});

exports.freeTable = catchAsyncErrors(async (req, res) => {
  const table = await tableService.freeTable(req.params.id);

  res.status(200).json(
    new ApiResponse(200, table, 'Table freed successfully')
  );
});

exports.deleteTable = catchAsyncErrors(async (req, res) => {
  await tableService.deleteTable(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, 'Table deleted successfully')
  );
});

exports.getTableStatistics = catchAsyncErrors(async (req, res) => {
  const stats = await tableService.getTableStatistics();

  res.status(200).json(
    new ApiResponse(200, stats, 'Table statistics fetched successfully')
  );
});
