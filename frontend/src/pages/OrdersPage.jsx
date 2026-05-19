import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Input, Select, EmptyState, SectionHeader } from '../components/UI';
import { orderService, tableService, menuService } from '../services/apiServices';
import { useNotificationStore } from '../context/store';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [newOrder, setNewOrder] = useState({
    tableId: '',
    items: [],
  });
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    fetchOrders();
    fetchTables();
    fetchMenuItems();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.getAllOrders({
        ...(filter !== 'all' && { status: filter }),
      });
      setOrders(data.data);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to fetch orders',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const { data } = await tableService.getAllTables();
      setTables(data.data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data } = await menuService.getAllItems();
      setItems(data.data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.tableId || newOrder.items.length === 0) {
      addNotification({
        type: 'error',
        message: 'Please select a table and add items',
      });
      return;
    }

    try {
      const { data } = await orderService.createOrder(newOrder);
      setOrders([data.data, ...orders]);
      setIsModalOpen(false);
      setNewOrder({ tableId: '', items: [] });
      addNotification({
        type: 'success',
        message: 'Order created successfully',
      });
      fetchOrders();
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create order',
      });
    }
  };

  const addOrderItem = (menuItemId) => {
    const item = items.find((i) => i._id === menuItemId);
    if (item) {
      const existingItem = newOrder.items.find((i) => i.menuItemId === menuItemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        newOrder.items.push({ menuItemId, quantity: 1 });
      }
      setNewOrder({ ...newOrder });
    }
  };

  const statusColors = {
    pending: 'info',
    preparing: 'warning',
    served: 'success',
    completed: 'success',
    cancelled: 'error',
  };

  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Service"
        title="Orders"
        description="A premium operational view of the pass, with filters, statuses, and order creation controls."
        action={<Button onClick={() => setIsModalOpen(true)} variant="primary">
          <Plus size={20} /> Create Order
        </Button>}
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'preparing', 'served', 'completed'].map((status) => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            variant={filter === status ? 'primary' : 'secondary'}
            size="sm"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders"
          description="No orders found for the selected filter"
        />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order._id} variant="primary">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {order.orderNumber}
                    </h3>
                    <Badge text={order.orderStatus} variant={statusColors[order.orderStatus]} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Table</p>
                      <p className="font-semibold">#{order.table?.tableNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Items</p>
                      <p className="font-semibold">{order.items.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Total</p>
                      <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Payment</p>
                      <p className="font-semibold">
                        <Badge text={order.paymentStatus} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewOrder({ tableId: '', items: [] });
        }}
        title="Create New Order"
        size="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Table
            </label>
            <Select
              value={newOrder.tableId}
              onChange={(e) => setNewOrder({ ...newOrder, tableId: e.target.value })}
            >
              <option value="">Choose a table...</option>
              {tables
                .filter((t) => t.status === 'available')
                .map((table) => (
                  <option key={table._id} value={table._id}>
                    Table {table.tableNumber} (Capacity: {table.capacity})
                  </option>
                ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Items
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    onClick={() => addOrderItem(item._id)}
                    variant="primary"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {newOrder.items.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Order Items ({newOrder.items.length})
              </h4>
              <div className="space-y-1 text-sm">
                {newOrder.items.map((orderItem) => {
                  const menuItem = items.find((i) => i._id === orderItem.menuItemId);
                  return (
                    <div key={orderItem.menuItemId} className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>
                        {menuItem?.name} x {orderItem.quantity}
                      </span>
                      <span>${(menuItem?.price * orderItem.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setNewOrder({ tableId: '', items: [] });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Create Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
