import React from 'react';
import { Badge, Button, Card, SectionHeader } from '../components/UI';
import { Download, Receipt, TrendingUp, WalletCards } from 'lucide-react';

const transactions = [
  { ref: 'TX-7812', guest: 'Olivia Stone', amount: '$128.40', method: 'Card', status: 'Settled' },
  { ref: 'TX-7811', guest: 'Aiden Brooks', amount: '$76.20', method: 'Cash', status: 'Settled' },
  { ref: 'TX-7810', guest: 'Sophia Lane', amount: '$94.90', method: 'Mobile', status: 'Pending' },
  { ref: 'TX-7809', guest: 'Ethan Clark', amount: '$210.10', method: 'Card', status: 'Refunded' },
];

export const TransactionsPage = () => {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Payments"
        title="Transactions"
        description="Clear revenue tracking with elegant summaries, payment status, and downloadable receipts."
        action={<Button variant="primary"><Download size={16} /> Export receipts</Button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Today’s settled</p>
            <p className="mt-2 text-3xl font-semibold text-charcoal">$4,820</p>
          </div>
          <WalletCards className="text-wine" />
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Pending</p>
            <p className="mt-2 text-3xl font-semibold text-charcoal">$640</p>
          </div>
          <Receipt className="text-gold" />
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Revenue trend</p>
            <p className="mt-2 text-3xl font-semibold text-charcoal">+14.2%</p>
          </div>
          <TrendingUp className="text-olive" />
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-softgray">
                <th className="px-4 py-2 font-semibold">Ref</th>
                <th className="px-4 py-2 font-semibold">Guest</th>
                <th className="px-4 py-2 font-semibold">Amount</th>
                <th className="px-4 py-2 font-semibold">Method</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.ref} className="rounded-2xl bg-white/75 transition-all hover:-translate-y-0.5 hover:bg-white">
                  <td className="rounded-l-2xl px-4 py-4 font-semibold text-charcoal">{item.ref}</td>
                  <td className="px-4 py-4 text-softgray">{item.guest}</td>
                  <td className="px-4 py-4 font-semibold text-charcoal">{item.amount}</td>
                  <td className="px-4 py-4 text-softgray">{item.method}</td>
                  <td className="px-4 py-4"><Badge text={item.status} variant={item.status === 'Settled' ? 'success' : item.status === 'Pending' ? 'warning' : 'error'} /></td>
                  <td className="rounded-r-2xl px-4 py-4"><Button variant="outline" size="sm">Receipt</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TransactionsPage;