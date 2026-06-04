import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set((state) => ({ ...state, user }));
  },
  loadAuthFromStorage: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        set({ token, user: JSON.parse(user), isAuthenticated: true });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
}));

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, notification.duration || 3000);
  },
}));

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) => (o._id === id ? { ...o, ...updates } : o)),
      currentOrder:
        state.currentOrder?._id === id
          ? { ...state.currentOrder, ...updates }
          : state.currentOrder,
    })),
}));

export const useMenuStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item._id === id ? { ...item, ...updates } : item
      ),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item._id !== id),
    })),
}));

export const useCartStore = create((set) => ({
  items: [],
  tableId: '',
  specialNotes: '',
  
  addToCart: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  
  removeFromCart: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== itemId),
    })),
  
  updateQuantity: (itemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i._id !== itemId) };
      }
      return {
        items: state.items.map((i) =>
          i._id === itemId ? { ...i, quantity } : i
        ),
      };
    }),
  
  setTableId: (tableId) => set({ tableId }),
  setSpecialNotes: (notes) => set({ specialNotes: notes }),
  
  clearCart: () => set({ items: [], tableId: '', specialNotes: '' }),
  
  getTotal: () => {
    // This is a helper that needs to be called with state
    return 0;
  },
}));
