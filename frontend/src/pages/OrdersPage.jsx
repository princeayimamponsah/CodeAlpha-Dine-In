import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Badge, Button, Card, EmptyState, Input, SectionHeader } from '../components/UI';
import { orderService } from '../services/apiServices';
import { useNotificationStore, useAuthStore } from '../context/store';
import {
  CheckCircle2,
  Clock3,
  Filter,
  Flame,
  ChefHat,
  RefreshCw,
  Search,
  ShoppingBag,
  UtensilsCrossed,
  XCircle,
} from 'lucide-react';

const statusFilters = ['all', 'pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'];

const statusMeta = {
  pending: { label: 'Pending', variant: 'warning', icon: Clock3 },
  preparing: { label: 'Preparing', variant: 'info', icon: ChefHat },
  ready: { label: 'Ready', variant: 'warning', icon: UtensilsCrossed },
  served: { label: 'Served', variant: 'success', icon: CheckCircle2 },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', variant: 'error', icon: XCircle },
};

const paymentMeta = {
  paid: 'success',
  partial: 'warning',
  unpaid: 'error',
};

const formatMoney = (value) => `GHS ${Number(value || 0).toFixed(2)}`;

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const addNotification = useNotificationStore((state) => state.addNotification);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.getAllOrders({
        ...(activeFilter !== 'all' && { status: activeFilter }),
      });
      setOrders(data.data || []);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to load order board',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      addNotification({
        type: 'success',
        message: `Order moved to ${status}`,
      });
      fetchOrders();
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Unable to update order status',
      });
    }
  };

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return orders;

    return orders.filter((order) => {
      const customer = order.customerName || order.guestName || '';
      const tableNumber = order.table?.tableNumber ? `table ${order.table.tableNumber}` : '';
      const orderNumber = order.orderNumber || '';
      const itemNames = (order.items || [])
        .map((item) => item.menuItem?.name || item.menuItem?.itemName || '')
        .join(' ');

      return `${customer} ${tableNumber} ${orderNumber} ${itemNames}`.toLowerCase().includes(term);
    });
  }, [orders, searchTerm]);

  const summaryCounts = useMemo(() => {
    return orders.reduce(
      (accumulator, order) => {
        const status = order.orderStatus || order.status || 'pending';
        accumulator[status] = (accumulator[status] || 0) + 1;
        return accumulator;
      },
      { pending: 0, preparing: 0, ready: 0, served: 0, completed: 0, cancelled: 0 },
    );
  }, [orders]);

  const orderCards = filteredOrders.map((order) => {
    const status = order.orderStatus || order.status || 'pending';
    const items = order.items || [];
    const statusInfo = statusMeta[status] || statusMeta.pending;
    const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
    const customerName = order.customerName || order.guestName || 'Guest order';
    const itemLabel = items
      .slice(0, 3)
      .map((item) => `${item.quantity}x ${item.menuItem?.name || item.menuItem?.itemName || 'Item'}`)
      .join(' · ');

    return {
      ...order,
      status,
      statusInfo,
      createdAt,
      customerName,
      itemLabel,
    };
  });

  const renderActions = (order) => {
    const actions = [];

    if (order.status === 'pending') {
      actions.push({ label: 'Accept Order', target: 'preparing', variant: 'primary' });
      actions.push({ label: 'Mark Preparing', target: 'preparing', variant: 'outline' });
      actions.push({ label: 'Cancel', target: 'cancelled', variant: 'danger' });
    } else if (order.status === 'preparing') {
      actions.push({ label: 'Mark Ready', target: 'ready', variant: 'primary' });
      actions.push({ label: 'Cancel', target: 'cancelled', variant: 'danger' });
    } else if (order.status === 'ready') {
      actions.push({ label: 'Mark Served', target: 'served', variant: 'primary' });
      actions.push({ label: 'Cancel', target: 'cancelled', variant: 'danger' });
    } else if (order.status === 'served') {
      actions.push({ label: 'Complete Order', target: 'completed', variant: 'primary' });
    }

    if (actions.length === 0) {
      return <Badge text="No actions" variant="default" size="sm" />;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            size="sm"
            onClick={() => updateStatus(order._id, action.target)}
          >
            {action.label}
          </Button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-premium" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Command center"
        title="Orders"
        description="View, filter, and move tickets through the restaurant workflow with clear, status-aware actions."
        action={
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCw size={16} /> Refresh board
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Pending', value: summaryCounts.pending, icon: Clock3, tone: 'warning' },
          { label: 'Preparing', value: summaryCounts.preparing, icon: ChefHat, tone: 'info' },
          { label: 'Ready', value: summaryCounts.ready, icon: UtensilsCrossed, tone: 'warning' },
          { label: 'Served', value: summaryCounts.served, icon: CheckCircle2, tone: 'success' },
          { label: 'Completed', value: summaryCounts.completed, icon: ShoppingBag, tone: 'success' },
        ].map((item) => (
          <Card key={item.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">{item.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone === 'success' ? 'bg-olive/15 text-olive' : item.tone === 'warning' ? 'bg-gold/18 text-gold' : 'bg-wine/10 text-wine'}`}>
              <item.icon size={22} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-softgray" size={18} />
            <Input
              placeholder="Search order number, customer, table, or item..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-11"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={18} className="text-softgray" />
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeFilter === status ? 'bg-wine text-cream shadow-[0_14px_30px_rgba(107,30,30,0.18)]' : 'border border-beige/70 bg-white/70 text-softgray hover:bg-peach/35 hover:text-charcoal'}`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {orderCards.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No matching orders"
          description="No orders matched the current filter and search criteria."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {orderCards.map((order) => {
            const StatusIcon = order.statusInfo.icon;
            const isReady = order.status === 'ready';

            return (
              <Card key={order._id || order.orderNumber} className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-wine" />
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-charcoal">{order.orderNumber}</h3>
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${isReady ? 'bg-gold/18 text-gold' : 'bg-wine/10 text-wine'}`}>
                        <StatusIcon size={16} />
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-softgray">{order.customerName} · Table {order.table?.tableNumber || '—'}</p>
                    <p className="mt-1 text-sm text-softgray">{format(order.createdAt, 'dd MMM yyyy, HH:mm')}</p>
                  </div>
                  <Badge text={order.statusInfo.label} variant={order.statusInfo.variant} size="sm" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[22px] bg-white/75 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Items</p>
                    <p className="mt-2 text-sm leading-6 text-charcoal">{order.itemLabel || 'No line items available'}</p>
                  </div>
                  { /* Hide financials for non-admin staff */ }
                  { isAdmin && (
                  <div className="rounded-[22px] bg-white/75 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Total</p>
                    <p className="mt-2 text-2xl font-semibold text-charcoal">{formatMoney(order.totalAmount)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge text={order.paymentStatus || 'unpaid'} variant={paymentMeta[order.paymentStatus] || 'default'} size="sm" />
                    </div>
                  </div>
                  )}
                </div>

                <div className="mt-4 rounded-[22px] bg-white/75 p-4">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Workflow actions</p>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-softgray">
                      <span className="h-2 w-2 rounded-full bg-olive" /> Live
                    </span>
                  </div>
                  {renderActions(order)}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <div className="flex items-center gap-3 text-sm text-softgray">
          <Flame size={16} className="text-gold" />
          The board is designed for floor staff and kitchen leads to update order state with one click, minimizing back-and-forth during peak service.
        </div>
      </Card>
    </div>
  );
};

export default OrdersPage;
