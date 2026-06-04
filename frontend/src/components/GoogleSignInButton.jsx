import React from 'react';

/**
 * GoogleSignInButton
 * - Full-width, 56px height, 14px radius
 * - Left-aligned multi-color "G" (24px)
 * - Centered text (Inter, 18px, 500)
 * - Hover: #F8F9FA background + subtle shadow
 * - Active: slight scale down
 * - Accessible: keyboard focus ring, aria-label
 */
export default function GoogleSignInButton({ onClick, children = 'Continue with Google', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={typeof children === 'string' ? children : 'Continue with Google'}
      className={
        `w-full h-[56px] bg-white border border-[#DADCE0] rounded-[14px] flex items-center px-4 transition-transform transition-shadow duration-150 ease-out ` +
        `hover:bg-[#F8F9FA] hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${className}`
      }
    >
      <span className="flex items-center justify-center w-6 h-6 mr-4" style={{ width: 24, height: 24 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="#4285F4" d="M23.6 12.27c0-.82-.07-1.61-.2-2.36H12v4.48h6.49c-.28 1.5-1.14 2.77-2.43 3.62v3.01h3.93c2.3-2.12 3.61-5.24 3.61-8.75z"/>
          <path fill="#34A853" d="M12 24c2.97 0 5.47-.98 7.29-2.66l-3.93-3.01C14.95 18.5 13.54 19 12 19c-2.9 0-5.36-1.95-6.24-4.55H1.67v2.86C3.5 21.9 7.48 24 12 24z"/>
          <path fill="#FBBC05" d="M5.76 14.45A7.998 7.998 0 0 1 5.2 12c0-.83.13-1.63.36-2.37V6.77H1.67A11.98 11.98 0 0 0 .0 12c0 1.94.46 3.78 1.28 5.46l4.48-3.01z"/>
          <path fill="#EA4335" d="M12 4.5c1.62 0 3.08.55 4.22 1.62l3.15-3.15C17.46.95 14.97 0 12 0 7.48 0 3.5 2.1 1.67 5.77l4.48 3.01C6.64 6.45 9.1 4.5 12 4.5z"/>
        </svg>
      </span>

      <span className="flex-1 text-[#202124] text-[18px] font-medium text-center" style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
        {children}
      </span>

      <span className="w-6" aria-hidden="true" />
    </button>
  );
}
