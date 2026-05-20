import React, { useEffect, useState } from 'react';
import { Card, Button, SectionHeader, Badge } from '../components/UI';
import { authService } from '../services/apiServices';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await authService.getAllUsers();
      setUsers(data.data || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'staff' : 'admin';
    try {
      await authService.updateUserRole(user.id || user._id, newRole);
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Admin" title="User management" description="Manage user roles and access." />

      <div className="grid gap-4">
        {users.map((u) => (
          <Card key={u.id || u._id} className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-charcoal">{u.name}</h3>
              <p className="text-sm text-softgray">{u.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge text={u.role} variant={u.role === 'admin' ? 'info' : 'subtle'} />
              <Button variant="outline" size="sm" onClick={() => toggleRole(u)}>
                Toggle role
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
