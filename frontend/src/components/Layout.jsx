import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuthStore, useCartStore } from '../context/store';
import { BrandMark, Button } from './UI';
import { CartSidebar } from './CartSidebar';

const branchOptions = [
  { id: 'main', label: 'Main Dining' },
  { id: 'terrace', label: 'Terrace' },
  { id: 'private', label: 'Private Room' },
];

const isActiveRoute = (pathname, path) => pathname === path || pathname.startsWith(`${path}/`);

export const AppShell = ({ children, navigation, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [branch, setBranch] = useState('main');

  const filteredNav = navigation.filter((item) => {
    if (item.roles && !item.roles.includes(user?.role)) return false;
    return true;
  });

  const grouped = filteredNav.reduce((acc, item) => {
    const key = item.category || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const orderOfGroups = ['Operations', 'Management', 'Other'];

  const activeItem = filteredNav.find((item) => isActiveRoute(pathname, item.path)) || filteredNav[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-cream text-charcoal">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 flex-col overflow-y-auto border-r border-white/70 bg-cream px-5 py-6 shadow-[12px_0_45px_rgba(43,43,43,0.06)] backdrop-blur-2xl lg:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <BrandMark className="w-[11rem]" imgClassName="w-full" />
        </div>

        <div className="mb-6 rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-soft flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-wine/10 text-wine flex-shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Current branch</p>
              <p className="text-sm font-semibold text-charcoal truncate">{branchOptions.find((option) => option.id === branch)?.label}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col space-y-4 min-h-0">
          {orderOfGroups.map((group) => {
            const items = grouped[group];
            if (!items || items.length === 0) return null;
            return (
              <div key={group} className="space-y-2">
                <div className="px-2 text-xs font-semibold uppercase tracking-[0.12em] text-softgray">{group}</div>
                <div className="flex flex-col gap-2">
                  {items.map((item) => {
                    const active = isActiveRoute(pathname, item.path);
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`group flex w-full items-center gap-3 rounded-[20px] px-4 py-3.5 text-left text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                          active
                            ? 'bg-wine/10 text-wine shadow-[0_14px_32px_rgba(109,31,61,0.12)] ring-1 ring-wine/10'
                            : 'text-softgray hover:bg-white/80 hover:text-charcoal hover:shadow-soft'
                        }`}
                      >
                        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 flex-shrink-0 ${active ? 'bg-wine text-cream shadow-[0_12px_28px_rgba(109,31,61,0.18)]' : 'bg-beige/55 text-charcoal group-hover:bg-peach/70'}`}>
                          <item.icon size={18} />
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-wine flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[20rem] border-r border-white/70 bg-cream px-5 py-6 shadow-[16px_0_45px_rgba(43,43,43,0.12)] backdrop-blur-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between">
          <BrandMark className="w-36" imgClassName="w-full" />
          <button className="rounded-full bg-white/80 p-2 text-softgray shadow-soft" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="space-y-2">
          {filteredNav.map((item) => {
            const active = isActiveRoute(pathname, item.path);
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${active ? 'bg-wine/10 text-wine' : 'bg-white/70 text-softgray'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-6 rounded-[22px] bg-white/80 p-4 shadow-soft">
          <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      <div className="relative min-h-screen lg:pl-80">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-[rgba(255,247,242,0.72)] backdrop-blur-2xl">
          <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-softgray shadow-soft transition-transform hover:-translate-y-0.5 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[16rem] flex-1 max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-softgray" size={18} />
                  <input
                    placeholder={`Search ${activeItem?.label?.toLowerCase() || 'dashboard'}...`}
                    className="w-full rounded-[20px] border border-white/80 bg-white/80 py-3.5 pl-11 pr-4 text-sm text-charcoal outline-none shadow-soft transition-all duration-300 placeholder:text-softgray/60 focus:border-wine/30 focus:bg-white"
                  />
                </div>

                <div className="hidden items-center gap-2 rounded-[20px] border border-white/80 bg-white/80 px-3 py-3 shadow-soft md:flex">
                  <MapPin size={16} className="text-gold" />
                  <select
                    value={branch}
                    onChange={(event) => setBranch(event.target.value)}
                    className="bg-transparent text-sm font-medium text-charcoal outline-none"
                  >
                    {branchOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-softgray">
                  <span>{activeItem?.label || 'Dashboard'}</span>
                </div>

                {user?.role === 'admin' && (
                  <div className="ml-2 flex items-center gap-2">
                    <span className="rounded-full bg-wine/10 px-2 py-1 text-xs font-semibold text-wine">ADMIN</span>
                    <button
                      onClick={() => navigate('/reports')}
                      className="text-xs text-softgray hover:text-charcoal underline"
                      title="Audit Log / Reports"
                    >
                      Audit Log
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-softgray shadow-soft transition-transform hover:-translate-y-0.5 sm:inline-flex"
              title="Shopping Cart"
            >
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-wine text-xs font-bold text-cream">
                  {cartItems.length}
                </span>
              )}
            </button>

            <div className="relative hidden sm:block">
              <button
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/80 px-3 py-2.5 shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-wine text-sm font-semibold text-cream">
                  {(user?.name || 'D').slice(0, 1).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-charcoal">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-softgray capitalize">{user?.role || 'admin'}</p>
                </div>
                <ChevronDown size={16} className="text-softgray" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-[24px] border border-white/80 bg-white/95 p-3 shadow-[0_20px_60px_rgba(43,43,43,0.12)] backdrop-blur-xl">
                  <div className="mb-3 rounded-[18px] bg-cream px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Signed in</p>
                    <p className="mt-2 text-sm font-semibold text-charcoal">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-softgray">{user?.email || 'admin@dine-in.com'}</p>
                  </div>
                  <Button variant="secondary" className="w-full justify-center" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
