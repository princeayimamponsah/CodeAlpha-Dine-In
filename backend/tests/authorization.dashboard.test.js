const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/controllers/orderController', () => ({
  getDailySales: (req, res) => res.status(200).json({ success: true, data: { totalSales: 100 } }),
  getAllOrders: (req, res) => res.status(200).json({ success: true, data: [] }),
  getActiveOrders: (req, res) => res.status(200).json({ success: true, data: [] }),
  getOrderById: (req, res) => res.status(200).json({ success: true, data: {} }),
  createOrder: (req, res) => res.status(201).json({ success: true }),
  updateOrderStatus: (req, res) => res.status(200).json({ success: true }),
  updateOrderItemStatus: (req, res) => res.status(200).json({ success: true }),
  processPayment: (req, res) => res.status(200).json({ success: true }),
  addItemToOrder: (req, res) => res.status(200).json({ success: true }),
  removeItemFromOrder: (req, res) => res.status(200).json({ success: true }),
}));

jest.mock('../src/controllers/inventoryController', () => ({
  getFullInventory: (req, res) => res.status(200).json({ success: true, data: [] }),
  getLowStockItems: (req, res) => res.status(200).json({ success: true, data: [] }),
  getInventoryStatus: (req, res) => res.status(200).json({ success: true, data: {} }),
  getInventoryItem: (req, res) => res.status(200).json({ success: true, data: {} }),
  updateInventory: (req, res) => res.status(200).json({ success: true }),
  restockItem: (req, res) => res.status(200).json({ success: true }),
  deductStock: (req, res) => res.status(200).json({ success: true }),
}));

const orderRoutes = require('../src/routes/orderRoutes');
const inventoryRoutes = require('../src/routes/inventoryRoutes');

describe('Dashboard Authorization', () => {
  let app;

  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/orders', orderRoutes);
    app.use('/api/inventory', inventoryRoutes);
  });

  const makeToken = (role) =>
    jwt.sign({ id: '507f1f77bcf86cd799439011', role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

  test('staff user gets 403 on admin-only daily-sales endpoint', async () => {
    const staffToken = makeToken('staff');

    const response = await request(app)
      .get('/api/orders/daily-sales?date=2026-05-19')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test('admin user gets 200 on daily-sales endpoint', async () => {
    const adminToken = makeToken('admin');

    const response = await request(app)
      .get('/api/orders/daily-sales?date=2026-05-19')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('staff user gets 403 on admin-only inventory low-stock endpoint', async () => {
    const staffToken = makeToken('staff');

    const response = await request(app)
      .get('/api/inventory/low-stock')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test('admin user gets 200 on inventory low-stock endpoint', async () => {
    const adminToken = makeToken('admin');

    const response = await request(app)
      .get('/api/inventory/low-stock')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
