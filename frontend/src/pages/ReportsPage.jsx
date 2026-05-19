import React from 'react';
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
import { Download, TrendingUp, Users, UtensilsCrossed } from 'lucide-react';

const salesData = [
	{ month: 'Jan', revenue: 12200, orders: 280 },
	{ month: 'Feb', revenue: 13800, orders: 312 },
	{ month: 'Mar', revenue: 14150, orders: 336 },
	{ month: 'Apr', revenue: 15620, orders: 364 },
	{ month: 'May', revenue: 17180, orders: 398 },
	{ month: 'Jun', revenue: 18950, orders: 421 },
];

const cuisineMix = [
	{ name: 'Mains', value: 42, color: '#6D1F3D' },
	{ name: 'Desserts', value: 18, color: '#D4A373' },
	{ name: 'Beverages', value: 22, color: '#F7D6C2' },
	{ name: 'Starters', value: 18, color: '#7D8F69' },
];

const topMeals = [
	{ name: 'Truffle Risotto', orders: 182, share: 86 },
	{ name: 'Seared Salmon', orders: 164, share: 74 },
	{ name: 'Caramel Tart', orders: 146, share: 68 },
	{ name: 'Ginger Spritz', orders: 121, share: 59 },
];

export const ReportsPage = () => {
	const reportTooltip = {
		contentStyle: {
			background: 'rgba(255, 255, 255, 0.96)',
			border: '1px solid rgba(234, 215, 204, 0.8)',
			borderRadius: '18px',
			boxShadow: '0 16px 40px rgba(43, 43, 43, 0.12)',
		},
		labelStyle: { color: '#2B2B2B', fontWeight: 700 },
	};

	return (
		<div className="space-y-6">
			<SectionHeader
				eyebrow="Insight layer"
				title="Reports"
				description="Sales reports, order trends, and menu performance presented with a more editorial hospitality feel."
				action={<Button variant="primary"><Download size={16} /> Export report</Button>}
			/>

			<div className="grid gap-4 md:grid-cols-3">
				<Card variant="primary" className="flex items-center justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Monthly revenue</p>
						<p className="mt-2 text-3xl font-semibold text-charcoal">$98.4k</p>
					</div>
					<TrendingUp className="text-wine" />
				</Card>
				<Card variant="success" className="flex items-center justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Repeat guests</p>
						<p className="mt-2 text-3xl font-semibold text-charcoal">61%</p>
					</div>
					<Users className="text-olive" />
				</Card>
				<Card variant="warning" className="flex items-center justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Menu leaders</p>
						<p className="mt-2 text-3xl font-semibold text-charcoal">4 dishes</p>
					</div>
					<UtensilsCrossed className="text-gold" />
				</Card>
			</div>

			<div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
				<Card>
					<div className="mb-5 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Sales curve</p>
							<h3 className="mt-2 text-2xl font-semibold text-charcoal">Revenue and order growth</h3>
						</div>
						<Badge text="Quarterly" variant="info" size="sm" />
					</div>
					<ResponsiveContainer width="100%" height={320}>
						<AreaChart data={salesData}>
							<defs>
								<linearGradient id="reportsRevenue" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#6D1F3D" stopOpacity={0.32} />
									<stop offset="100%" stopColor="#F7D6C2" stopOpacity={0.05} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke="#EAD7CC" vertical={false} />
							<XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B' }} />
							<YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B' }} />
							<Tooltip {...reportTooltip} />
							<Area type="monotone" dataKey="revenue" stroke="#6D1F3D" strokeWidth={3} fill="url(#reportsRevenue)" />
						</AreaChart>
					</ResponsiveContainer>
				</Card>

				<Card>
					<div className="mb-5">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Cuisine mix</p>
						<h3 className="mt-2 text-2xl font-semibold text-charcoal">Order composition</h3>
					</div>
					<ResponsiveContainer width="100%" height={320}>
						<PieChart>
							<Tooltip {...reportTooltip} />
							<Pie data={cuisineMix} dataKey="value" innerRadius={72} outerRadius={118} paddingAngle={4}>
								{cuisineMix.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="mt-4 grid grid-cols-2 gap-2 text-sm text-softgray">
						{cuisineMix.map((item) => (
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
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Top dishes</p>
						<h3 className="mt-2 text-2xl font-semibold text-charcoal">Best sellers</h3>
					</div>
					<div className="space-y-4">
						{topMeals.map((item) => (
							<div key={item.name} className="rounded-[22px] bg-white/75 p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-semibold text-charcoal">{item.name}</p>
										<p className="text-sm text-softgray">{item.orders} orders this period</p>
									</div>
									<Badge text={`${item.share}% share`} variant="info" size="sm" />
								</div>
								<div className="mt-3 h-2 rounded-full bg-beige/60">
									<div className="h-2 rounded-full bg-gradient-to-r from-wine via-peach to-gold" style={{ width: `${item.share}%` }} />
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card>
					<div className="mb-5">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Trend summary</p>
						<h3 className="mt-2 text-2xl font-semibold text-charcoal">Performance notes</h3>
					</div>
					<ResponsiveContainer width="100%" height={240}>
						<BarChart data={salesData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#EAD7CC" vertical={false} />
							<XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B' }} />
							<YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6B6B' }} />
							<Tooltip {...reportTooltip} />
							<Bar dataKey="orders" radius={[14, 14, 4, 4]} fill="#D4A373" />
						</BarChart>
					</ResponsiveContainer>
					<div className="mt-4 space-y-3 text-sm text-softgray">
						<p>• Revenue has risen steadily over the last six months.</p>
						<p>• Guest retention is strongest around signature dinner services.</p>
						<p>• Dessert and beverage bundles are improving basket value.</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default ReportsPage;
