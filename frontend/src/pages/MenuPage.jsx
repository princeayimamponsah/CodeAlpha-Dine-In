import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Input, Select, Textarea, EmptyState, SectionHeader } from '../components/UI';
import { menuService, inventoryService } from '../services/apiServices';
import { useNotificationStore } from '../context/store';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';

export const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'mains',
    description: '',
    price: '',
    stockQuantity: '',
    isVegetarian: false,
    isSpicy: false,
  });
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory, searchTerm]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data } = await menuService.getAllItems({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
      });
      setItems(data.data);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to fetch menu items',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { data } = await menuService.updateItem(editingItem._id, newItem);
        setItems(items.map((item) => (item._id === editingItem._id ? data.data : item)));
        addNotification({ type: 'success', message: 'Menu item updated successfully' });
      } else {
        const { data } = await menuService.createItem(newItem);
        setItems([...items, data.data]);
        addNotification({ type: 'success', message: 'Menu item created successfully' });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setNewItem({
        name: '',
        category: 'mains',
        description: '',
        price: '',
        stockQuantity: '',
        isVegetarian: false,
        isSpicy: false,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to save item',
      });
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await menuService.deleteItem(id);
        setItems(items.filter((item) => item._id !== id));
        addNotification({ type: 'success', message: 'Menu item deleted successfully' });
      } catch (error) {
        addNotification({ type: 'error', message: 'Failed to delete item' });
      }
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      stockQuantity: item.stockQuantity.toString(),
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
    });
    setIsModalOpen(true);
  };

  const categories = ['all', 'appetizers', 'mains', 'sides', 'desserts', 'beverages', 'specials'];

  if (loading) {
    return <div className="p-6 text-center">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Cuisine"
        title="Menu studio"
        description="Premium dish cards, stock indicators, and availability controls for the kitchen and floor teams."
        action={<Button onClick={() => {
          setEditingItem(null);
          setNewItem({
            name: '',
            category: 'mains',
            description: '',
            price: '',
            stockQuantity: '',
            isVegetarian: false,
            isSpicy: false,
          });
          setIsModalOpen(true);
        }} variant="primary">
          <Plus size={20} /> Add Item
        </Button>}
      />

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="md:w-48"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      {/* Menu Items Grid */}
      {items.length === 0 ? (
        <EmptyState
          title="No Menu Items"
          description="No items found. Try adjusting your filters or add new items."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item._id} className="relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  onClick={() => handleEditItem(item)}
                  variant="secondary"
                  size="sm"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  onClick={() => handleDeleteItem(item._id)}
                  variant="danger"
                  size="sm"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="mb-4">
                <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-peach to-gold/70">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {item.name}
              </h3>

              <div className="flex gap-2 mb-3">
                {item.isVegetarian && <Badge text="Vegetarian" variant="success" size="sm" />}
                {item.isSpicy && <Badge text="Spicy" variant="warning" size="sm" />}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-wine">
                  GHS {item.price.toFixed(2)}
                </span>
                <Badge
                  text={item.isAvailable ? 'Available' : 'Unavailable'}
                  variant={item.isAvailable ? 'success' : 'error'}
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Stock: {item.stockQuantity}</span>
                {item.stockQuantity <= item.thresholdLevel && (
                  <AlertTriangle size={16} className="text-yellow-500" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <Input
            label="Item Name *"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                label="Category *"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="appetizers">Appetizers</option>
                <option value="mains">Mains</option>
                <option value="sides">Sides</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Beverages</option>
                <option value="specials">Specials</option>
              </Select>
            </div>

            <Input
              label="Price (GHS) *"
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="Description *"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            rows="3"
            required
          />

          <Input
            label="Stock Quantity *"
            type="number"
            value={newItem.stockQuantity}
            onChange={(e) => setNewItem({ ...newItem, stockQuantity: e.target.value })}
            required
          />

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newItem.isVegetarian}
                onChange={(e) => setNewItem({ ...newItem, isVegetarian: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-charcoal">Vegetarian</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newItem.isSpicy}
                onChange={(e) => setNewItem({ ...newItem, isSpicy: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-charcoal">Spicy</span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
