const Table = require('../models/Table');
const { ApiError } = require('../utils/apiResponse');

class TableService {
  async createTable(data) {
    const existingTable = await Table.findOne({ tableNumber: data.tableNumber });
    if (existingTable) {
      throw new ApiError(400, 'Table number already exists');
    }

    return await Table.create(data);
  }

  async getAllTables() {
    return await Table.find({ isActive: true })
      .populate('currentOrder')
      .populate('currentReservation');
  }

  async getTableById(tableId) {
    const table = await Table.findById(tableId)
      .populate('currentOrder')
      .populate('currentReservation');

    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    return table;
  }

  async updateTable(tableId, updateData) {
    const table = await Table.findByIdAndUpdate(tableId, updateData, {
      new: true,
      runValidators: true,
    }).populate('currentOrder').populate('currentReservation');

    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    return table;
  }

  async setTableStatus(tableId, status) {
    if (!['available', 'reserved', 'occupied'].includes(status)) {
      throw new ApiError(400, 'Invalid table status');
    }

    return await Table.findByIdAndUpdate(tableId, { status }, { new: true });
  }

  async assignOrderToTable(tableId, orderId) {
    const table = await Table.findByIdAndUpdate(
      tableId,
      { currentOrder: orderId, status: 'occupied' },
      { new: true }
    );

    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    return table;
  }

  async freeTable(tableId) {
    return await Table.findByIdAndUpdate(
      tableId,
      {
        status: 'available',
        currentOrder: null,
        currentReservation: null,
      },
      { new: true }
    );
  }

  async getAvailableTables() {
    return await Table.find({ status: 'available', isActive: true });
  }

  async getAvailableTablesForCapacity(guests, reservationTime = null) {
    const tables = await Table.find({
      capacity: { $gte: guests },
      status: 'available',
      isActive: true,
    });

    return tables;
  }

  async deleteTable(tableId) {
    const table = await Table.findByIdAndUpdate(
      tableId,
      { isActive: false },
      { new: true }
    );

    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    return table;
  }

  async getTableStatistics() {
    const tables = await Table.find({ isActive: true });
    const totalTables = tables.length;
    const availableTables = tables.filter((t) => t.status === 'available').length;
    const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
    const reservedTables = tables.filter((t) => t.status === 'reserved').length;

    return {
      total: totalTables,
      available: availableTables,
      occupied: occupiedTables,
      reserved: reservedTables,
    };
  }
}

module.exports = new TableService();
