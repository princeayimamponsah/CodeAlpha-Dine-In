import React from 'react';
import { useNotificationStore } from '../context/store';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import dineInLogo from '../../assets/ChatGPT Image May 18, 2026, 05_20_39 PM.png';

export const Toast = () => {
  const { notifications } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`animate-slide-in flex items-start gap-3 rounded-2xl border border-white/40 p-4 text-charcoal shadow-premium backdrop-blur-xl ${
            notification.type === 'success'
              ? 'bg-gradient-to-r from-olive/20 to-cream'
              : notification.type === 'error'
              ? 'bg-gradient-to-r from-wine/15 to-cream'
              : notification.type === 'warning'
              ? 'bg-gradient-to-r from-gold/20 to-cream'
              : 'bg-gradient-to-r from-peach/35 to-cream'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} className="text-olive" />
            ) : (
              <AlertCircle size={18} className={notification.type === 'error' ? 'text-wine' : 'text-gold'} />
            )}
          </div>
          <span className="text-sm leading-6 font-medium">{notification.message}</span>
        </div>
      ))}
    </div>
  );
};

export const Badge = ({ text, variant = 'default', size = 'md' }) => {
  const baseClasses = 'inline-flex items-center rounded-full border font-semibold whitespace-nowrap';
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px] uppercase tracking-[0.06em]',
    md: 'px-3.5 py-1.5 text-xs uppercase tracking-[0.06em]',
    lg: 'px-4 py-2 text-sm uppercase tracking-[0.06em]',
  };
  const variantClasses = {
    default: 'border-beige/70 bg-white/75 text-softgray shadow-sm',
    success: 'border-olive/20 bg-olive/15 text-olive shadow-sm',
    error: 'border-wine/20 bg-wine/10 text-wine shadow-sm',
    warning: 'border-gold/25 bg-gold/15 text-gold shadow-sm',
    info: 'border-peach/40 bg-peach/45 text-charcoal shadow-sm',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {text}
    </span>
  );
};

export const Card = ({ children, className = '', variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-white/78 border border-white/75 shadow-premium backdrop-blur-xl',
    primary: 'bg-gradient-to-br from-white/92 via-cream/80 to-peach/30 border border-beige/70 shadow-premium backdrop-blur-xl',
    success: 'bg-gradient-to-br from-white/92 via-cream/85 to-olive/10 border border-olive/15 shadow-premium backdrop-blur-xl',
    danger: 'bg-gradient-to-br from-white/92 via-cream/85 to-wine/10 border border-wine/15 shadow-premium backdrop-blur-xl',
    warning: 'bg-gradient-to-br from-white/92 via-cream/85 to-gold/15 border border-gold/20 shadow-premium backdrop-blur-xl',
  };

  return (
    <div className={`rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_72px_rgba(43,43,43,0.12)] ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-wine/30 active:scale-[0.98] disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-wine via-wine to-gold text-cream shadow-[0_18px_40px_rgba(109,31,61,0.22)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(109,31,61,0.25)] disabled:opacity-50',
    secondary: 'border border-beige/80 bg-peach/75 text-charcoal shadow-sm hover:-translate-y-0.5 hover:bg-peach disabled:opacity-60',
    success: 'bg-olive text-cream shadow-sm hover:-translate-y-0.5 hover:bg-olive/90 disabled:opacity-60',
    danger: 'bg-wine text-cream shadow-sm hover:-translate-y-0.5 hover:bg-wine/90 disabled:opacity-60',
    warning: 'bg-gold text-charcoal shadow-sm hover:-translate-y-0.5 hover:bg-gold/90 disabled:opacity-60',
    outline: 'border border-wine/25 bg-white/65 text-wine hover:bg-wine/5 disabled:border-gray-300 disabled:text-gray-400',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {children}
      {loading && <span className="animate-spin">⏳</span>}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => {
  const { className = '', ...rest } = props;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-softgray">
          {label}
        </label>
      )}
      <input
        {...rest}
        className={`w-full rounded-2xl border border-beige/80 bg-white/80 px-4 py-3 text-charcoal outline-none shadow-sm transition-all duration-300 placeholder:text-softgray/60 focus:border-wine/50 focus:bg-white focus:shadow-[0_10px_24px_rgba(109,31,61,0.08)] ${error ? 'border-wine/70 focus:border-wine' : ''} ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({ label, error, className = '', children, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-softgray">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`w-full rounded-2xl border border-beige/80 bg-white/80 px-4 py-3 text-charcoal outline-none shadow-sm transition-all duration-300 focus:border-wine/50 focus:bg-white focus:shadow-[0_10px_24px_rgba(109,31,61,0.08)] ${error ? 'border-wine/70 focus:border-wine' : ''} ${className}`}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-softgray">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full rounded-2xl border border-beige/80 bg-white/80 px-4 py-3 text-charcoal outline-none shadow-sm transition-all duration-300 placeholder:text-softgray/60 focus:border-wine/50 focus:bg-white focus:shadow-[0_10px_24px_rgba(109,31,61,0.08)] ${error ? 'border-wine/70 focus:border-wine' : ''} ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/45 px-4 backdrop-blur-xl">
      <div className={`${sizeClasses[size]} w-full rounded-[28px] border border-white/70 bg-gradient-to-br from-cream via-white to-peach/20 shadow-[0_32px_100px_rgba(43,43,43,0.22)] animate-fade-in`}>
        <div className="flex items-center justify-between border-b border-beige/60 px-6 py-5">
          <h2 className="text-lg font-semibold text-charcoal">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-softgray transition-colors hover:bg-wine/5 hover:text-wine"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(247,214,194,0.75),_transparent_42%),linear-gradient(180deg,#FFF7F2_0%,#FFFDFB_52%,#FFF8F4_100%)]">
    <div className="flex flex-col items-center gap-4 rounded-[28px] border border-white/75 bg-white/75 px-8 py-10 shadow-premium backdrop-blur-xl">
      <img src={dineInLogo} alt="DINE-IN" className="h-14 w-auto select-none object-contain" draggable="false" />
      <div className="h-14 w-14 animate-spin rounded-full border-2 border-beige border-t-wine"></div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-softgray">Preparing</p>
    </div>
  </div>
);

export const EmptyState = ({ title, description, icon: Icon }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-[28px] border border-white/70 bg-white/65 px-6 py-12 text-center shadow-premium backdrop-blur-xl">
    {Icon && <Icon size={48} className="mb-4 text-wine/55" />}
    <h3 className="mb-2 text-lg font-semibold text-charcoal">{title}</h3>
    <p className="max-w-md text-sm leading-6 text-softgray">{description}</p>
  </div>
);

export const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="space-y-2">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-softgray">{eyebrow}</p>}
      <h2 className="text-2xl font-semibold tracking-tight text-charcoal sm:text-[2rem]">{title}</h2>
      {description && <p className="max-w-2xl text-sm leading-6 text-softgray">{description}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const MetricCard = ({ icon: Icon, label, value, trend, tone = 'wine', hint }) => {
  const toneClasses = {
    wine: 'from-wine/18 to-peach/30 text-wine',
    peach: 'from-peach/55 to-cream text-charcoal',
    gold: 'from-gold/20 to-cream text-gold',
    olive: 'from-olive/18 to-cream text-olive',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneClasses[tone]}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-softgray">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-charcoal">{value}</p>
          {(trend || hint) && (
            <p className="mt-3 text-sm text-softgray">
              {typeof trend === 'number' ? (
                <span className={trend >= 0 ? 'font-semibold text-olive' : 'font-semibold text-wine'}>
                  {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
                </span>
              ) : null}
              {trend !== undefined && hint ? ' · ' : ''}
              {hint}
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses[tone]} shadow-soft`}>
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
};

export const BrandMark = ({ className = '', imgClassName = '', showGlow = true }) => (
  <div className={`relative inline-flex items-center justify-center ${showGlow ? 'floating-glow' : ''} ${className}`}>
    <img src={dineInLogo} alt="DINE-IN" className={`block select-none object-contain ${imgClassName}`} draggable="false" />
  </div>
);
