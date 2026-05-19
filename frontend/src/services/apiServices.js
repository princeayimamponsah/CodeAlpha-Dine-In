import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  getAllUsers: () => api.get('/auth/users'),
};

export const menuService = {
  getAllItems: (params) => api.get('/menu', { params }),
  getItemById: (id) => api.get(`/menu/${id}`),
  createItem: (data) => api.post('/menu', data),
  updateItem: (id, data) => api.patch(`/menu/${id}`, data),
  deleteItem: (id) => api.delete(`/menu/${id}`),
  getLowStockItems: () => api.get('/menu/low-stock'),
  getAvailableItems: () => api.get('/menu/available'),
};

export const tableService = {
  getAllTables: () => api.get('/tables'),
  getTableById: (id) => api.get(`/tables/${id}`),
  createTable: (data) => api.post('/tables', data),
  updateTable: (id, data) => api.patch(`/tables/${id}`, data),
  setTableStatus: (id, status) => api.patch(`/tables/${id}/status`, { status }),
  getAvailableTables: (guests) => api.get('/tables/available', { params: { guests } }),
  freeTable: (id) => api.patch(`/tables/${id}/free`),
  deleteTable: (id) => api.delete(`/tables/${id}`),
  getTableStatistics: () => api.get('/tables/statistics'),
};

export const reservationService = {
  createReservation: (data) => api.post('/reservations', data),
  getAllReservations: (params) => api.get('/reservations', { params }),
  getReservationById: (id) => api.get(`/reservations/${id}`),
  updateReservation: (id, data) => api.patch(`/reservations/${id}`, data),
  confirmReservation: (id) => api.patch(`/reservations/${id}/confirm`),
  completeReservation: (id) => api.patch(`/reservations/${id}/complete`),
  cancelReservation: (id) => api.patch(`/reservations/${id}/cancel`),
  deleteReservation: (id) => api.delete(`/reservations/${id}`),
  getUpcomingReservations: () => api.get('/reservations/upcoming'),
};

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getAllOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  updateOrderItemStatus: (id, itemIndex, status) => 
    api.patch(`/orders/${id}/item-status`, { itemIndex, status }),
  processPayment: (id, data) => api.patch(`/orders/${id}/payment`, data),
  addItemToOrder: (id, data) => api.patch(`/orders/${id}/add-item`, data),
  removeItemFromOrder: (id, itemIndex) => 
    api.patch(`/orders/${id}/remove-item`, { itemIndex }),
  getActiveOrders: () => api.get('/orders/active'),
  getDailySales: (date) => api.get('/orders/daily-sales', { params: { date } }),
};

export const inventoryService = {
  getFullInventory: () => api.get('/inventory'),
  getInventoryItem: (id) => api.get(`/inventory/${id}`),
  getLowStockItems: () => api.get('/inventory/low-stock'),
  getInventoryStatus: () => api.get('/inventory/status'),
  updateInventory: (id, data) => api.patch(`/inventory/${id}`, data),
  restockItem: (id, data) => api.patch(`/inventory/${id}/restock`, data),
  deductStock: (id, data) => api.patch(`/inventory/${id}/deduct`, data),
};
