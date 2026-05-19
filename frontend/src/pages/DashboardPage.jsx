import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, Badge, Button, MetricCard, SectionHeader } from '../components/UI';
import { orderService, tableService, inventoryService } from '../services/apiServices';
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  Flame,
  Receipt,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    activeOrders: 0,
    occupiedTables: 0,
    lowStockItems: 0,
    dailySales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, tablesRes, inventoryRes, salesRes] = await Promise.all([
        orderService.getActiveOrders(),
        tableService.getAllTables(),
        inventoryService.getLowStockItems(),
        orderService.getDailySales(new Date().toISOString().split('T')[0]),
      ]);

      const occupiedCount = tablesRes.data.data.filter((t) => t.status === 'occupied').length;
      const dailySales = Number(salesRes.data.data.totalSales || 0);

      setStats({
        activeOrders: ordersRes.data.data.length,
        occupiedTables: occupiedCount,
        lowStockItems: inventoryRes.data.data.length,
        dailySales,
      });

      setRecentOrders(ordersRes.data.data.slice(0, 5));

      const mockData = [
        { day: 'Mon', sales: 3900, orders: 24 },
        { day: 'Tue', sales: 4200, orders: 27 },
        { day: 'Wed', sales: 3800, orders: 25 },
        { day: 'Thu', sales: 4800, orders: 31 },
        { day: 'Fri', sales: 5600, orders: 38 },
        { day: 'Sat', sales: 6800, orders: 46 },
        { day: 'Sun', sales: 6100, orders: 41 },
      ];
      setChartData(mockData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueTrend = 12.4;
  const orderTrend = 8.2;
  const reservationTrend = 4.6;
  const stockTrend = -3.1;

  const chartTooltip = {
    contentStyle: {
      background: 'rgba(255, 255, 255, 0.96)',
      border: '1px solid rgba(234, 215, 204, 0.8)',
      borderRadius: '18px',
      boxShadow: '0 16px 40px rgba(43, 43, 43, 0.12)',
    },
    labelStyle: {
      color: '#2B2B2B',
      fontWeight: 700,
      marginBottom: '4px',
    },
  };

  const ordersForTable = recentOrders.map((order, index) => {
    const status = order.orderStatus || order.status || ['pending', 'preparing', 'served', 'completed'][index % 4];
    return {
      ...order,
      status,
      customer: order.customerName || order.guestName || `Guest ${index + 1}`,
      createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
      paymentStatus: order.paymentStatus || 'paid',
    };
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-soft" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-soft" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-[380px] animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-soft" />
          <div className="h-[380px] animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-soft" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Operational overview"
        title="Operations dashboard"
        description="A warm, premium control center for service pacing, reservations, revenue, and stock pressure across the restaurant floor."
        action={<Button variant="primary"><Sparkles size={16} /> Live service</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`$${stats.dailySales.toLocaleString()}`}
          trend={revenueTrend}
          tone="wine"
          hint="vs yesterday"
        />
        <MetricCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.activeOrders}
          trend={orderTrend}
          tone="peach"
          hint="active today"
        />
        <MetricCard
          icon={Users}
          label="Active Reservations"
          value={stats.occupiedTables}
          trend={reservationTrend}
          tone="olive"
          hint="party flow"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Inventory Alerts"
          value={stats.lowStockItems}
          trend={stockTrend}
          tone="gold"
          hint="needs attention"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="relative overflow-hidden">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Revenue pulse</p>
              <h3 className="mt-2 text-2xl font-semibold text-charcoal">Weekly revenue curve</h3>
            </div>
            <div className="rounded-2xl bg-olive/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-olive">
              +12.4%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6D1F3D" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#F7D6C2" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAD7CC" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
              <Tooltip {...chartTooltip} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="sales" stroke="#6D1F3D" strokeWidth={3} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-5 flex items-center gap-3 text-sm text-softgray">
            <Receipt size={16} className="text-gold" />
            Peak service is Friday evening. Reserve staffing and prep accordingly.
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Order rhythm</p>
              <h3 className="mt-2 text-2xl font-semibold text-charcoal">Orders by day</h3>
            </div>
            <div className="rounded-2xl bg-peach/65 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">
              41 avg
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAD7CC" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="orders" radius={[16, 16, 4, 4]} fill="url(#ordersGradient)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-5 flex items-center gap-3 text-sm text-softgray">
            <Flame size={16} className="text-wine" />
            Order pace is strongest from Thursday through Saturday.
          </div>
          <svg className="hidden">
            <defs>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4A373" />
                <stop offset="100%" stopColor="#6D1F3D" />
              </linearGradient>
            </defs>
          </svg>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Service board</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Recent orders</h3>
          </div>
          <Button variant="outline" size="sm">
            View all <ArrowRight size={16} />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-softgray">
                <th className="px-4 py-2 font-semibold">Order ID</th>
                <th className="px-4 py-2 font-semibold">Customer</th>
                <th className="px-4 py-2 font-semibold">Table</th>
                <th className="px-4 py-2 font-semibold">Date</th>
                <th className="px-4 py-2 font-semibold">Time</th>
                <th className="px-4 py-2 font-semibold">Amount</th>
                <th className="px-4 py-2 font-semibold">Payment</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersForTable.map((order) => (
                <tr key={order._id} className="rounded-[22px] bg-white/80 transition-all hover:-translate-y-0.5 hover:bg-white">
                  <td className="rounded-l-[22px] px-4 py-4 font-semibold text-charcoal">{order.orderNumber}</td>
                  <td className="px-4 py-4 text-softgray">{order.customer}</td>
                  <td className="px-4 py-4 font-medium text-charcoal">Table {order.table?.tableNumber || '—'}</td>
                  <td className="px-4 py-4 text-softgray">{format(order.createdAt, 'dd MMM yyyy')}</td>
                  <td className="px-4 py-4 text-softgray">{format(order.createdAt, 'HH:mm')}</td>
                  <td className="px-4 py-4 font-semibold text-charcoal">${Number(order.totalAmount || 0).toFixed(2)}</td>
                  <td className="px-4 py-4"><Badge text={order.paymentStatus} variant={order.paymentStatus === 'paid' ? 'success' : 'warning'} size="sm" /></td>
                  <td className="px-4 py-4">
                    <Badge
                      text={order.status}
                      variant={
                        order.status === 'completed'
                          ? 'success'
                          : order.status === 'cancelled'
                            ? 'error'
                            : order.status === 'preparing'
                              ? 'warning'
                              : 'info'
                      }
                      size="sm"
                    />
                  </td>
                  <td className="rounded-r-[22px] px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="success" size="sm">Accept</Button>
                      <Button variant="danger" size="sm">Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
