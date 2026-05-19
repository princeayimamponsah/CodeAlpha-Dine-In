import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Input, EmptyState, SectionHeader } from '../components/UI';
import { inventoryService } from '../services/apiServices';
import { useNotificationStore } from '../context/store';
import { AlertTriangle, Package } from 'lucide-react';

export const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockData, setRestockData] = useState({
    quantity: '',
    supplier: '',
    cost: '',
  });
  const [status, setStatus] = useState({});
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    fetchInventory();
    fetchStatus();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await inventoryService.getFullInventory();
      setInventory(data.data);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to fetch inventory',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const { data } = await inventoryService.getInventoryStatus();
      setStatus(data.data);
    } catch (error) {
      console.error('Failed to fetch inventory status:', error);
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockData.quantity) {
      addNotification({ type: 'error', message: 'Please enter quantity' });
      return;
    }

    try {
      const { data } = await inventoryService.restockItem(selectedItem._id, {
        quantity: parseInt(restockData.quantity),
        supplier: restockData.supplier,
        cost: restockData.cost ? parseFloat(restockData.cost) : undefined,
      });

      setInventory(inventory.map((item) => (item._id === selectedItem._id ? data.data : item)));
      setIsModalOpen(false);
      setSelectedItem(null);
      setRestockData({ quantity: '', supplier: '', cost: '' });
      addNotification({ type: 'success', message: 'Item restocked successfully' });
      fetchStatus();
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to restock item' });
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Back of house"
        title="Inventory"
        description="Ingredient visibility, low-stock alerts, and restock actions in a warm operational layout."
      />

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="primary">
          <p className="text-sm text-softgray mb-2">Total Items</p>
          <p className="text-3xl font-bold text-charcoal">{status.totalItems || 0}</p>
        </Card>
        <Card variant="warning">
          <p className="text-sm text-softgray mb-2">Low Stock Count</p>
          <p className="text-3xl font-bold text-charcoal">{status.lowStockCount || 0}</p>
        </Card>
        <Card variant="primary">
          <p className="text-sm text-softgray mb-2">Inventory Value</p>
          <p className="text-3xl font-bold text-charcoal">${status.totalInventoryValue || 0}</p>
        </Card>
        <Card variant="success">
          <p className="text-sm text-softgray mb-2">Avg Stock Level</p>
          <p className="text-3xl font-bold text-charcoal">{status.averageStockLevel || 0}</p>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <h3 className="mb-4 text-lg font-bold text-charcoal">Inventory Items</h3>
        {inventory.length === 0 ? (
          <EmptyState icon={Package} title="No Items" description="No inventory items found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Item Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Stock Level</th>
                  <th className="text-left py-3 px-4 font-semibold">Threshold</th>
                  <th className="text-left py-3 px-4 font-semibold">Unit</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 font-medium">{item.itemName}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">{item.stockLevel}</span>
                    </td>
                    <td className="py-3 px-4">{item.thresholdLevel}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.unit}</td>
                    <td className="py-3 px-4">
                      {item.isLowStock ? (
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-yellow-500" />
                          <Badge text="Low Stock" variant="warning" size="sm" />
                        </div>
                      ) : (
                        <Badge text="OK" variant="success" size="sm" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() => {
                          setSelectedItem(item);
                          setRestockData({ quantity: '', supplier: '', cost: '' });
                          setIsModalOpen(true);
                        }}
                        variant="primary"
                        size="sm"
                      >
                        Restock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Restock Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        title="Restock Item"
      >
        <form onSubmit={handleRestock} className="space-y-4">
          {selectedItem && (
            <>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Item</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedItem.itemName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Stock</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedItem.stockLevel} {selectedItem.unit}
                </p>
              </div>

              <Input
                label="Restock Quantity *"
                type="number"
                value={restockData.quantity}
                onChange={(e) => setRestockData({ ...restockData, quantity: e.target.value })}
                placeholder="0"
                required
              />

              <Input
                label="Supplier"
                value={restockData.supplier}
                onChange={(e) => setRestockData({ ...restockData, supplier: e.target.value })}
                placeholder="Supplier name"
              />

              <Input
                label="Cost per Unit"
                type="number"
                step="0.01"
                value={restockData.cost}
                onChange={(e) => setRestockData({ ...restockData, cost: e.target.value })}
                placeholder="0.00"
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Confirm Restock
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
