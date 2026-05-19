const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const menuService = require('./menuService');
const tableService = require('./tableService');
const { ApiError } = require('../utils/apiResponse');

class OrderService {
  async createOrder(data) {
    const { tableId, items, createdBy, specialInstructions } = data;

    // Validate table
    const table = await Table.findById(tableId);
    if (!table) {
      throw new ApiError(404, 'Table not found');
    }

    // Validate and calculate order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        throw new ApiError(404, `Menu item ${item.menuItemId} not found`);
      }

      // Check stock availability
      if (menuItem.stockQuantity < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${menuItem.name}`);
      }

      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        menuItem: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        subtotal: itemSubtotal,
        notes: item.notes || '',
      });

      // Deduct stock immediately
      await menuService.deductStock(item.menuItemId, item.quantity);
    }

    // Calculate tax and total
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const totalAmount = subtotal + tax;

    // Create order
    const order = await Order.create({
      table: tableId,
      items: orderItems,
      subtotal,
      tax,
      totalAmount,
      createdBy,
      specialInstructions,
      startedAt: new Date(),
    });

    // Assign order to table
    await tableService.assignOrderToTable(tableId, order._id);

    return order.populate('table').populate('items.menuItem').populate('createdBy');
  }

  async getOrderById(orderId) {
    const order = await Order.findById(orderId)
      .populate('table')
      .populate('items.menuItem')
      .populate('createdBy');

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return order;
  }

  async getAllOrders(filters = {}) {
    const query = {};

    if (filters.status) {
      query.orderStatus = filters.status;
    }

    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    if (filters.dateRange) {
      query.createdAt = {
        $gte: new Date(filters.dateRange.start),
        $lte: new Date(filters.dateRange.end),
      };
    }

    return await Order.find(query)
      .populate('table')
      .populate('items.menuItem')
      .populate('createdBy')
      .sort({ createdAt: -1 });
  }

  async updateOrderStatus(orderId, newStatus) {
    if (
      !['pending', 'preparing', 'served', 'completed', 'cancelled'].includes(
        newStatus
      )
    ) {
      throw new ApiError(400, 'Invalid order status');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    order.orderStatus = newStatus;

    if (newStatus === 'completed') {
      order.completedAt = new Date();
    }

    if (newStatus === 'cancelled') {
      // Restore stock if order is cancelled
      for (const item of order.items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (menuItem) {
          menuItem.stockQuantity += item.quantity;
          await menuItem.save();
        }
      }
    }

    await order.save();
    return order.populate('table').populate('items.menuItem');
  }

  async updateOrderItemStatus(orderId, itemIndex, status) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (itemIndex >= order.items.length) {
      throw new ApiError(400, 'Invalid item index');
    }

    order.items[itemIndex].status = status;
    await order.save();

    return order.populate('table').populate('items.menuItem');
  }

  async processPayment(orderId, paymentData) {
    const { amount, method } = paymentData;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    order.amountPaid += amount;
    order.paymentMethod = method;

    if (order.amountPaid >= order.totalAmount) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'completed';
      order.completedAt = new Date();

      // Free the table
      await Table.findByIdAndUpdate(order.table, {
        status: 'available',
        currentOrder: null,
      });
    } else if (order.amountPaid > 0) {
      order.paymentStatus = 'partial';
    }

    await order.save();
    return order.populate('table').populate('items.menuItem');
  }

  async addItemToOrder(orderId, itemData) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (
      order.orderStatus === 'completed' ||
      order.orderStatus === 'cancelled'
    ) {
      throw new ApiError(400, 'Cannot add items to a completed or cancelled order');
    }

    const menuItem = await MenuItem.findById(itemData.menuItemId);
    if (!menuItem) {
      throw new ApiError(404, 'Menu item not found');
    }

    // Check stock
    if (menuItem.stockQuantity < itemData.quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }

    // Add item to order
    const itemSubtotal = menuItem.price * itemData.quantity;
    order.items.push({
      menuItem: itemData.menuItemId,
      quantity: itemData.quantity,
      unitPrice: menuItem.price,
      subtotal: itemSubtotal,
      notes: itemData.notes || '',
    });

    // Update totals
    order.subtotal += itemSubtotal;
    order.tax = Math.round(order.subtotal * 0.1 * 100) / 100;
    order.totalAmount = order.subtotal + order.tax;

    // Deduct stock
    await menuService.deductStock(itemData.menuItemId, itemData.quantity);

    await order.save();
    return order.populate('table').populate('items.menuItem');
  }

  async removeItemFromOrder(orderId, itemIndex) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (itemIndex >= order.items.length) {
      throw new ApiError(400, 'Invalid item index');
    }

    const removedItem = order.items[itemIndex];

    // Restore stock
    const menuItem = await MenuItem.findById(removedItem.menuItem);
    if (menuItem) {
      menuItem.stockQuantity += removedItem.quantity;
      await menuItem.save();
    }

    // Remove item
    order.items.splice(itemIndex, 1);

    // Update totals
    order.subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
    order.tax = Math.round(order.subtotal * 0.1 * 100) / 100;
    order.totalAmount = order.subtotal + order.tax;

    await order.save();
    return order.populate('table').populate('items.menuItem');
  }

  async getActiveOrders() {
    return await Order.find({
      orderStatus: { $in: ['pending', 'preparing', 'served'] },
    })
      .populate('table')
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
  }

  async getDailySales(date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      paymentStatus: 'paid',
    });

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      date,
      totalOrders: orders.length,
      totalSales: Math.round(totalSales * 100) / 100,
      orders,
    };
  }
}

module.exports = new OrderService();
