import React, { useMemo, useState } from 'react';
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
import { Badge, Button, Card, Input, SectionHeader } from '../components/UI';
import { Download, FileSpreadsheet, FileText, FileUp, TrendingUp, Users, UtensilsCrossed } from 'lucide-react';

const monthlySales = [
  { month: 'Jan', revenue: 48200, orders: 980 },
  { month: 'Feb', revenue: 51400, orders: 1040 },
  { month: 'Mar', revenue: 54800, orders: 1105 },
  { month: 'Apr', revenue: 60120, orders: 1188 },
  { month: 'May', revenue: 63840, orders: 1234 },
  { month: 'Jun', revenue: 68460, orders: 1280 },
];

const topItems = [
  { name: 'Truffle Risotto', orders: 182, share: 86 },
  { name: 'Seared Salmon', orders: 164, share: 74 },
  { name: 'Caramel Tart', orders: 146, share: 68 },
  { name: 'Ginger Spritz', orders: 121, share: 59 },
];

const inventoryMix = [
  { name: 'Produce', value: 31, color: '#6B1E1E' },
  { name: 'Dairy', value: 18, color: '#D4A056' },
  { name: 'Meat', value: 27, color: '#F8D7C4' },
  { name: 'Dry Goods', value: 24, color: '#2F8F5B' },
];

const tableUsage = [
  { table: 'T1', value: 62 },
  { table: 'T2', value: 71 },
  { table: 'T3', value: 55 },
  { table: 'T4', value: 78 },
  { table: 'T5', value: 69 },
  { table: 'T6', value: 83 },
];

const mealCategory = [
  { name: 'Mains', value: 42, color: '#6B1E1E' },
  { name: 'Desserts', value: 18, color: '#D4A056' },
  { name: 'Beverages', value: 22, color: '#F8D7C4' },
  { name: 'Starters', value: 18, color: '#2F8F5B' },
];

const tooltipStyle = {
  contentStyle: {
    background: 'rgba(255, 249, 245, 0.98)',
    border: '1px solid rgba(233, 215, 201, 0.95)',
    borderRadius: '18px',
    boxShadow: '0 18px 50px rgba(43, 43, 43, 0.12)',
  },
  labelStyle: { color: '#2B2B2B', fontWeight: 700 },
};

export const ReportsPage = () => {
  const [range, setRange] = useState('90d');

  const reportSummary = useMemo(() => [
    { label: 'Monthly revenue', value: 'GHS 98.4k', tone: 'wine', icon: TrendingUp },
    { label: 'Repeat guests', value: '61%', tone: 'green', icon: Users },
    { label: 'Top dishes', value: '4 items', tone: 'gold', icon: UtensilsCrossed },
  ], []);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Insight layer"
        title="Reports"
        description="Executive-level analytics for sales, menu performance, table usage, and inventory consumption."
        action={<Button variant="primary"><Download size={16} /> Export report</Button>}
      />

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Report filters</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Choose a reporting window</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['7d', '30d', '90d', '12m'].map((item) => (
              <button
                key={item}
                onClick={() => setRange(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${range === item ? 'bg-wine text-cream shadow-[0_14px_30px_rgba(107,30,30,0.18)]' : 'border border-beige/70 bg-white/70 text-softgray hover:bg-peach/35 hover:text-charcoal'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {reportSummary.map((item) => (
            <div key={item.label} className="rounded-[24px] bg-white/75 p-5">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone === 'wine' ? 'bg-wine/10 text-wine' : item.tone === 'green' ? 'bg-olive/15 text-olive' : 'bg-gold/18 text-gold'}`}>
                <item.icon size={20} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Sales curve</p>
              <h3 className="mt-2 text-2xl font-semibold text-charcoal">Revenue and order growth</h3>
            </div>
            <Badge text={range} variant="info" size="sm" />
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D7C9" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B' }} />
              <Tooltip {...tooltipStyle} formatter={(value, name) => [name === 'revenue' ? `GHS ${Number(value).toLocaleString()}` : value, name]} />
              <Area type="monotone" dataKey="revenue" stroke="#6B1E1E" strokeWidth={3} fill="#F8D7C4" fillOpacity={0.45} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Category mix</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Sales composition</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Tooltip {...tooltipStyle} />
              <Pie data={mealCategory} dataKey="value" innerRadius={72} outerRadius={118} paddingAngle={4}>
                {mealCategory.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-softgray">
            {mealCategory.map((item) => (
              <div key={item.name} className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Top dishes</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Best sellers</h3>
          </div>
          <div className="space-y-4">
            {topItems.map((item) => (
              <div key={item.name} className="rounded-[22px] bg-white/75 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-charcoal">{item.name}</p>
                    <p className="text-sm text-softgray">{item.orders} orders this period</p>
                  </div>
                  <Badge text={`${item.share}% share`} variant="info" size="sm" />
                </div>
                <div className="mt-3 h-2 rounded-full bg-beige/60">
                  <div className="h-2 rounded-full bg-wine" style={{ width: `${item.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Operational usage</p>
              <h3 className="mt-2 text-2xl font-semibold text-charcoal">Most reserved tables</h3>
            </div>
            <FileText className="text-gold" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={tableUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D7C9" vertical={false} />
              <XAxis dataKey="table" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B' }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[14, 14, 4, 4]} fill="#D4A056" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge text="PDF" variant="success" size="sm" />
            <Badge text="Excel" variant="warning" size="sm" />
            <Badge text="CSV" variant="info" size="sm" />
            <Badge text="Inventory consumption" variant="default" size="sm" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Inventory consumption</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Ingredient pressure by category</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Tooltip {...tooltipStyle} />
              <Pie data={inventoryMix} dataKey="value" innerRadius={76} outerRadius={112} paddingAngle={4}>
                {inventoryMix.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Executive notes</p>
            <h3 className="mt-2 text-2xl font-semibold text-charcoal">Actionable summary</h3>
          </div>
          <div className="space-y-3 text-sm leading-6 text-softgray">
            <p>• Revenue continues to climb, with Friday and Saturday carrying the strongest dinner volume.</p>
            <p>• Signature mains dominate guest demand; dessert bundles are improving basket value.</p>
            <p>• Reserve more premium tables during the 7 PM service window to reduce wait times.</p>
            <p>• Inventory pressure is concentrated in produce and dairy, so restock planning should lead by one day.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline"><FileSpreadsheet size={16} /> Excel export</Button>
            <Button variant="secondary"><FileUp size={16} /> CSV export</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
