import React, { useEffect, useMemo, useState } from 'react';
import { Card, Badge, Button, Modal, Input, EmptyState, SectionHeader, Select, Textarea } from '../components/UI';
import { inventoryService } from '../services/apiServices';
import { useNotificationStore, useAuthStore } from '../context/store';
import { AlertTriangle, Box, Layers3, PackageSearch, RefreshCw, Search, Truck } from 'lucide-react';

const stockTone = (item) => {
  if (item.isLowStock) return 'error';
  if (item.stockLevel <= item.thresholdLevel + 5) return 'warning';
  return 'success';
};

const initialRestock = {
  quantity: '',
  supplier: '',
  cost: '',
};

export const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockData, setRestockData] = useState(initialRestock);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const addNotification = useNotificationStore((state) => state.addNotification);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchInventory();
    fetchStatus();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await inventoryService.getFullInventory();
      setInventory(data.data || []);
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to fetch inventory' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const { data } = await inventoryService.getInventoryStatus();
      setStatus(data.data || {});
    } catch (error) {
      setStatus({});
    }
  };

  const filteredInventory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesSearch =
        !term ||
        [item.itemName, item.category, item.unit, item.supplier]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term);
      const matchesCategory = categoryFilter === 'all' || (item.category || '').toLowerCase() === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, categoryFilter]);

  const categories = useMemo(() => ['all', ...new Set(inventory.map((item) => (item.category || 'uncategorized').toLowerCase()))], [inventory]);

  const inventoryMetrics = useMemo(() => {
    return inventory.reduce(
      (accumulator, item) => {
        accumulator.total += 1;
        accumulator.low += item.isLowStock ? 1 : 0;
        accumulator.value += Number(item.stockLevel || 0) * Number(item.cost || item.unitCost || 0);
        return accumulator;
      },
      { total: 0, low: 0, value: 0 },
    );
  }, [inventory]);

  const openRestockModal = (item) => {
    setSelectedItem(item);
    setRestockData(initialRestock);
    setIsModalOpen(true);
  };

  const handleRestock = async (event) => {
    event.preventDefault();

    if (!selectedItem || !restockData.quantity) {
      addNotification({ type: 'error', message: 'Please enter quantity' });
      return;
    }

    try {
      const { data } = await inventoryService.restockItem(selectedItem._id, {
        quantity: Number(restockData.quantity),
        supplier: restockData.supplier,
        cost: restockData.cost ? Number(restockData.cost) : undefined,
      });

      setInventory((current) => current.map((item) => (item._id === selectedItem._id ? data.data : item)));
      setIsModalOpen(false);
      setSelectedItem(null);
      setRestockData(initialRestock);
      addNotification({ type: 'success', message: 'Item restocked successfully' });
      fetchStatus();
    } catch (error) {
      addNotification({ type: 'error', message: error.response?.data?.message || 'Failed to restock item' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-premium" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
        <div className="h-[520px] animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-premium" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Back of house"
        title="Inventory"
        description="Ingredient visibility, low-stock alerts, and stock movements in a calm operational control room."
        action={<Button variant="outline" onClick={() => { fetchInventory(); fetchStatus(); }}><RefreshCw size={16} /> Refresh stock</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total items', value: status.totalItems || inventoryMetrics.total, icon: PackageSearch, tone: 'wine' },
          { label: 'Low stock', value: status.lowStockCount || inventoryMetrics.low, icon: AlertTriangle, tone: 'gold' },
          { label: 'Inventory value', value: `GHS ${(status.totalInventoryValue || inventoryMetrics.value || 0).toLocaleString()}`, icon: Box, tone: 'green' },
          { label: 'Avg stock level', value: status.averageStockLevel || 0, icon: Layers3, tone: 'peach' },
        ].map((item) => (
          <Card key={item.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">{item.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone === 'wine' ? 'bg-wine/10 text-wine' : item.tone === 'gold' ? 'bg-gold/18 text-gold' : item.tone === 'green' ? 'bg-olive/15 text-olive' : 'bg-peach/50 text-charcoal'}`}>
              <item.icon size={22} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-softgray" size={18} />
            <Input placeholder="Search ingredients, category, supplier..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="pl-11" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${categoryFilter === category ? 'bg-wine text-cream shadow-[0_14px_30px_rgba(107,30,30,0.18)]' : 'border border-beige/70 bg-white/70 text-softgray hover:bg-peach/35 hover:text-charcoal'}`}
              >
                {category === 'all' ? 'All categories' : category}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filteredInventory.length === 0 ? (
        <EmptyState icon={PackageSearch} title="No inventory items" description="No items match the current filters." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredInventory.map((item) => {
            const tone = stockTone(item);
            return (
              <Card key={item._id} className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gold" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-charcoal shadow-soft">
                        <PackageSearch size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-charcoal">{item.itemName}</h3>
                        <p className="text-sm text-softgray">{item.category || 'General'}</p>
                      </div>
                    </div>
                    <Badge text={tone === 'error' ? 'Low stock' : tone === 'warning' ? 'Watch level' : 'Healthy'} variant={tone} size="sm" />
                  </div>
                  {isAdmin ? (
                    <Button variant="outline" size="sm" onClick={() => openRestockModal(item)}>
                      <Truck size={16} /> Restock
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <Truck size={16} /> Restock
                    </Button>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/75 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Current stock</p>
                    <p className="mt-2 text-3xl font-semibold text-charcoal">{item.stockLevel}</p>
                    <p className="mt-1 text-sm text-softgray">{item.unit}</p>
                  </div>
                  <div className="rounded-2xl bg-white/75 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Threshold</p>
                    <p className="mt-2 text-3xl font-semibold text-charcoal">{item.thresholdLevel}</p>
                    <p className="mt-1 text-sm text-softgray">Auto alert at or below threshold</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-softgray">
                  <div className="flex items-center justify-between rounded-2xl bg-white/75 px-4 py-3"><span>Supplier</span><span className="font-semibold text-charcoal">{item.supplier || 'Not set'}</span></div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/75 px-4 py-3"><span>Last updated</span><span className="font-semibold text-charcoal">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Today'}</span></div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title="Restock Item" size="lg">
        <form onSubmit={handleRestock} className="space-y-4">
          {selectedItem && (
            <div className="rounded-[22px] bg-cream px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Selected item</p>
              <p className="mt-1 text-lg font-semibold text-charcoal">{selectedItem.itemName}</p>
              <p className="text-sm text-softgray">Current stock {selectedItem.stockLevel} {selectedItem.unit}</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Restock quantity *" type="number" value={restockData.quantity} onChange={(e) => setRestockData({ ...restockData, quantity: e.target.value })} placeholder="0" required />
            <Input label="Supplier" value={restockData.supplier} onChange={(e) => setRestockData({ ...restockData, supplier: e.target.value })} placeholder="Supplier name" />
          </div>

          <Input label="Cost per unit (GHS)" type="number" step="0.01" value={restockData.cost} onChange={(e) => setRestockData({ ...restockData, cost: e.target.value })} placeholder="0.00" />

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1">Confirm restock</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
