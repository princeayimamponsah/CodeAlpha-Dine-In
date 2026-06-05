import React, { useState } from 'react';
import { Badge, Button, Card, Input, Modal, Select, SectionHeader, Textarea } from '../components/UI';
import { useNotificationStore } from '../context/store';
import {
  getDefaultReceiptConfig,
  getReceiptConfig,
  resetReceiptConfig,
  saveReceiptConfig,
} from '../services/receiptConfig';
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [receiptConfig, setReceiptConfig] = useState(getReceiptConfig());

  const handleSaveReceiptConfig = () => {
    saveReceiptConfig(receiptConfig);
    addNotification({
      type: 'success',
      message: 'Receipt branding saved',
    });
  };

  const handleResetReceiptConfig = () => {
    resetReceiptConfig();
    setReceiptConfig(getDefaultReceiptConfig());
    addNotification({
      type: 'success',
      message: 'Receipt branding reset to defaults',
    });
  };

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

          <Card className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine">
                <Store size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Billing</p>
                <h3 className="text-2xl font-semibold text-charcoal">Receipt branding</h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Restaurant name"
                value={receiptConfig.name}
                onChange={(event) =>
                  setReceiptConfig((current) => ({ ...current, name: event.target.value }))
                }
              />
              <Input
                label="Tagline"
                value={receiptConfig.tagline}
                onChange={(event) =>
                  setReceiptConfig((current) => ({ ...current, tagline: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Address"
                value={receiptConfig.address}
                onChange={(event) =>
                  setReceiptConfig((current) => ({ ...current, address: event.target.value }))
                }
              />
              <Input
                label="Phone"
                value={receiptConfig.phone}
                onChange={(event) =>
                  setReceiptConfig((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </div>
            <Textarea
              label="Receipt footer note"
              rows={3}
              value={receiptConfig.footerNote}
              onChange={(event) =>
                setReceiptConfig((current) => ({ ...current, footerNote: event.target.value }))
              }
            />

            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={handleSaveReceiptConfig}>
                Save receipt branding
              </Button>
              <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
                Preview Receipt
              </Button>
              <Button variant="outline" onClick={handleResetReceiptConfig}>
                Reset to defaults
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Receipt Preview"
        size="lg"
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-beige/70 bg-peach/35 p-4 text-center">
            <h3 className="text-lg font-semibold text-charcoal">{receiptConfig.name || 'DINE-IN RESTAURANT'}</h3>
            <p className="mt-1 text-sm text-softgray">{receiptConfig.tagline || 'Premium Hospitality Operations'}</p>
            <p className="mt-2 text-sm text-softgray">{receiptConfig.address || 'Accra, Ghana'} · {receiptConfig.phone || '+233 000 000 000'}</p>
          </div>

          <div className="rounded-2xl bg-white/75 p-4 text-sm text-charcoal">
            <div className="flex items-center justify-between">
              <span>Order</span>
              <span className="font-semibold">ORD-2026-00021</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Table</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Cashier</span>
              <span className="font-semibold">Admin User</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Payment Method</span>
              <span className="font-semibold">Cash</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white/75 p-4 text-sm text-charcoal">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Bill Summary</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Jollof Rice x1</span>
                <span className="font-semibold">GHS 35.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Coke x1</span>
                <span className="font-semibold">GHS 10.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Chicken x1</span>
                <span className="font-semibold">GHS 25.00</span>
              </div>
            </div>
            <div className="mt-4 border-t border-beige/60 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <span>Subtotal</span>
                <span>GHS 70.00</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span>Tax</span>
                <span>GHS 7.00</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>GHS 77.00</span>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-softgray">
            {receiptConfig.footerNote || 'Thank you for dining with us. Please come again.'}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
