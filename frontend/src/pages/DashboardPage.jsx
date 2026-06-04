import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge, Button, Card, SectionHeader } from '../components/UI';
import {
  inventoryService,
  orderService,
  reservationService,
  tableService,
} from '../services/apiServices';
import { useAuthStore, useNotificationStore } from '../context/store';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Clock3,
  Coffee,
  Flame,
  Layers3,
  Receipt,
  Salad,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const today = new Date();

const weeklyRevenue = [
  { day: 'Mon', value: 6120 },
  { day: 'Tue', value: 6840 },
  { day: 'Wed', value: 6280 },
  { day: 'Thu', value: 7420 },
  { day: 'Fri', value: 9180 },
  { day: 'Sat', value: 10820 },
  { day: 'Sun', value: 9640 },
];

const monthlyRevenue = [
  { month: 'Jan', value: 48200 },
  { month: 'Feb', value: 51400 },
  { month: 'Mar', value: 54800 },
  { month: 'Apr', value: 60120 },
  { month: 'May', value: 63840 },
  { month: 'Jun', value: 68460 },
];

const peakHours = [
  { hour: '10a', value: 12 },
  { hour: '12p', value: 24 },
  { hour: '2p', value: 18 },
  { hour: '5p', value: 31 },
  { hour: '7p', value: 48 },
  { hour: '9p', value: 27 },
];

const reservationTrend = [
  { week: 'W1', value: 18 },
  { week: 'W2', value: 22 },
  { week: 'W3', value: 25 },
  { week: 'W4', value: 29 },
  { week: 'W5', value: 31 },
  { week: 'W6', value: 35 },
];

const popularItems = [
  { name: 'Truffle Risotto', value: 92 },
  { name: 'Seared Salmon', value: 84 },
  { name: 'Charred Chicken', value: 78 },
  { name: 'Caramel Tart', value: 69 },
  { name: 'Ginger Spritz', value: 61 },
];

const sparklineSets = {
  orders: [18, 23, 21, 28, 31, 29, 35, 38],
  revenue: [50, 56, 53, 58, 66, 64, 72, 79],
  reservations: [12, 14, 16, 18, 21, 20, 24, 27],
  tables: [40, 42, 39, 44, 48, 46, 50, 54],
  stock: [22, 20, 19, 18, 16, 15, 14, 13],
  satisfaction: [92, 93, 94, 95, 96, 96, 97, 97],
};

const palette = ['#6B1E1E', '#D4A056', '#F8D7C4', '#2F8F5B', '#A46A4A', '#B36E6E'];

const chartTooltip = {
  contentStyle: {
    background: 'rgba(255, 249, 245, 0.98)',
    border: '1px solid rgba(233, 215, 201, 0.95)',
    borderRadius: '18px',
    boxShadow: '0 18px 50px rgba(43, 43, 43, 0.12)',
  },
  labelStyle: {
    color: '#2B2B2B',
    fontWeight: 700,
  },
};

const formatCurrency = (value) => `GHS ${Number(value || 0).toLocaleString()}`;

const TrendSparkline = ({ values, positive = true }) => {
  const width = 90;
  const height = 28;
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1 || 1)) * width;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;
    const y = height - ((value - minValue) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-[90px]" aria-hidden="true">
      <polyline
        fill="none"
        stroke={positive ? '#6B1E1E' : '#D4A056'}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points.join(' ')}
      />
    </svg>
  );
};

const MetricCard = ({ icon: Icon, label, value, change, description, sparkline, tone = 'wine' }) => {
  const toneClasses = {
    wine: 'bg-wine/15 text-wine',
    peach: 'bg-peach/35 text-charcoal',
    gold: 'bg-gold/15 text-gold',
    green: 'bg-olive/15 text-olive',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 ${tone === 'wine' ? 'bg-wine' : tone === 'gold' ? 'bg-gold' : tone === 'green' ? 'bg-olive' : 'bg-peach'}`} />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-charcoal">{value}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${change >= 0 ? 'bg-olive/15 text-olive' : 'bg-wine/10 text-wine'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className="text-softgray">{description}</span>
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]} shadow-soft`}>
          <Icon size={22} />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <TrendSparkline values={sparkline} positive={change >= 0} />
        <div className="text-right text-xs uppercase tracking-[0.18em] text-softgray">Live</div>
      </div>
    </Card>
  );
};

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const isAdmin = user?.role === 'admin';

  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrdersToday: 0,
    todayRevenue: 0,
    activeReservations: 0,
    availableTables: 0,
    reservedTables: 0,
    occupiedTables: 0,
    lowStockItems: 0,
    customerSatisfaction: 0,
  });
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [reservationRows, setReservationRows] = useState([]);
  const [lowStockRows, setLowStockRows] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const todayKey = new Date().toISOString().split('T')[0];

      const [ordersResult, tablesResult, inventoryResult, reservationsResult, salesResult] = await Promise.allSettled([
        orderService.getAllOrders(),
        tableService.getAllTables(),
        inventoryService.getLowStockItems(),
        reservationService.getUpcomingReservations(),
        isAdmin ? orderService.getDailySales(todayKey) : Promise.resolve({ data: { data: { totalSales: 0, totalOrders: 0 } } }),
      ]);

      const allOrders = ordersResult.status === 'fulfilled' ? ordersResult.value.data?.data || [] : [];
      const tables = tablesResult.status === 'fulfilled' ? tablesResult.value.data?.data || [] : [];
      const lowStockItems = inventoryResult.status === 'fulfilled' ? inventoryResult.value.data?.data || [] : [];
      const upcomingReservations = reservationsResult.status === 'fulfilled' ? reservationsResult.value.data?.data || [] : [];
      const sales = salesResult.status === 'fulfilled' ? salesResult.value.data?.data || {} : {};

      const orderStats = allOrders.reduce(
        (accumulator, order) => {
          const status = order.orderStatus || order.status || 'pending';
          accumulator[status] = (accumulator[status] || 0) + 1;
          return accumulator;
        },
        { pending: 0, preparing: 0, ready: 0, served: 0, completed: 0, cancelled: 0 },
      );

      const todaysOrders = allOrders.filter((order) => {
        const createdAt = new Date(order.createdAt || order.updatedAt || Date.now());
        return format(createdAt, 'yyyy-MM-dd') === todayKey;
      });

      const occupiedTables = tables.filter((table) => table.status === 'occupied').length;
      const reservedTables = tables.filter((table) => table.status === 'reserved').length;
      const availableTables = tables.filter((table) => table.status === 'available').length;
      const activeReservations = upcomingReservations.filter((reservation) => ['pending', 'confirmed', 'active'].includes(reservation.status)).length;

      setStats({
        totalOrdersToday: Number(sales.totalOrders || todaysOrders.length),
        todayRevenue: Number(sales.totalSales || todaysOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)),
        activeReservations,
        availableTables,
        reservedTables,
        occupiedTables,
        lowStockItems: lowStockItems.length,
        customerSatisfaction: 96,
      });

      setStatusBreakdown([
        { name: 'Pending', value: orderStats.pending },
        { name: 'Preparing', value: orderStats.preparing },
        { name: 'Ready', value: orderStats.ready },
        { name: 'Served', value: orderStats.served },
        { name: 'Completed', value: orderStats.completed },
        { name: 'Cancelled', value: orderStats.cancelled },
      ]);

      setReservationRows(upcomingReservations.slice(0, 4));
      setLowStockRows(lowStockItems.slice(0, 4));
      setRecentOrders(allOrders.slice(0, 5));
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Unable to load dashboard data right now',
      });
    } finally {
      setLoading(false);
    }
  };

  const orderBoard = useMemo(
    () => [
      {
        label: 'Total Orders Today',
        value: stats.totalOrdersToday.toLocaleString(),
        change: 14,
        description: 'vs yesterday',
        icon: Receipt,
        sparkline: sparklineSets.orders,
        tone: 'wine',
      },
      {
        label: 'Today\'s Revenue',
        value: formatCurrency(stats.todayRevenue),
        change: 11,
        description: 'prime dinner service',
        icon: TrendingUp,
        sparkline: sparklineSets.revenue,
        tone: 'gold',
      },
      {
        label: 'Active Reservations',
        value: stats.activeReservations.toLocaleString(),
        change: 7,
        description: 'confirmed and queued',
        icon: CalendarDays,
        sparkline: sparklineSets.reservations,
        tone: 'peach',
      },
      {
        label: 'Available Tables',
        value: stats.availableTables.toLocaleString(),
        change: 5,
        description: 'ready for seating',
        icon: Layers3,
        sparkline: sparklineSets.tables,
        tone: 'green',
      },
      {
        label: 'Low Stock Items',
        value: stats.lowStockItems.toLocaleString(),
        change: -4,
        description: 'requires attention',
        icon: AlertTriangle,
        sparkline: sparklineSets.stock,
        tone: 'wine',
      },
      {
        label: 'Customer Satisfaction',
        value: `${stats.customerSatisfaction}%`,
        change: 2,
        description: 'guest feedback score',
        icon: Sparkles,
        sparkline: sparklineSets.satisfaction,
        tone: 'gold',
      },
    ],
    [stats],
  );

  const quickActions = [
    { label: 'Open Orders', action: () => navigate('/orders') },
    { label: 'Seat Guests', action: () => navigate('/reservations') },
    { label: 'Restock Inventory', action: () => navigate('/inventory') },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-premium" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-[360px] animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          <div className="h-[360px] animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[36px] border border-gold/25 bg-wine p-6 text-cream shadow-[0_28px_80px_rgba(107,30,30,0.22)] lg:p-8">
        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cream/90 backdrop-blur-md">
              <Sparkles size={14} /> DINE' IN operations center
            </div>
            <div>
              <h1 className="text-4xl font-semibold leading-tight text-cream sm:text-5xl">
                Welcome back, 
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-cream/85 sm:text-base">
                Today is {format(now, 'EEEE, dd MMMM yyyy')} at {format(now, 'h:mm a')}. The floor is active, reservations are moving, and the kitchen queue is ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/60">Shift mood</p>
                <p className="mt-1 font-semibold text-cream">Warm dinner service</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/60">Floor status</p>
                <p className="mt-1 font-semibold text-cream">Ready for peak seating</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            {quickActions.map((action) => (
              <Button key={action.label} variant={action.label === 'Open Orders' ? 'warning' : 'secondary'} onClick={action.action}>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow="Live overview"
        title="Restaurant performance"
        description="Operational metrics, revenue signals, and service flow with the warmth of a hospitality-first control room."
        action={
          <Button variant="outline" onClick={fetchDashboard}>
            <Clock3 size={16} /> Refresh live data
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orderBoard.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Revenue pulse</p>
              <h3 className="mt-2 text-2xl font-semibold text-charcoal">Daily and weekly revenue</h3>
            </div>
            <Badge text="Today trending +11%" variant="success" size="sm" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-softgray">Daily revenue</p>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9D7C9" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
                  <Tooltip {...chartTooltip} formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Area type="monotone" dataKey="value" stroke="#6B1E1E" strokeWidth={3} fill="#F8D7C4" fillOpacity={0.45} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-softgray">Weekly revenue</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9D7C9" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
                  <Tooltip {...chartTooltip} formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Bar dataKey="value" radius={[16, 16, 6, 6]} fill="#D4A056" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Table occupancy</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Service room utilization</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Tooltip {...chartTooltip} />
              <Pie dataKey="value" data={[
                { name: 'Available', value: stats.availableTables, color: '#2F8F5B' },
                { name: 'Reserved', value: stats.reservedTables, color: '#D4A056' },
                { name: 'Occupied', value: stats.occupiedTables, color: '#6B1E1E' },
              ]} innerRadius={78} outerRadius={112} paddingAngle={4}>
                {[{ color: '#2F8F5B' }, { color: '#D4A056' }, { color: '#6B1E1E' }].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            {[
              { label: 'Available', value: stats.availableTables, color: 'bg-olive' },
              { label: 'Reserved', value: stats.reservedTables, color: 'bg-gold' },
              { label: 'Occupied', value: stats.occupiedTables, color: 'bg-wine' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/70 p-3">
                <div className={`mb-2 h-2.5 w-10 rounded-full ${item.color}`} />
                <p className="text-xs uppercase tracking-[0.16em] text-softgray">{item.label}</p>
                <p className="mt-1 text-xl font-semibold text-charcoal">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Ordering rhythm</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Peak ordering hours</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D7C9" vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="value" radius={[16, 16, 6, 6]} fill="#6B1E1E" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center gap-3 text-sm text-softgray">
            <Flame size={16} className="text-gold" />
            Dinner service peaks around 7 PM. Staff the floor accordingly.
          </div>
        </Card>

        <Card>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Reservations</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Reservation trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={reservationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D7C9" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
              <Tooltip {...chartTooltip} />
              <Area type="monotone" dataKey="value" stroke="#D4A056" strokeWidth={3} fill="#D4A056" fillOpacity={0.28} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Top dishes</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Popular menu items</h3>
          </div>
          <div className="space-y-4">
            {popularItems.map((item) => (
              <div key={item.name} className="rounded-[22px] bg-white/75 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-charcoal">{item.name}</p>
                    <p className="mt-1 text-sm text-softgray">Guest demand index</p>
                  </div>
                  <Badge text={`${item.value}%`} variant={item.value > 80 ? 'success' : 'info'} size="sm" />
                </div>
                <div className="mt-3 h-2 rounded-full bg-beige/55">
                  <div className="h-2 rounded-full bg-wine" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Order flow</p>
              <h3 className="mt-2 text-2xl font-semibold text-charcoal">Order status breakdown</h3>
            </div>
            <Badge text="Real-time" variant="success" size="sm" />
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip {...chartTooltip} />
                <Pie data={statusBreakdown} dataKey="value" innerRadius={78} outerRadius={108} paddingAngle={4}>
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`status-${entry.name}`} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {statusBreakdown.map((entry, index) => (
                <div key={entry.name} className="rounded-[20px] bg-white/75 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                      <span className="font-medium text-charcoal">{entry.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-softgray">{entry.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Front of house</p>
              <h3 className="mt-2 text-2xl font-semibold text-charcoal">Upcoming reservations</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/reservations')}>
              View schedule <ArrowRight size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {reservationRows.length === 0 ? (
              <p className="rounded-[22px] bg-white/75 p-4 text-sm text-softgray">No upcoming reservations right now.</p>
            ) : (
              reservationRows.map((reservation) => (
                <div key={reservation._id} className="rounded-[22px] bg-white/75 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-charcoal">{reservation.customerName}</p>
                      <p className="mt-1 text-sm text-softgray">
                        Table {reservation.table?.tableNumber || '—'} · {reservation.guests || 0} guests
                      </p>
                      <p className="mt-2 text-sm text-softgray">
                        {reservation.reservationTime ? format(new Date(reservation.reservationTime), 'dd MMM, h:mm a') : 'Time not set'}
                      </p>
                    </div>
                    <Badge text={reservation.status || 'pending'} variant={reservation.status === 'confirmed' ? 'success' : 'warning'} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Alerts</p>
              <h3 className="mt-2 text-2xl font-semibold text-charcoal">Low stock watchlist</h3>
            </div>
            <Badge text={`${lowStockRows.length} items`} variant="warning" size="sm" />
          </div>
          <div className="space-y-3">
            {lowStockRows.length === 0 ? (
              <p className="rounded-[22px] bg-white/75 p-4 text-sm text-softgray">No low-stock alerts at the moment.</p>
            ) : (
              lowStockRows.map((item) => (
                <div key={item._id} className="rounded-[22px] bg-white/75 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-charcoal">{item.itemName || item.name}</p>
                      <p className="mt-1 text-sm text-softgray">{item.category || 'Ingredient'} · {item.unit || 'units'}</p>
                    </div>
                    <AlertTriangle size={18} className="text-gold" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-softgray">
                    <span>Stock {item.stockLevel ?? item.stockQuantity ?? 0}</span>
                    <span>Threshold {item.thresholdLevel ?? 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Service log</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Recent orders</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
            Open command center <ArrowRight size={16} />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-softgray">
                <th className="px-4 py-2 font-semibold">Order</th>
                <th className="px-4 py-2 font-semibold">Customer</th>
                <th className="px-4 py-2 font-semibold">Table</th>
                <th className="px-4 py-2 font-semibold">Items</th>
                <th className="px-4 py-2 font-semibold">Time</th>
                <th className="px-4 py-2 font-semibold">Amount</th>
                <th className="px-4 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => {
                const items = order.items || [];
                const status = order.orderStatus || order.status || 'pending';
                return (
                  <tr key={order._id || `${order.orderNumber}-${index}`} className="rounded-[22px] bg-white/75 transition-all hover:-translate-y-0.5 hover:bg-white">
                    <td className="rounded-l-[22px] px-4 py-4 font-semibold text-charcoal">{order.orderNumber || '—'}</td>
                    <td className="px-4 py-4 text-softgray">{order.customerName || order.guestName || 'Guest order'}</td>
                    <td className="px-4 py-4 text-softgray">Table {order.table?.tableNumber || '—'}</td>
                    <td className="px-4 py-4 text-softgray">{items.length} line items</td>
                    <td className="px-4 py-4 text-softgray">{format(new Date(order.createdAt || Date.now()), 'HH:mm')}</td>
                    <td className="px-4 py-4 font-semibold text-charcoal">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-4"><Badge text={status} variant={status === 'completed' ? 'success' : status === 'cancelled' ? 'error' : status === 'ready' ? 'warning' : 'info'} size="sm" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
