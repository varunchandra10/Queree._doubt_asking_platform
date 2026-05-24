import React, { useEffect } from 'react';

const VARIANT_STYLES = {
  warning: {
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/10',
    title: 'Action Required',
    primary: 'bg-theme-accent-primary hover:bg-theme-accent-hover',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  success: {
    badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10',
    title: 'Success',
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  danger: {
    badge: 'bg-rose-500/10 text-rose-500 border-rose-500/10',
    title: 'Please Confirm',
    primary: 'bg-rose-500 hover:bg-rose-600',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    badge: 'bg-sky-500/10 text-sky-500 border-sky-500/10',
    title: 'Heads Up',
    primary: 'bg-theme-accent-primary hover:bg-theme-accent-hover',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const AlertBox = ({
  message,
  onClose,
  title,
  variant = 'warning',
  confirmLabel = 'Got it',
  cancelLabel,
  onConfirm,
}) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.warning;
  
  // Close modal smoothly when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrimaryAction = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    /* Modal Backdrop Layer */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      {/* Alert Container Card */}
      <div 
        className="w-full max-w-sm overflow-hidden bg-theme-bg-surface/95 border border-theme-border/60 rounded-2xl shadow-xl p-5 relative transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Right Quick Dismiss Control Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-theme-text-dim hover:text-theme-text-main hover:bg-theme-bg-element transition-colors cursor-pointer"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Informational Message Grid Column Stack */}
        <div className="flex gap-4 items-start pr-6">
          {/* Warning Icon Banner Accent Badge */}
          <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 border ${styles.badge}`}>
            {styles.icon}
          </div>

          {/* Core Notification Content Layer */}
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-black text-theme-text-main tracking-tight">
              {title || styles.title}
            </h3>
            <p className="text-xs font-semibold text-theme-text-muted leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button Row Footer */}
        <div className="mt-5 flex justify-end gap-2">
          {cancelLabel ? (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-bold text-theme-text-muted bg-theme-bg-element hover:text-theme-text-main rounded-xl transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
          ) : null}
          <button 
            type="button"
            onClick={handlePrimaryAction}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer active:scale-98 ${styles.primary}`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AlertBox;
