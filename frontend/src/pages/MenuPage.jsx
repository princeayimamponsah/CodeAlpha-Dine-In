import React, { useEffect, useMemo, useState } from 'react';
import { Card, Badge, Button, Modal, Input, Select, Textarea, EmptyState, SectionHeader } from '../components/UI';
import { menuService } from '../services/apiServices';
import { useNotificationStore, useAuthStore } from '../context/store';
import { AlertTriangle, Plus, Search, Sparkles, Trash2, UtensilsCrossed } from 'lucide-react';

const categories = ['all', 'appetizers', 'mains', 'sides', 'desserts', 'beverages', 'specials'];

const initialItem = {
  name: '',
  category: 'mains',
  description: '',
  price: '',
  stockQuantity: '',
  image: '',
  isVegetarian: false,
  isSpicy: false,
  isPopular: false,
  isAvailable: true,
};

export const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newItem, setNewItem] = useState(initialItem);
  const [isEditSelectorOpen, setIsEditSelectorOpen] = useState(false);
  const [isDeleteSelectorOpen, setIsDeleteSelectorOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const addNotification = useNotificationStore((state) => state.addNotification);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data } = await menuService.getAllItems({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
      });
      setItems(data.data || []);
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to fetch menu items' });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      return !term || [item.name, item.description, item.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [items, searchTerm]);

  const stats = useMemo(() => {
    return items.reduce(
      (accumulator, item) => {
        accumulator.total += 1;
        accumulator.available += item.isAvailable ? 1 : 0;
        accumulator.lowStock += item.stockQuantity <= item.thresholdLevel ? 1 : 0;
        return accumulator;
      },
      { total: 0, available: 0, lowStock: 0 },
    );
  }, [items]);

  const handleSaveItem = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...newItem,
        price: Number(newItem.price),
        stockQuantity: Number(newItem.stockQuantity),
      };

      if (editingItem) {
        const { data } = await menuService.updateItem(editingItem._id, payload);
        setItems((current) => current.map((item) => (item._id === editingItem._id ? data.data : item)));
        addNotification({ type: 'success', message: 'Menu item updated successfully' });
      } else {
        const { data } = await menuService.createItem(payload);
        setItems((current) => [...current, data.data]);
        addNotification({ type: 'success', message: 'Menu item created successfully' });
      }

      setIsModalOpen(false);
      setEditingItem(null);
      setNewItem(initialItem);
    } catch (error) {
      addNotification({ type: 'error', message: error.response?.data?.message || 'Failed to save item' });
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await menuService.deleteItem(id);
      setItems((current) => current.filter((item) => item._id !== id));
      addNotification({ type: 'success', message: 'Menu item deleted successfully' });
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to delete item' });
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setNewItem(initialItem);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name || '',
      category: item.category || 'mains',
      description: item.description || '',
      price: item.price?.toString() || '',
      stockQuantity: item.stockQuantity?.toString() || '',
      image: item.image || '',
      isVegetarian: Boolean(item.isVegetarian),
      isSpicy: Boolean(item.isSpicy),
      isPopular: Boolean(item.isPopular),
      isAvailable: item.isAvailable !== false,
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-premium" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Cuisine"
        title="Menu studio"
        description="Premium dish cards, stock indicators, and availability controls for the kitchen and floor teams."
        action={isAdmin ? <Button variant="primary" onClick={openCreateModal}><Plus size={16} /> Add Item</Button> : null}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total dishes', value: stats.total, icon: UtensilsCrossed, tone: 'wine' },
          { label: 'Available', value: stats.available, icon: Sparkles, tone: 'green' },
          { label: 'Low stock', value: stats.lowStock, icon: AlertTriangle, tone: 'gold' },
          { label: 'Categories', value: categories.length - 1, icon: Search, tone: 'peach' },
        ].map((item) => (
          <Card key={item.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">{item.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone === 'wine' ? 'bg-wine/10 text-wine' : item.tone === 'green' ? 'bg-olive/15 text-olive' : item.tone === 'gold' ? 'bg-gold/18 text-gold' : 'bg-peach/50 text-charcoal'}`}>
              <item.icon size={22} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-softgray" size={18} />
            <Input placeholder="Search menu items, ingredients, or categories..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="pl-11" />
          </div>
          <Select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="md:w-56">
            {categories.map((category) => (
              <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
            ))}
          </Select>
          {isAdmin && (
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsEditSelectorOpen(true)}>Edit Item</Button>
              <Button variant="outline" onClick={() => setIsDeleteSelectorOpen(true)}>Delete Item</Button>
              <Button variant="primary" onClick={openCreateModal}><Plus size={14} /> Add Item</Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${selectedCategory === category ? 'bg-wine text-cream shadow-[0_14px_30px_rgba(107,30,30,0.18)]' : 'border border-beige/70 bg-white/70 text-softgray hover:bg-peach/35 hover:text-charcoal'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {filteredItems.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="No menu items" description="No items match the current filters." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const lowStock = item.stockQuantity <= item.thresholdLevel;
            return (
              <Card key={item._id} className="group relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-wine via-peach to-gold" />
                <div className="relative mb-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-peach to-gold/70">
                  <div className="aspect-[4/3] w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal">{item.name}</h3>
                    <p className="mt-1 text-sm text-softgray capitalize">{item.category}</p>
                  </div>
                  <Badge text={item.isAvailable ? 'Available' : 'Unavailable'} variant={item.isAvailable ? 'success' : 'error'} size="sm" />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.isVegetarian && <Badge text="Vegetarian" variant="success" size="sm" />}
                  {item.isSpicy && <Badge text="Spicy" variant="warning" size="sm" />}
                  {item.isPopular && <Badge text="Popular" variant="info" size="sm" />}
                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-6 text-softgray">{item.description}</p>

                <div className="mt-4 grid gap-3 text-sm text-softgray">
                  <div className="flex items-center justify-between rounded-2xl bg-white/75 px-4 py-3"><span>Price</span><span className="font-semibold text-charcoal">GHS {Number(item.price || 0).toFixed(2)}</span></div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/75 px-4 py-3"><span>Stock</span><span className="font-semibold text-charcoal">{item.stockQuantity}</span></div>
                </div>

                {lowStock && (
                  <div className="mt-4 rounded-2xl bg-gold/15 px-4 py-3 text-sm font-semibold text-gold">
                    <AlertTriangle size={16} className="mr-2 inline-block" /> Low stock alert
                  </div>
                )}

                {/* actions moved to top controls for admin — cards are read-only */}
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'} size="lg">
        <form onSubmit={handleSaveItem} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Item Name *" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} required />
            <Select label="Category *" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
              <option value="appetizers">Appetizers</option>
              <option value="mains">Mains</option>
              <option value="sides">Sides</option>
              <option value="desserts">Desserts</option>
              <option value="beverages">Beverages</option>
              <option value="specials">Specials</option>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Price (GHS) *" type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} required />
            <Input label="Stock quantity *" type="number" value={newItem.stockQuantity} onChange={(e) => setNewItem({ ...newItem, stockQuantity: e.target.value })} required />
          </div>

          <Input label="Image URL" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} placeholder="https://..." />
          <Textarea label="Description *" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} rows={4} required />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Vegetarian', 'isVegetarian'],
              ['Spicy', 'isSpicy'],
              ['Popular', 'isPopular'],
              ['Available', 'isAvailable'],
            ].map(([label, key]) => (
              <label key={label} className="flex items-center gap-3 rounded-[18px] bg-white/75 px-4 py-3 text-sm font-semibold text-charcoal">
                <input
                  type="checkbox"
                  checked={Boolean(newItem[key])}
                  onChange={(event) => setNewItem({ ...newItem, [key]: event.target.checked })}
                  className="h-4 w-4 rounded border-beige text-wine focus:ring-wine"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            {isAdmin && (
              <Button type="submit" variant="primary" className="flex-1">{editingItem ? 'Update Item' : 'Create Item'}</Button>
            )}
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditSelectorOpen} onClose={() => setIsEditSelectorOpen(false)} title="Select item to edit" size="md">
        <div className="space-y-4">
          <Select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
            <option value="">Choose an item...</option>
            {items.map((it) => (
              <option key={it._id} value={it._id}>{it.name}</option>
            ))}
          </Select>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsEditSelectorOpen(false)}>Cancel</Button>
            <Button type="button" variant="primary" className="flex-1" onClick={() => {
              const it = items.find((i) => i._id === selectedItemId);
              if (!it) return;
              setIsEditSelectorOpen(false);
              openEditModal(it);
            }}>Edit selected</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteSelectorOpen} onClose={() => setIsDeleteSelectorOpen(false)} title="Select item to delete" size="md">
        <div className="space-y-4">
          <Select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
            <option value="">Choose an item...</option>
            {items.map((it) => (
              <option key={it._id} value={it._id}>{it.name}</option>
            ))}
          </Select>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsDeleteSelectorOpen(false)}>Cancel</Button>
            <Button type="button" variant="danger" className="flex-1" onClick={() => {
              if (!selectedItemId) return;
              if (!window.confirm('Delete this menu item?')) return;
              handleDeleteItem(selectedItemId);
              setIsDeleteSelectorOpen(false);
            }}>Delete selected</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MenuPage;
