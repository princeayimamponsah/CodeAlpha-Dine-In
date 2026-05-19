import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useAuthStore } from '../context/store';
import { BrandMark, Button } from './UI';

const branchOptions = [
  { id: 'main', label: 'Main Dining' },
  { id: 'terrace', label: 'Terrace' },
  { id: 'private', label: 'Private Room' },
];

const isActiveRoute = (pathname, path) => pathname === path || pathname.startsWith(`${path}/`);

export const AppShell = ({ children, navigation, isDark, setIsDark, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [branch, setBranch] = useState('main');

  const filteredNav = navigation.filter((item) => {
    if (item.roles && !item.roles.includes(user?.role)) return false;
    return true;
  });

  const activeItem = filteredNav.find((item) => isActiveRoute(pathname, item.path)) || filteredNav[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(247,214,194,0.65),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(212,163,115,0.16),_transparent_24%),linear-gradient(180deg,#FFF7F2_0%,#FFFDFB_48%,#FFF8F4_100%)] text-charcoal">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 flex-col border-r border-white/70 bg-[linear-gradient(180deg,rgba(255,247,242,0.96),rgba(255,251,248,0.96))] px-5 py-6 shadow-[12px_0_45px_rgba(43,43,43,0.06)] backdrop-blur-2xl lg:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <BrandMark className="w-[11rem]" imgClassName="w-full" />
        </div>

        <div className="mb-6 rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-wine/10 text-wine">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Current branch</p>
              <p className="text-sm font-semibold text-charcoal">{branchOptions.find((option) => option.id === branch)?.label}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {filteredNav.map((item) => {
            const active = isActiveRoute(pathname, item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`group flex w-full items-center gap-3 rounded-[20px] px-4 py-3.5 text-left text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-wine/10 via-peach/65 to-white text-wine shadow-[0_14px_32px_rgba(109,31,61,0.12)] ring-1 ring-wine/10'
                    : 'text-softgray hover:bg-white/80 hover:text-charcoal hover:shadow-soft'
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ${active ? 'bg-wine text-cream shadow-[0_12px_28px_rgba(109,31,61,0.18)]' : 'bg-beige/55 text-charcoal group-hover:bg-peach/70'}`}>
                  <item.icon size={18} />
                </span>
                <span className="flex-1">{item.label}</span>
                {active && <span className="h-2.5 w-2.5 rounded-full bg-wine" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 rounded-[24px] border border-white/80 bg-white/80 p-4 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">Signed in as</p>
              <p className="mt-2 text-sm font-semibold text-charcoal">{user?.name || 'Admin'}</p>
              <p className="text-xs text-softgray capitalize">{user?.role || 'admin'}</p>
            </div>
            <div className="rounded-2xl bg-olive/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-olive">
              Live
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full justify-center" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[20rem] border-r border-white/70 bg-[linear-gradient(180deg,rgba(255,247,242,0.98),rgba(255,251,248,0.98))] px-5 py-6 shadow-[16px_0_45px_rgba(43,43,43,0.12)] backdrop-blur-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-softgray">
                <span>{activeItem?.label || 'Dashboard'}</span>
                <span>•</span>
                <span>Warm hospitality operations</span>
              </div>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-softgray shadow-soft transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-softgray shadow-soft transition-transform hover:-translate-y-0.5 sm:inline-flex">
              <Bell size={18} />
            </button>

            <div className="relative hidden sm:block">
              <button
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/80 px-3 py-2.5 shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-wine to-gold text-sm font-semibold text-cream">
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
