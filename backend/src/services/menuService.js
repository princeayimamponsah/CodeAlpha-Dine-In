const MenuItem = require('../models/MenuItem');
const Inventory = require('../models/Inventory');
const { ApiError } = require('../utils/apiResponse');

class MenuService {
  async createMenuItem(data) {
    const menuItem = await MenuItem.create(data);

    // Create inventory entry
    await Inventory.create({
      menuItem: menuItem._id,
      itemName: menuItem.name,
      stockLevel: data.stockQuantity || 0,
      thresholdLevel: data.thresholdLevel || 5,
    });

    return menuItem;
  }

  async getAllMenuItems(filters = {}) {
    const query = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
    return items;
  }

  async getMenuItemById(itemId) {
    const item = await MenuItem.findById(itemId);
    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }
    return item;
  }

  async updateMenuItem(itemId, updateData) {
    const item = await MenuItem.findByIdAndUpdate(itemId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }

    // Update inventory if stock changed
    if (updateData.stockQuantity !== undefined) {
      await Inventory.findOneAndUpdate(
        { menuItem: itemId },
        { stockLevel: updateData.stockQuantity }
      );
    }

    return item;
  }

  async deleteMenuItem(itemId) {
    const item = await MenuItem.findByIdAndDelete(itemId);
    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }

    // Delete inventory
    await Inventory.deleteOne({ menuItem: itemId });

    return item;
  }

  async getAvailableItems() {
    return await MenuItem.find({ isAvailable: true });
  }

  async getLowStockItems() {
    return await MenuItem.find({
      $expr: { $lte: ['$stockQuantity', '$thresholdLevel'] },
    });
  }

  async updateItemAvailability(itemId, isAvailable) {
    const item = await MenuItem.findByIdAndUpdate(
      itemId,
      { isAvailable },
      { new: true }
    );

    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }

    return item;
  }

  async deductStock(itemId, quantity) {
    const item = await MenuItem.findById(itemId);
    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }

    if (item.stockQuantity < quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }

    item.stockQuantity -= quantity;

    // Mark unavailable if stock is low
    if (item.stockQuantity <= item.thresholdLevel) {
      item.isAvailable = false;
    }

    await item.save();

    // Update inventory
    await Inventory.findOneAndUpdate(
      { menuItem: itemId },
      { stockLevel: item.stockQuantity }
    );

    return item;
  }

  async restockItem(itemId, quantity) {
    const item = await MenuItem.findById(itemId);
    if (!item) {
      throw new ApiError(404, 'Menu item not found');
    }

    item.stockQuantity += quantity;
    item.isAvailable = true;
    await item.save();

    // Update inventory
    await Inventory.findOneAndUpdate(
      { menuItem: itemId },
      {
        stockLevel: item.stockQuantity,
        lastRestockDate: new Date(),
        lastRestockQuantity: quantity,
      }
    );

    return item;
  }
}

module.exports = new MenuService();
