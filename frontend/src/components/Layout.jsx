import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
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

const mobilePrimaryLabels = ['Dashboard', 'Orders', 'Tables'];
const mobileMoreLabels = ['Reservations', 'Menu', 'Settings'];

const isActiveRoute = (pathname, path) => pathname === path || pathname.startsWith(`${path}/`);

export const AppShell = ({ children, navigation, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [branch, setBranch] = useState('main');
  const mobileMoreMenuRef = useRef(null);

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
  const mobilePrimaryNav = mobilePrimaryLabels
    .map((label) => filteredNav.find((item) => item.label === label))
    .filter(Boolean);
  const mobileMoreNav = mobileMoreLabels
    .map((label) => filteredNav.find((item) => item.label === label))
    .filter(Boolean);
  const mobileMoreActive = mobileMoreNav.some((item) => isActiveRoute(pathname, item.path));

  useEffect(() => {
    if (!mobileMoreOpen) return;

    const handlePointerDown = (event) => {
      if (mobileMoreMenuRef.current && !mobileMoreMenuRef.current.contains(event.target)) {
        setMobileMoreOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMoreOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMoreOpen]);

  useEffect(() => {
    setMobileMoreOpen(false);
    setProfileOpen(false);
  }, [pathname]);

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

      <aside className={`fixed inset-y-0 left-0 z-50 hidden w-[85vw] max-w-[20rem] border-r border-white/70 bg-cream px-5 py-6 shadow-[16px_0_45px_rgba(43,43,43,0.12)] backdrop-blur-2xl transition-transform duration-300 md:block lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-softgray shadow-soft transition-transform hover:-translate-y-0.5 md:inline-flex lg:hidden"
              onClick={() => setMobileOpen(true)}
              type="button"
              aria-label="Open navigation menu"
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
              type="button"
            >
              <ShoppingCart size={18} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-wine text-xs font-bold text-cream">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setMobileMoreOpen(false);
                setProfileOpen((value) => !value);
              }}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-[20px] border border-white/80 bg-white/80 text-softgray shadow-soft transition-transform hover:-translate-y-0.5 md:hidden"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              type="button"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-wine text-sm font-semibold text-cream">
                {(user?.name || 'D').slice(0, 1).toUpperCase()}
              </div>
            </button>

            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setMobileMoreOpen(false);
                  setProfileOpen((value) => !value);
                }}
                className="flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/80 px-3 py-2.5 shadow-soft transition-transform hover:-translate-y-0.5"
                type="button"
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

        <main className="px-4 py-6 pb-[calc(6.75rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-8 lg:px-8 lg:py-8">{children}</main>
      </div>

      <div ref={mobileMoreMenuRef} className="fixed left-4 right-4 z-40 md:hidden" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        {mobileMoreOpen && (
          <div className="mobile-more-enter absolute bottom-[calc(100%+12px)] left-0 right-0 rounded-[22px] border border-[#C89B3C] bg-[#171B23] p-4 shadow-[0_20px_50px_rgba(0,0,0,.35)]">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B7BBC4]">More</p>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#D8D8D8] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]/60"
                aria-label="Close more menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="divide-y divide-white/10 overflow-hidden rounded-[18px] border border-white/5 bg-white/0">
              {mobileMoreNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMobileMoreOpen(false);
                    navigate(item.path);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-[14px] text-left transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C]/60"
                  role="menuitem"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#D8D8D8]">
                    <item.icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-white">{item.label}</span>
                  <ChevronRight size={16} className="text-[#B7BBC4]" />
                </button>
              ))}
            </div>
          </div>
        )}

        <nav className="mobile-dock-enter flex h-[76px] items-stretch overflow-hidden rounded-[30px_30px_24px_24px] border border-[#C89B3C] bg-[#171B23] shadow-[0_12px_35px_rgba(0,0,0,.28)]">
          {mobilePrimaryNav.map((item) => {
            const active = isActiveRoute(pathname, item.path);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMobileMoreOpen(false);
                  navigate(item.path);
                }}
                className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-center outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#C89B3C]/60"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 will-change-transform ${
                    active
                      ? 'bg-[#C89B3C] text-[#171B23] shadow-[0_8px_22px_rgba(200,155,60,.25)]'
                      : 'text-[#D8D8D8]'
                  }`}
                >
                  <item.icon size={20} />
                </span>
                <span className={`text-[11px] ${active ? 'font-semibold text-white' : 'font-medium text-[#B7BBC4]'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setProfileOpen(false);
              setMobileMoreOpen((value) => !value);
            }}
            className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-center outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#C89B3C]/60"
            aria-label="Open more menu"
            aria-haspopup="menu"
            aria-expanded={mobileMoreOpen}
            aria-current={mobileMoreActive ? 'page' : undefined}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 will-change-transform ${
                mobileMoreActive
                  ? 'bg-[#C89B3C] text-[#171B23] shadow-[0_8px_22px_rgba(200,155,60,.25)]'
                  : 'text-[#D8D8D8]'
              }`}
            >
              <Menu size={20} />
            </span>
            <span className={`text-[11px] ${mobileMoreActive ? 'font-semibold text-white' : 'font-medium text-[#B7BBC4]'}`}>
              More
            </span>
          </button>
        </nav>
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
