const Inventory = require('../models/Inventory');
const MenuItem = require('../models/MenuItem');
const { ApiError } = require('../utils/apiResponse');

class InventoryService {
  async getFullInventory() {
    return await Inventory.find().populate('menuItem');
  }

  async getInventoryItem(inventoryId) {
    const item = await Inventory.findById(inventoryId).populate('menuItem');

    if (!item) {
      throw new ApiError(404, 'Inventory item not found');
    }

    return item;
  }

  async getLowStockItems() {
    return await Inventory.find({
      $expr: { $lte: ['$stockLevel', '$thresholdLevel'] },
    })
      .populate('menuItem')
      .sort({ stockLevel: 1 });
  }

  async updateInventory(inventoryId, updateData) {
    const inventory = await Inventory.findByIdAndUpdate(
      inventoryId,
      updateData,
      { new: true, runValidators: true }
    ).populate('menuItem');

    if (!inventory) {
      throw new ApiError(404, 'Inventory item not found');
    }

    // Update menu item stock as well
    if (updateData.stockLevel !== undefined) {
      await MenuItem.findByIdAndUpdate(
        inventory.menuItem._id,
        { stockQuantity: updateData.stockLevel }
      );
    }

    return inventory;
  }

  async getInventoryStatus() {
    const allItems = await Inventory.find();
    const lowStockItems = await this.getLowStockItems();

    const totalValue = allItems.reduce((sum, item) => {
      return sum + (item.cost ? item.cost * item.stockLevel : 0);
    }, 0);

    const averageStockLevel =
      allItems.length > 0
        ? allItems.reduce((sum, item) => sum + item.stockLevel, 0) /
          allItems.length
        : 0;

    return {
      totalItems: allItems.length,
      lowStockCount: lowStockItems.length,
      totalInventoryValue: Math.round(totalValue * 100) / 100,
      averageStockLevel: Math.round(averageStockLevel * 100) / 100,
      lowStockItems,
    };
  }

  async restockItem(inventoryId, quantity, supplier, cost) {
    const inventory = await Inventory.findById(inventoryId);

    if (!inventory) {
      throw new ApiError(404, 'Inventory item not found');
    }

    inventory.stockLevel += quantity;
    inventory.lastRestockDate = new Date();
    inventory.lastRestockQuantity = quantity;
    inventory.supplier = supplier;
    if (cost) {
      inventory.cost = cost;
    }

    await inventory.save();

    // Update menu item
    const menuItem = await MenuItem.findById(inventory.menuItem);
    if (menuItem) {
      menuItem.stockQuantity += quantity;
      menuItem.isAvailable = true;
      await menuItem.save();
    }

    return inventory.populate('menuItem');
  }

  async deductStock(inventoryId, quantity) {
    const inventory = await Inventory.findById(inventoryId);

    if (!inventory) {
      throw new ApiError(404, 'Inventory item not found');
    }

    if (inventory.stockLevel < quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }

    inventory.stockLevel -= quantity;
    await inventory.save();

    return inventory.populate('menuItem');
  }
}

module.exports = new InventoryService();
