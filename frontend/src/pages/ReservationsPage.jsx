import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Select,
  SectionHeader,
  Textarea,
} from '../components/UI';
import { reservationService, tableService } from '../services/apiServices';
import { useNotificationStore } from '../context/store';
import {
  CalendarDays,
  Clock3,
  Filter,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

const statusFilters = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const statusVariants = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'success',
  cancelled: 'error',
};

const formatReservationTime = (value) => (value ? format(new Date(value), 'dd MMM yyyy, HH:mm') : 'Time not set');

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [guestsFilter, setGuestsFilter] = useState('');
  const [newReservation, setNewReservation] = useState({
    customerName: '',
    phone: '',
    email: '',
    tableId: '',
    reservationTime: '',
    guests: '',
    specialRequests: '',
  });
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    fetchReservations();
  }, [activeFilter]);

  useEffect(() => {
    fetchTables(guestsFilter ? Number(guestsFilter) : null);
  }, [guestsFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeFilter !== 'all') {
        params.status = activeFilter;
      }
      const { data } = await reservationService.getAllReservations(params);
      setReservations(data.data || []);
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to load reservations' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async (guests = null) => {
    try {
      setTableLoading(true);
      const response = guests ? await tableService.getAvailableTables(guests) : await tableService.getAllTables();
      setTables(response.data.data || []);
    } catch (error) {
      setTables([]);
    } finally {
      setTableLoading(false);
    }
  };

  const handleCreateReservation = async (event) => {
    event.preventDefault();

    if (!newReservation.customerName || !newReservation.phone || !newReservation.tableId || !newReservation.reservationTime) {
      addNotification({ type: 'error', message: 'Please fill all required fields' });
      return;
    }

    try {
      const payload = {
        ...newReservation,
        guests: Number(newReservation.guests),
      };
      const { data } = await reservationService.createReservation(payload);
      setReservations((current) => [data.data, ...current]);
      setIsModalOpen(false);
      setNewReservation({
        customerName: '',
        phone: '',
        email: '',
        tableId: '',
        reservationTime: '',
        guests: '',
        specialRequests: '',
      });
      addNotification({ type: 'success', message: 'Reservation created successfully' });
      fetchReservations();
    } catch (error) {
      addNotification({ type: 'error', message: error.response?.data?.message || 'Failed to create reservation' });
    }
  };

  const updateReservationStatus = async (id, action) => {
    try {
      const actions = {
        confirm: reservationService.confirmReservation,
        complete: reservationService.completeReservation,
        cancel: reservationService.cancelReservation,
      };
      await actions[action](id);
      addNotification({ type: 'success', message: `Reservation ${action}ed successfully` });
      fetchReservations();
    } catch (error) {
      addNotification({ type: 'error', message: 'Unable to update reservation' });
    }
  };

  const filteredReservations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return reservations.filter((reservation) => {
      const matchesStatus = activeFilter === 'all' || reservation.status === activeFilter;
      const matchesSearch =
        !term ||
        [
          reservation.customerName,
          reservation.phone,
          reservation.email,
          reservation.table?.tableNumber,
          reservation.specialRequests,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [reservations, activeFilter, searchTerm]);

  const summary = useMemo(() => {
    return reservations.reduce(
      (accumulator, reservation) => {
        accumulator.total += 1;
        if (reservation.status === 'confirmed') accumulator.confirmed += 1;
        if (reservation.status === 'pending') accumulator.pending += 1;
        if (reservation.status === 'completed') accumulator.completed += 1;
        return accumulator;
      },
      { total: 0, confirmed: 0, pending: 0, completed: 0 },
    );
  }, [reservations]);

  const upcomingTimeline = [...filteredReservations]
    .sort((left, right) => new Date(left.reservationTime) - new Date(right.reservationTime))
    .slice(0, 6);

  const tableSuggestions = tables.slice(0, 6);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-premium" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="h-64 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          <div className="h-64 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Guest flow"
        title="Reservations"
        description="Elegant reservation management with clear status controls, table suggestions, and a calm timeline view."
        action={<Button onClick={() => setIsModalOpen(true)} variant="primary"><Sparkles size={16} /> New Reservation</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total reservations', value: summary.total, icon: CalendarDays, tone: 'wine' },
          { label: 'Pending', value: summary.pending, icon: Clock3, tone: 'gold' },
          { label: 'Confirmed', value: summary.confirmed, icon: Sparkles, tone: 'green' },
          { label: 'Completed', value: summary.completed, icon: Users, tone: 'peach' },
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

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-softgray" size={18} />
              <Input placeholder="Search guests, phone, table, or request..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="pl-11" />
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

          {filteredReservations.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No reservations found" description="Try a different search term or status filter." />
          ) : (
            <div className="space-y-3">
              {filteredReservations.map((reservation) => (
                <div key={reservation._id} className="rounded-[24px] bg-white/75 p-4 transition-all hover:-translate-y-0.5 hover:bg-white">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-charcoal">{reservation.customerName}</h3>
                        <Badge text={reservation.status} variant={statusVariants[reservation.status] || 'default'} size="sm" />
                      </div>
                      <div className="grid gap-3 text-sm text-softgray sm:grid-cols-2">
                        <div className="flex items-center gap-2"><Phone size={16} className="text-wine" />{reservation.phone}</div>
                        <div className="flex items-center gap-2"><MapPin size={16} className="text-gold" />Table {reservation.table?.tableNumber || '—'}</div>
                        <div className="flex items-center gap-2"><Users size={16} className="text-olive" />{reservation.guests} guests</div>
                        <div className="flex items-center gap-2"><Clock3 size={16} className="text-wine" />{formatReservationTime(reservation.reservationTime)}</div>
                      </div>
                      {reservation.specialRequests && (
                        <p className="rounded-2xl bg-cream px-4 py-3 text-sm leading-6 text-charcoal">
                          {reservation.specialRequests}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <Button variant="primary" size="sm" onClick={() => updateReservationStatus(reservation._id, 'confirm')}>Confirm</Button>
                          <Button variant="danger" size="sm" onClick={() => updateReservationStatus(reservation._id, 'cancel')}>Cancel</Button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <>
                          <Button variant="primary" size="sm" onClick={() => updateReservationStatus(reservation._id, 'complete')}>Complete</Button>
                          <Button variant="danger" size="sm" onClick={() => updateReservationStatus(reservation._id, 'cancel')}>Cancel</Button>
                        </>
                      )}
                      {(reservation.status === 'completed' || reservation.status === 'cancelled') && (
                        <Badge text="Archived" variant="default" size="sm" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Reservation timeline</p>
                <h3 className="mt-2 text-2xl font-semibold text-charcoal">Upcoming seating window</h3>
              </div>
              <Badge text="Live today" variant="success" size="sm" />
            </div>
            <div className="space-y-3">
              {upcomingTimeline.length === 0 ? (
                <p className="rounded-[22px] bg-white/75 p-4 text-sm text-softgray">No upcoming reservations in the current filter.</p>
              ) : (
                upcomingTimeline.map((reservation) => (
                  <div key={reservation._id} className="rounded-[22px] bg-white/75 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-charcoal">{reservation.customerName}</p>
                        <p className="mt-1 text-sm text-softgray">{formatReservationTime(reservation.reservationTime)}</p>
                      </div>
                      <Badge text={`Table ${reservation.table?.tableNumber || '—'}`} variant="info" size="sm" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">Suggested tables</p>
                <h3 className="mt-2 text-2xl font-semibold text-charcoal">Best seating options</h3>
              </div>
              <Badge text={tableLoading ? 'Loading' : 'Updated'} variant={tableLoading ? 'warning' : 'success'} size="sm" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tableSuggestions.length === 0 ? (
                <p className="rounded-[22px] bg-white/75 p-4 text-sm text-softgray">No table suggestions available.</p>
              ) : (
                tableSuggestions.map((table) => (
                  <div key={table._id} className="rounded-[22px] bg-white/75 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-charcoal">Table {table.tableNumber}</p>
                        <p className="mt-1 text-sm text-softgray">Capacity {table.capacity} · {table.location}</p>
                      </div>
                      <Badge text={table.status} variant={table.status === 'available' ? 'success' : table.status === 'reserved' ? 'warning' : 'error'} size="sm" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Reservation" size="lg">
        <form onSubmit={handleCreateReservation} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Customer Name *" value={newReservation.customerName} onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })} placeholder="John Doe" />
            <Input label="Phone Number *" value={newReservation.phone} onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Email" type="email" value={newReservation.email} onChange={(e) => setNewReservation({ ...newReservation, email: e.target.value })} placeholder="john@example.com" />
            <Input label="Reservation Time *" type="datetime-local" value={newReservation.reservationTime} onChange={(e) => setNewReservation({ ...newReservation, reservationTime: e.target.value })} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Guest Count *" type="number" min="1" value={newReservation.guests} onChange={(e) => {
              setNewReservation({ ...newReservation, guests: e.target.value, tableId: '' });
              setGuestsFilter(e.target.value);
            }} placeholder="4" />
            <Select label="Select Table *" value={newReservation.tableId} onChange={(e) => setNewReservation({ ...newReservation, tableId: e.target.value })}>
              <option value="">{newReservation.guests ? 'Choose a table...' : 'Enter guests first...'}</option>
              {tables.map((table) => (
                <option key={table._id} value={table._id}>
                  Table {table.tableNumber} · Capacity {table.capacity}
                </option>
              ))}
            </Select>
          </div>

          <Textarea label="Special Requests" rows={4} value={newReservation.specialRequests} onChange={(e) => setNewReservation({ ...newReservation, specialRequests: e.target.value })} placeholder="Allergies, anniversary note, preferred seating..." />

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1">Save reservation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReservationsPage;
