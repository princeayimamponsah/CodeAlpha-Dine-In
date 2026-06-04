import React, { useState } from 'react';
import { Badge, Button, Card, Input, Select, SectionHeader, Textarea } from '../components/UI';
import { Bell, Lock, ShieldCheck, Store, User } from 'lucide-react';

const ToggleRow = ({ label, description, enabled, setEnabled }) => (
  <div className="flex items-start justify-between gap-4 rounded-[22px] bg-white/75 p-4">
    <div>
      <p className="font-semibold text-charcoal">{label}</p>
      <p className="mt-1 text-sm leading-6 text-softgray">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => setEnabled((value) => !value)}
      className={`relative h-7 w-12 rounded-full transition-all duration-300 ${enabled ? 'bg-wine' : 'bg-beige'}`}
      aria-pressed={enabled}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

export const SettingsPage = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Control room"
        title="Settings"
        description="Restaurant profile, business hours, alerts, and security controls arranged in a calm premium layout."
        action={<Button variant="primary"><ShieldCheck size={16} /> Save changes</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Business hours', value: '11:00 - 23:00', icon: Store, tone: 'wine' },
          { label: 'Currency', value: 'GHS', icon: User, tone: 'gold' },
          { label: 'Security', value: '2FA on', icon: Lock, tone: 'green' },
          { label: 'Alerts', value: 'Realtime', icon: Bell, tone: 'peach' },
        ].map((item) => (
          <Card key={item.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-charcoal">{item.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone === 'wine' ? 'bg-wine/10 text-wine' : item.tone === 'gold' ? 'bg-gold/18 text-gold' : item.tone === 'green' ? 'bg-olive/15 text-olive' : 'bg-peach/50 text-charcoal'}`}>
              <item.icon size={20} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Profile</p>
              <h3 className="text-2xl font-semibold text-charcoal">Personal details</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Full name" defaultValue="Avery Morgan" />
            <Input label="Email address" defaultValue="admin@dine-in.com" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Role">
              <option>Admin</option>
              <option>Manager</option>
              <option>Staff</option>
            </Select>
            <Input label="Phone" defaultValue="+1 555 010 202" />
          </div>
          <Textarea label="Bio" rows={4} defaultValue="Operations lead focused on guest service, premium floor experience, and efficient team coordination." />
        </Card>

        <div className="space-y-6">
          <Card className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <Store size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Restaurant</p>
                <h3 className="text-2xl font-semibold text-charcoal">Branch preferences</h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Restaurant name" defaultValue="DINE' IN" />
              <Input label="Default branch" defaultValue="Main Dining" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Timezone" defaultValue="UTC+01:00" />
              <Input label="Currency" defaultValue="GHS" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Tax rate" defaultValue="10%" />
              <Input label="Reservation lead time" defaultValue="30 minutes" />
            </div>
            <Textarea label="Branch notes" rows={3} defaultValue="Keep the front desk warm and the reservation pacing conservative during peak dinner hours." />
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/60 text-charcoal">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Notifications</p>
                <h3 className="text-2xl font-semibold text-charcoal">Communication settings</h3>
              </div>
            </div>

            <ToggleRow label="Email alerts" description="Receive urgent inventory and service updates by email." enabled={emailAlerts} setEnabled={setEmailAlerts} />
            <ToggleRow label="SMS alerts" description="Send critical alerts to the duty manager by text message." enabled={smsAlerts} setEnabled={setSmsAlerts} />
            <ToggleRow label="Night mode automation" description="Switch the interface palette when evening service begins." enabled={nightMode} setEnabled={setNightMode} />
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive/15 text-olive">
                <Lock size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Security</p>
                <h3 className="text-2xl font-semibold text-charcoal">Access protection</h3>
              </div>
            </div>

            <ToggleRow label="Two-factor authentication" description="Require a second verification step for admin logins." enabled={twoFactor} setEnabled={setTwoFactor} />
            <div className="rounded-[22px] bg-white/75 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-charcoal">Password policy</p>
                  <p className="mt-1 text-sm text-softgray">Refresh passwords every 90 days for elevated accounts.</p>
                </div>
                <Badge text="Strong" variant="success" size="sm" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
