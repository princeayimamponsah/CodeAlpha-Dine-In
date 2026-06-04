import React, { useEffect, useMemo, useState } from 'react';
import { Card, Badge, Button, Modal, Input, Select, EmptyState, SectionHeader, Textarea } from '../components/UI';
import { tableService } from '../services/apiServices';
import { useNotificationStore, useAuthStore } from '../context/store';
import { MapPinned, Plus, ShieldCheck, Table2, Trash2, Users } from 'lucide-react';

const tableTone = {
  available: { badge: 'success', tone: 'bg-olive/15 text-olive' },
  reserved: { badge: 'warning', tone: 'bg-gold/18 text-gold' },
  occupied: { badge: 'error', tone: 'bg-wine/10 text-wine' },
  maintenance: { badge: 'default', tone: 'bg-slate-200 text-charcoal' },
};

const initialTable = {
  tableNumber: '',
  capacity: '',
  location: 'main',
  status: 'available',
  notes: '',
};

export const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [newTable, setNewTable] = useState(initialTable);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const { data } = await tableService.getAllTables();
      setTables(data.data || []);
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to fetch tables' });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTable(null);
    setNewTable(initialTable);
    setIsModalOpen(true);
  };

  const openEditModal = (table) => {
    setEditingTable(table);
    setNewTable({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location,
      status: table.status || 'available',
      notes: table.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveTable = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...newTable,
        tableNumber: Number(newTable.tableNumber),
        capacity: Number(newTable.capacity),
      };

      if (editingTable) {
        const { data } = await tableService.updateTable(editingTable._id, payload);
        setTables((current) => current.map((table) => (table._id === editingTable._id ? data.data : table)));
        addNotification({ type: 'success', message: 'Table updated successfully' });
      } else {
        const { data } = await tableService.createTable(payload);
        setTables((current) => [...current, data.data]);
        addNotification({ type: 'success', message: 'Table created successfully' });
      }

      setIsModalOpen(false);
      setEditingTable(null);
      setNewTable(initialTable);
    } catch (error) {
      addNotification({ type: 'error', message: error.response?.data?.message || 'Failed to save table' });
    }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm('Remove this table from the floor plan?')) {
      return;
    }

    try {
      await tableService.deleteTable(id);
      setTables((current) => current.filter((table) => table._id !== id));
      addNotification({ type: 'success', message: 'Table removed successfully' });
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to delete table' });
    }
  };

  const setTableStatus = async (id, status) => {
    try {
      await tableService.setTableStatus(id, status);
      setTables((current) => current.map((table) => (table._id === id ? { ...table, status } : table)));
      addNotification({ type: 'success', message: `Table marked ${status}` });
    } catch (error) {
      addNotification({ type: 'error', message: 'Unable to update table status' });
    }
  };

  const stats = useMemo(() => {
    return tables.reduce(
      (accumulator, table) => {
        accumulator.total += 1;
        accumulator[table.status || 'available'] = (accumulator[table.status || 'available'] || 0) + 1;
        return accumulator;
      },
      { total: 0, available: 0, reserved: 0, occupied: 0, maintenance: 0 },
    );
  }, [tables]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-[32px] border border-white/70 bg-white/70 shadow-premium" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-[28px] border border-white/70 bg-white/70 shadow-premium" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Floor plan"
        title="Tables"
        description="Live occupancy, reservation status, and refined floor management for the dining room."
        action={isAdmin ? <Button onClick={openCreateModal} variant="primary"><Plus size={16} /> Add Table</Button> : null}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'All tables', value: stats.total, icon: Table2, tone: 'wine' },
          { label: 'Available', value: stats.available, icon: ShieldCheck, tone: 'green' },
          { label: 'Reserved', value: stats.reserved, icon: MapPinned, tone: 'gold' },
          { label: 'Occupied', value: stats.occupied, icon: Users, tone: 'peach' },
        ].map((item) => (
          <Card key={item.label} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-softgray">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">{item.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone === 'wine' ? 'bg-wine/10 text-wine' : item.tone === 'green' ? 'bg-olive/15 text-olive' : item.tone === 'gold' ? 'bg-gold/18 text-gold' : 'bg-peach/50 text-charcoal'}`}>
              <item.icon size={22} />
            </div>
          </Card>
        ))}
      </div>

      {tables.length === 0 ? (
        <EmptyState icon={Table2} title="No tables yet" description="Create your first table to start mapping the floor." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tables.map((table) => {
            const tone = tableTone[table.status] || tableTone.available;
            return (
              <Card key={table._id} className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-wine" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-charcoal shadow-soft">
                        <Table2 size={20} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-charcoal">Table {table.tableNumber}</h3>
                        <p className="text-sm text-softgray capitalize">{table.location}</p>
                      </div>
                    </div>
                    <Badge text={table.status || 'available'} variant={tone.badge} size="sm" />
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${tone.tone}`}>
                    {table.capacity} seats
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-softgray">
                  <div className="flex items-center justify-between rounded-2xl bg-white/75 px-4 py-3"><span>Capacity</span><span className="font-semibold text-charcoal">{table.capacity}</span></div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/75 px-4 py-3"><span>Location</span><span className="font-semibold capitalize text-charcoal">{table.location}</span></div>
                </div>

                {table.notes && (
                  <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm leading-6 text-charcoal">
                    {table.notes}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {isAdmin ? (
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(table)}>Edit</Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(table)} disabled>View</Button>
                  )}
                  {table.status !== 'available' && (
                    <Button variant="outline" size="sm" onClick={() => setTableStatus(table._id, 'available')}>Free</Button>
                  )}
                  {table.status !== 'reserved' && (
                    <Button variant="warning" size="sm" onClick={() => setTableStatus(table._id, 'reserved')}>Reserve</Button>
                  )}
                  {table.status !== 'occupied' && (
                    <Button variant="danger" size="sm" onClick={() => setTableStatus(table._id, 'occupied')}>Occupy</Button>
                  )}
                  {isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => handleDeleteTable(table._id)}>
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTable(null); }} title={editingTable ? 'Edit Table' : 'Add Table'} size="lg">
        <form onSubmit={handleSaveTable} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Table Number *" type="number" value={newTable.tableNumber} onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })} required />
            <Input label="Capacity *" type="number" value={newTable.capacity} onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })} required />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Location" value={newTable.location} onChange={(e) => setNewTable({ ...newTable, location: e.target.value })}>
              <option value="main">Main Dining</option>
              <option value="terrace">Terrace</option>
              <option value="private">Private Room</option>
              <option value="bar">Bar Area</option>
            </Select>
            <Select label="Initial Status" value={newTable.status} onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </Select>
          </div>

          <Textarea label="Notes" rows={3} value={newTable.notes} onChange={(e) => setNewTable({ ...newTable, notes: e.target.value })} placeholder="Window seat, near service station, accessibility note..." />

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            {isAdmin && (
              <Button type="submit" variant="primary" className="flex-1">{editingTable ? 'Update Table' : 'Add Table'}</Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TablesPage;
