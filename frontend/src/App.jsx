import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/store';
import { AppShell } from './components/Layout';
import { Toast, LoadingSpinner } from './components/UI';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { authService } from './services/apiServices';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { MenuPage } from './pages/MenuPage';
import { TablesPage } from './pages/TablesPage';
import { InventoryPage } from './pages/InventoryPage';
import { StaffPage } from './pages/StaffPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import {
  BarChart3,
  ShoppingCart,
  Calendar,
  UtensilsCrossed,
  Table2,
  Package,
  Users,
  Receipt,
  BarChart2,
  Settings,
} from 'lucide-react';
import './index.css';

const navigation = [
  { id: 1, label: 'Dashboard', path: '/dashboard', icon: BarChart3, roles: ['admin', 'staff'] },
  { id: 2, label: 'Orders', path: '/orders', icon: ShoppingCart, roles: ['admin', 'staff'] },
  { id: 3, label: 'Menu Items', path: '/menu', icon: UtensilsCrossed, roles: ['admin'] },
  { id: 4, label: 'Reservations', path: '/reservations', icon: Calendar, roles: ['admin', 'staff'] },
  { id: 5, label: 'Tables', path: '/tables', icon: Table2, roles: ['admin'] },
  { id: 6, label: 'Inventory', path: '/inventory', icon: Package, roles: ['admin'] },
  { id: 7, label: 'Staff', path: '/staff', icon: Users, roles: ['admin'] },
  { id: 8, label: 'Transactions', path: '/transactions', icon: Receipt, roles: ['admin'] },
  { id: 9, label: 'Reports', path: '/reports', icon: BarChart2, roles: ['admin'] },
  { id: 10, label: 'Settings', path: '/settings', icon: Settings, roles: ['admin', 'staff'] },
  { id: 11, label: 'Users', path: '/admin/users', icon: Users, roles: ['admin'] },
];

function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const { user, token, isAuthenticated, loadAuthFromStorage, updateUser, logout } = useAuthStore();

  useEffect(() => {
    loadAuthFromStorage();
    // Set dark mode based on system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
    setIsBootstrapping(false);
  }, []);

  useEffect(() => {
    const refreshUserRole = async () => {
      if (!isAuthenticated || !token) {
        return;
      }

      try {
        const { data } = await authService.me();
        if (data?.data) {
          updateUser(data.data);
        }
      } catch (error) {
        console.error('Failed to refresh authenticated user profile:', error);
        logout();
      }
    };

    refreshUserRole();
  }, [isAuthenticated, token, updateUser, logout]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (isBootstrapping) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toast />
      </>
    );
  }

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <AppShell
          navigation={navigation}
          isDark={isDark}
          setIsDark={setIsDark}
          mobileOpen={isSidebarOpen}
          setMobileOpen={setIsSidebarOpen}
        >
          <Routes>
            <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute user={user}>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute user={user}>
                  <ReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu"
              element={
                <ProtectedRoute user={user}>
                  {user?.role === 'admin' ? <MenuPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables"
              element={
                <ProtectedRoute user={user}>
                  {user?.role === 'admin' ? <TablesPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute user={user}>
                  {user?.role === 'admin' ? <InventoryPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute user={user}>
                  {user?.role === 'admin' ? <StaffPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute user={user}>
                  {user?.role === 'admin' ? <TransactionsPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute user={user}>
                  {user?.role === 'admin' ? <ReportsPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute user={user}>
                  {user?.role === 'admin' ? <AdminUsersPage /> : <Navigate to="/dashboard" replace />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute user={user}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppShell>

        <Toast />
      </div>
    </Router>
  );
}

export default App;
