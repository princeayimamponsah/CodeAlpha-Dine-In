import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/store';
import { AppShell } from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Toast, LoadingSpinner } from './components/UI';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { authService } from './services/apiServices';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { AvailableMenusPage } from './pages/AvailableMenusPage';
import { SettingsPage } from './pages/SettingsPage';

const MenuPage = lazy(() => import('./pages/MenuPage'));
const TablesPage = lazy(() => import('./pages/TablesPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const StaffPage = lazy(() => import('./pages/StaffPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
import {
  BarChart3,
  ShoppingCart,
  Calendar,
  UtensilsCrossed,
  Table2,
  Package,
  Users,
  BarChart2,
  Settings,
} from 'lucide-react';
import './index.css';

const navigation = [
  { id: 1, label: 'Dashboard', path: '/dashboard', icon: BarChart3, roles: ['admin', 'staff'], category: 'Operations' },
  { id: 2, label: 'Orders', path: '/orders', icon: ShoppingCart, roles: ['admin', 'staff'], category: 'Operations' },
  { id: 3, label: 'Menu', path: '/menu', icon: UtensilsCrossed, roles: ['admin', 'staff'], category: 'Operations' },
  { id: 4, label: 'Reservations', path: '/reservations', icon: Calendar, roles: ['admin', 'staff'], category: 'Operations' },
  { id: 5, label: 'Tables', path: '/tables', icon: Table2, roles: ['admin', 'staff'], category: 'Operations' },
  { id: 6, label: 'Inventory', path: '/inventory', icon: Package, roles: ['admin'], category: 'Management' },
  { id: 7, label: 'Reports', path: '/reports', icon: BarChart2, roles: ['admin'], category: 'Management' },
  { id: 8, label: 'Staff', path: '/staff', icon: Users, roles: ['admin'], category: 'Management' },
  { id: 9, label: 'Transactions', path: '/transactions', icon: BarChart2, roles: ['admin'], category: 'Management' },
  { id: 10, label: 'Settings', path: '/settings', icon: Settings, roles: ['admin', 'staff'], category: 'Management' },
  { id: 11, label: 'Admin Users', path: '/admin/users', icon: Users, roles: ['admin'], category: 'Management' },
];

function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const { user, token, isAuthenticated, loadAuthFromStorage, updateUser, logout } = useAuthStore();

  useEffect(() => {
    loadAuthFromStorage();
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
        // Failed to refresh profile, continue normally
        logout();
      }
    };

    refreshUserRole();
  }, [isAuthenticated, token, updateUser, logout]);

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
      <div>
        <ErrorBoundary>
        <AppShell
          navigation={navigation}
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
                  <AvailableMenusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu-items"
              element={
                <ProtectedRoute user={user}>
                  {user?.role === 'admin' ? (
                    <Suspense fallback={<div>Loading...</div>}>
                      <MenuPage />
                    </Suspense>
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables"
              element={
                <ProtectedRoute user={user}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <TablesPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute user={user}>
                    {user?.role === 'admin' ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <InventoryPage />
                      </Suspense>
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute user={user}>
                    {user?.role === 'admin' ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <StaffPage />
                      </Suspense>
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute user={user}>
                    {user?.role === 'admin' ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <TransactionsPage />
                      </Suspense>
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute user={user}>
                    {user?.role === 'admin' ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <ReportsPage />
                      </Suspense>
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )}
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
        </ErrorBoundary>

        <Toast />
      </div>
    </Router>
  );
}

export default App;
