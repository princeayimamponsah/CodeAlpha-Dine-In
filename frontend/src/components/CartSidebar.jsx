import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Card, Button, Input, Select } from './UI';
import { useCartStore, useNotificationStore } from '../context/store';
import { orderService, tableService } from '../services/apiServices';

export const CartSidebar = ({ isOpen, onClose }) => {
  const cart = useCartStore((state) => state.items);
  const tableId = useCartStore((state) => state.tableId);
  const specialNotes = useCartStore((state) => state.specialNotes);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setTableId = useCartStore((state) => state.setTableId);
  const setSpecialNotes = useCartStore((state) => state.setSpecialNotes);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const addNotification = useNotificationStore((state) => state.addNotification);

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTables();
    }
  }, [isOpen]);

  const fetchTables = async () => {
    try {
      const { data } = await tableService.getAllTables();
      const availableTables = data.data.filter((t) => t.status === 'available');
      setTables(availableTables);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to load tables',
      });
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      addNotification({
        type: 'error',
        message: 'Cart is empty. Add items before placing order.',
      });
      return;
    }

    if (!tableId) {
      addNotification({
        type: 'error',
        message: 'Please select a table.',
      });
      return;
    }

    try {
      setPlacing(true);
      const orderData = {
        tableId,
        items: cart.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cartTotal,
        specialNotes,
        status: 'pending',
      };

      await orderService.createOrder(orderData);

      addNotification({
        type: 'success',
        message: '✓ Order placed successfully! Your order is being prepared.',
        duration: 4000,
      });

      clearCart();
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to place order.',
      });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-[28rem] overflow-y-auto border-l border-white/70 bg-[linear-gradient(180deg,rgba(255,247,242,0.98),rgba(255,251,248,0.98))] shadow-[-16px_0_45px_rgba(43,43,43,0.12)] backdrop-blur-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-10 border-b border-white/70 bg-[rgba(255,247,242,0.98)] px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-wine/10 text-wine">
                <ShoppingCart size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-charcoal">Your Cart</h2>
                <p className="text-xs text-softgray">{cart.length} items</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-white/80 p-2 text-softgray shadow-soft transition-transform hover:scale-110"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="px-6 py-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart size={48} className="mx-auto mb-4 text-softgray/30" />
              <p className="text-sm font-medium text-softgray">Your cart is empty</p>
              <p className="mt-2 text-xs text-softgray/60">Add items from the menu to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <Card key={item._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-charcoal truncate">{item.name}</h4>
                      <p className="text-sm text-wine font-medium">GHS {item.price.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="flex-shrink-0 rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100"
                      title="Remove from cart"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="rounded-lg border border-white/80 bg-white/70 p-2 text-softgray shadow-soft transition-all hover:bg-white"
                    >
                      <Minus size={14} />
                    </button>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                      className="w-16 rounded-lg border border-white/80 bg-white/80 py-2 text-center text-sm font-semibold text-charcoal outline-none focus:border-wine/30"
                    />

                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="rounded-lg border border-white/80 bg-white/70 p-2 text-softgray shadow-soft transition-all hover:bg-white"
                    >
                      <Plus size={14} />
                    </button>

                    <span className="ml-auto text-sm font-semibold text-charcoal">
                      GHS {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 border-t border-white/70 bg-[rgba(255,247,242,0.98)] px-6 py-4 backdrop-blur-xl space-y-4">
            {/* Cart Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-softgray">
                <span>Subtotal</span>
                <span>GHS {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-charcoal">
                <span>Total</span>
                <span className="text-wine">GHS {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3">
              {/* Table Selection */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Select Table *
                </label>
                <Select
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="w-full"
                  required
                >
                  <option value="">Choose a table...</option>
                  {tables.map((table) => (
                    <option key={table._id} value={table._id}>
                      Table {table.tableNumber} (Capacity: {table.capacity}) - {table.location}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Special Notes
                </label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g., No onions, extra spice..."
                  maxLength={200}
                  className="w-full rounded-lg border border-white/80 bg-white/80 px-4 py-3 text-sm text-charcoal placeholder:text-softgray/50 outline-none shadow-soft transition-all duration-300 focus:border-wine/30 focus:bg-white resize-none"
                  rows={2}
                />
                <p className="mt-1 text-xs text-softgray">{specialNotes.length}/200</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 justify-center"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 justify-center"
                  disabled={placing || !tableId}
                  isLoading={placing}
                >
                  {placing ? 'Placing...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
