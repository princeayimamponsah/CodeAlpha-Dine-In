import React from 'react';
import { Badge, Button, Card, SectionHeader } from '../components/UI';
import { useAuthStore } from '../context/store';
import { CalendarClock, Coffee, Mail, Phone, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

const staff = [
  {
    name: 'Mia Laurent',
    role: 'Floor Manager',
    status: 'On shift',
    tone: 'wine',
    hours: '8h 40m',
    initials: 'ML',
    email: 'mia@dine-in.com',
    phone: '+1 555 011 202',
    permissions: ['Reservations', 'Floor', 'Guest issues'],
  },
  {
    name: 'Noah Patel',
    role: 'Head Server',
    status: 'Break',
    tone: 'peach',
    hours: '6h 10m',
    initials: 'NP',
    email: 'noah@dine-in.com',
    phone: '+1 555 013 014',
    permissions: ['Orders', 'Table service', 'Payments'],
  },
  {
    name: 'Emma Cruz',
    role: 'Host',
    status: 'Available',
    tone: 'olive',
    hours: '7h 05m',
    initials: 'EC',
    email: 'emma@dine-in.com',
    phone: '+1 555 017 211',
    permissions: ['Welcome', 'Seating', 'Reservations'],
  },
  {
    name: 'Lucas Reed',
    role: 'Bar Supervisor',
    status: 'On shift',
    tone: 'gold',
    hours: '9h 15m',
    initials: 'LR',
    email: 'lucas@dine-in.com',
    phone: '+1 555 020 934',
    permissions: ['Beverages', 'Inventory', 'Quality checks'],
  },
];

const toneClass = {
  wine: 'bg-wine',
  peach: 'bg-gold',
  olive: 'bg-olive',
  gold: 'bg-charcoal',
};

export const StaffPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="People"
        title="Staff management"
        description="A premium, human-centered directory for roles, shifts, coverage, and permissions."
        action={isAdmin ? <Button variant="primary">Add team member</Button> : null}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'On shift', value: 14, icon: UserRound, tone: 'wine' },
          { label: 'Break coverage', value: 6, icon: Coffee, tone: 'gold' },
          { label: 'Training complete', value: '92%', icon: ShieldCheck, tone: 'green' },
          { label: 'Guest rating', value: '4.9/5', icon: Sparkles, tone: 'peach' },
        ].map((item) => (
          <Card key={item.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">{item.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone === 'wine' ? 'bg-wine/10 text-wine' : item.tone === 'gold' ? 'bg-gold/18 text-gold' : item.tone === 'green' ? 'bg-olive/15 text-olive' : 'bg-peach/50 text-charcoal'}`}>
              <item.icon size={22} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {staff.map((member) => (
          <Card key={member.name} className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-semibold text-cream ${toneClass[member.tone]}`}>
                  {member.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal">{member.name}</h3>
                  <p className="text-sm text-softgray">{member.role}</p>
                </div>
              </div>
              <Badge text={member.status} variant={member.status === 'Available' ? 'success' : member.status === 'Break' ? 'warning' : 'info'} />
            </div>

            <div className="grid gap-3 text-sm text-softgray">
              <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3"><span className="inline-flex items-center gap-2"><CalendarClock size={16} className="text-wine" />Shift</span><span className="font-semibold text-charcoal">{member.hours}</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3"><span className="inline-flex items-center gap-2"><Phone size={16} className="text-wine" />Phone</span><span className="font-semibold text-charcoal">{member.phone}</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3"><span className="inline-flex items-center gap-2"><Mail size={16} className="text-wine" />Email</span><span className="font-semibold text-charcoal">{member.email}</span></div>
            </div>

            <div className="rounded-2xl bg-cream px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Permissions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {member.permissions.map((permission) => (
                  <Badge key={permission} text={permission} variant="default" size="sm" />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Schedule</Button>
              <Button variant="secondary" size="sm" className="flex-1">Details</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionHeader
          eyebrow="Coverage"
          title="Shift readiness"
          description="Operational signals for front-of-house confidence, staff wellbeing, and service continuity."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-wine/10 p-5">
            <ShieldCheck className="text-wine" />
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-softgray">Training complete</p>
            <p className="mt-2 text-3xl font-semibold text-charcoal">92%</p>
          </div>
          <div className="rounded-3xl bg-peach/45 p-5">
            <Coffee className="text-gold" />
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-softgray">Break coverage</p>
            <p className="mt-2 text-3xl font-semibold text-charcoal">6 staff</p>
          </div>
          <div className="rounded-3xl bg-olive/15 p-5">
            <Sparkles className="text-olive" />
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-softgray">Guest reviews</p>
            <p className="mt-2 text-3xl font-semibold text-charcoal">4.9/5</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StaffPage;
