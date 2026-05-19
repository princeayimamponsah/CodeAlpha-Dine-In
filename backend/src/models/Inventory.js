const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
      unique: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    stockLevel: {
      type: Number,
      default: 0,
      min: 0,
    },
    thresholdLevel: {
      type: Number,
      default: 5,
    },
    unit: {
      type: String,
      default: 'pieces',
    },
    lastRestockDate: Date,
    lastRestockQuantity: Number,
    supplier: String,
    cost: Number,
    notes: String,
  },
  { timestamps: true }
);

// Alert when stock is low
inventorySchema.methods.isLowStock = function () {
  return this.stockLevel <= this.thresholdLevel;
};

module.exports = mongoose.model('Inventory', inventorySchema);
