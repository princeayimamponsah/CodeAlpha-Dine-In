import React, { useState, useEffect } from 'react';
import { Card, Badge, EmptyState, SectionHeader, Button } from '../components/UI';
import { menuService } from '../services/apiServices';
import { useNotificationStore, useCartStore } from '../context/store';
import { UtensilsCrossed, ShoppingCart } from 'lucide-react';

export const AvailableMenusPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const addNotification = useNotificationStore((state) => state.addNotification);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const handleAddToCart = (item) => {
    addToCart(item);
    addNotification({
      type: 'success',
      message: `${item.name} added to cart`,
      duration: 2000,
    });
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data } = await menuService.getAllItems({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
      });
      const availableItems = data.data.filter((item) => item.isAvailable);
      setItems(availableItems);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to fetch menu items',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'appetizers', 'mains', 'sides', 'desserts', 'beverages', 'specials'];
  const categoryGroups = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) {
    return <div className="p-6 text-center">Loading menu...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Available dishes"
        title="Menu"
        description="Browse our available dishes and special offerings."
      />

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-wine text-cream shadow-[0_12px_28px_rgba(109,31,61,0.18)]'
                : 'bg-white/80 text-softgray border border-beige/70 hover:bg-peach/30'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      {items.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No Available Items"
          description="No menu items are currently available. Please check back later."
        />
      ) : selectedCategory === 'all' ? (
        <div className="space-y-8">
          {Object.entries(categoryGroups).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-charcoal mb-4 capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItems.map((item) => (
                  <Card key={item._id}>
                    <div className="mb-4">
                      <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-gold/20">
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

                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {item.name}
                    </h4>

                    <div className="flex gap-2 mb-3">
                      {item.isVegetarian && <Badge text="Vegetarian" variant="success" size="sm" />}
                      {item.isSpicy && <Badge text="Spicy" variant="warning" size="sm" />}
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-wine">
                        GHS {item.price.toFixed(2)}
                      </span>
                      {item.stockQuantity <= item.thresholdLevel && (
                        <Badge text="Low Stock" variant="warning" size="sm" />
                      )}
                    </div>

                    <Button
                      onClick={() => handleAddToCart(item)}
                      variant="primary"
                      size="sm"
                      className="w-full mt-4 justify-center flex items-center gap-2"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item._id}>
              <div className="mb-4">
                <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-gold/20">
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

                    <h4 className="text-lg font-bold text-gray-950  mb-2">
                {item.name}
              </h4>

              <div className="flex gap-2 mb-3">
                {item.isVegetarian && <Badge text="Vegetarian" variant="success" size="sm" />}
                {item.isSpicy && <Badge text="Spicy" variant="warning" size="sm" />}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-wine">
                  GHS {item.price.toFixed(2)}
                </span>
                {item.stockQuantity <= item.thresholdLevel && (
                  <Badge text="Low Stock" variant="warning" size="sm" />
                )}
              </div>

              <Button
                onClick={() => handleAddToCart(item)}
                variant="primary"
                size="sm"
                className="w-full mt-4 justify-center flex items-center gap-2"
              >
                <ShoppingCart size={16} /> Add to Cart
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
