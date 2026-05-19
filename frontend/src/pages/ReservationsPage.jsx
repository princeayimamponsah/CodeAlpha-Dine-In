import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Input, Select, Textarea, EmptyState, SectionHeader } from '../components/UI';
import { reservationService, tableService } from '../services/apiServices';
import { useNotificationStore } from '../context/store';
import { Plus, Calendar, Users, Phone } from 'lucide-react';
import { format } from 'date-fns';

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tables, setTables] = useState([]);
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
    fetchTables();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data } = await reservationService.getAllReservations({
        status: 'confirmed,pending',
      });
      setReservations(data.data);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to fetch reservations',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const { data } = await tableService.getAllTables();
      setTables(data.data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    if (!newReservation.customerName || !newReservation.phone || !newReservation.tableId || !newReservation.reservationTime) {
      addNotification({
        type: 'error',
        message: 'Please fill all required fields',
      });
      return;
    }

    try {
      const { data } = await reservationService.createReservation({
        customerName: newReservation.customerName,
        phone: newReservation.phone,
        email: newReservation.email,
        table: newReservation.tableId,
        reservationTime: newReservation.reservationTime,
        guests: parseInt(newReservation.guests),
        specialRequests: newReservation.specialRequests,
      });
      
      setReservations([data.data, ...reservations]);
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
      addNotification({
        type: 'success',
        message: 'Reservation created successfully',
      });
      fetchReservations();
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create reservation',
      });
    }
  };

  const statusColors = {
    pending: 'warning',
    confirmed: 'success',
    completed: 'success',
    cancelled: 'error',
  };

  if (loading) {
    return <div className="p-6 text-center">Loading reservations...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Guest flow"
        title="Reservations"
        description="Warm booking cards, table allocation, and approval-ready details for the host stand."
        action={<Button onClick={() => setIsModalOpen(true)} variant="primary">
          <Plus size={20} /> New Reservation
        </Button>}
      />

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Reservations"
          description="No reservations found"
        />
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation._id} variant="primary">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {reservation.customerName}
                    </h3>
                    <Badge text={reservation.status} variant={statusColors[reservation.status]} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <p className="font-semibold">{reservation.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <p className="font-semibold">{reservation.guests} Guests</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="font-semibold">
                        Table {reservation.table?.tableNumber}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {format(new Date(reservation.reservationTime), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Reservation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
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
        }}
        title="New Reservation"
        size="lg"
      >
        <form onSubmit={handleCreateReservation} className="space-y-4">
          <Input
            label="Customer Name *"
            value={newReservation.customerName}
            onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
            placeholder="John Doe"
          />

          <Input
            label="Phone Number *"
            value={newReservation.phone}
            onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />

          <Input
            label="Email"
            type="email"
            value={newReservation.email}
            onChange={(e) => setNewReservation({ ...newReservation, email: e.target.value })}
            placeholder="john@example.com"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Guests *
            </label>
            <Input
              type="number"
              min="1"
              value={newReservation.guests}
              onChange={(e) => setNewReservation({ ...newReservation, guests: e.target.value })}
              placeholder="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Table *
            </label>
            <Select
              value={newReservation.tableId}
              onChange={(e) => setNewReservation({ ...newReservation, tableId: e.target.value })}
            >
              <option value="">Choose a table...</option>
              {tables
                .filter((t) => t.status === 'available')
                .map((table) => (
                  <option key={table._id} value={table._id}>
                    Table {table.tableNumber} (Capacity: {table.capacity})
                  </option>
                ))}
            </Select>
          </div>

          <Input
            label="Reservation Time *"
            type="datetime-local"
            value={newReservation.reservationTime}
            onChange={(e) => setNewReservation({ ...newReservation, reservationTime: e.target.value })}
          />

          <Textarea
            label="Special Requests"
            value={newReservation.specialRequests}
            onChange={(e) => setNewReservation({ ...newReservation, specialRequests: e.target.value })}
            placeholder="Any special requests or dietary requirements?"
            rows="3"
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Create Reservation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
