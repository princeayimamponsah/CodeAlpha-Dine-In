import React from 'react';
import { Card, Badge, Button, SectionHeader } from '../components/UI';
import { Clock3, Coffee, Mail, Phone, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

const staff = [
  { name: 'Mia Laurent', role: 'Floor Manager', status: 'On shift', tone: 'wine', hours: '8h 40m', initials: 'ML' },
  { name: 'Noah Patel', role: 'Head Server', status: 'Break', tone: 'peach', hours: '6h 10m', initials: 'NP' },
  { name: 'Emma Cruz', role: 'Host', status: 'Available', tone: 'olive', hours: '7h 05m', initials: 'EC' },
  { name: 'Lucas Reed', role: 'Bar Supervisor', status: 'On shift', tone: 'gold', hours: '9h 15m', initials: 'LR' },
];

export const StaffPage = () => {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="People"
        title="Staff management"
        description="A premium, human-centered view of roles, shifts, and operational coverage."
        action={<Button variant="primary">Add team member</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {staff.map((member) => (
          <Card key={member.name} className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-semibold text-cream ${member.tone === 'wine' ? 'bg-wine' : member.tone === 'peach' ? 'bg-gold' : member.tone === 'olive' ? 'bg-olive' : 'bg-charcoal'}`}>
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
              <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3"><span className="inline-flex items-center gap-2"><Clock3 size={16} className="text-wine" />Shift</span><span className="font-semibold text-charcoal">{member.hours}</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3"><span className="inline-flex items-center gap-2"><Phone size={16} className="text-wine" />Phone</span><span className="font-semibold text-charcoal">Available</span></div>
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
          description="Operational signals for front-of-house confidence and service continuity."
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