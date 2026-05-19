import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Input, Select, EmptyState, SectionHeader } from '../components/UI';
import { tableService } from '../services/apiServices';
import { useNotificationStore } from '../context/store';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

export const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: '',
    location: 'main',
  });
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const { data } = await tableService.getAllTables();
      setTables(data.data);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to fetch tables',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTable = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        const { data } = await tableService.updateTable(editingTable._id, newTable);
        setTables(tables.map((t) => (t._id === editingTable._id ? data.data : t)));
        addNotification({ type: 'success', message: 'Table updated successfully' });
      } else {
        const { data } = await tableService.createTable(newTable);
        setTables([...tables, data.data]);
        addNotification({ type: 'success', message: 'Table created successfully' });
      }
      setIsModalOpen(false);
      setEditingTable(null);
      setNewTable({ tableNumber: '', capacity: '', location: 'main' });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to save table',
      });
    }
  };

  const handleDeleteTable = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await tableService.deleteTable(id);
        setTables(tables.filter((t) => t._id !== id));
        addNotification({ type: 'success', message: 'Table deleted successfully' });
      } catch (error) {
        addNotification({ type: 'error', message: 'Failed to delete table' });
      }
    }
  };

  const statusColors = {
    available: 'success',
    reserved: 'warning',
    occupied: 'info',
  };

  if (loading) {
    return <div className="p-6 text-center">Loading tables...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Floor plan"
        title="Tables"
        description="Live occupancy, reservation status, and an elegant floor management surface."
        action={<Button onClick={() => {
          setEditingTable(null);
          setNewTable({ tableNumber: '', capacity: '', location: 'main' });
          setIsModalOpen(true);
        }} variant="primary">
          <Plus size={20} /> Add Table
        </Button>}
      />

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Tables"
          description="No tables found. Add your first table to get started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <Card key={table._id} className="relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  onClick={() => {
                    setEditingTable(table);
                    setNewTable({
                      tableNumber: table.tableNumber,
                      capacity: table.capacity,
                      location: table.location,
                    });
                    setIsModalOpen(true);
                  }}
                  variant="secondary"
                  size="sm"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  onClick={() => handleDeleteTable(table._id)}
                  variant="danger"
                  size="sm"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-charcoal">
                  Table {table.tableNumber}
                </h3>
                <Badge text={table.status} variant={statusColors[table.status]} size="sm" />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-softgray">Capacity</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Users size={16} /> {table.capacity}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-softgray">Location</span>
                  <span className="font-semibold capitalize">{table.location}</span>
                </div>

                {table.notes && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="italic text-softgray">{table.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTable(null);
        }}
        title={editingTable ? 'Edit Table' : 'Add Table'}
      >
        <form onSubmit={handleSaveTable} className="space-y-4">
          <Input
            label="Table Number *"
            type="number"
            value={newTable.tableNumber}
            onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
            required
          />

          <Input
            label="Capacity *"
            type="number"
            value={newTable.capacity}
            onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <Select
              label="Location"
              value={newTable.location}
              onChange={(e) => setNewTable({ ...newTable, location: e.target.value })}
            >
              <option value="main">Main Dining</option>
              <option value="patio">Patio</option>
              <option value="private">Private</option>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingTable ? 'Update Table' : 'Add Table'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
