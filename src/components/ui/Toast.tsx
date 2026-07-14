import React from "react";

interface ToastProps {
  title?: string;
  description?: string;
  open: boolean;
  variant?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({
  title = "Success",
  description,
  open,
  variant = 'success',
  onClose,
}: ToastProps) {
  React.useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  // const accent = variant === 'success' ? 'emerald' : 'red';

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in"
    >
      <div
        className={`relative inline-flex w-max max-w-sm min-w-[280px] items-center gap-2.5 overflow-hidden rounded-xl border bg-white/95 py-2.5 pl-2.5 pr-3 shadow-lg backdrop-blur-sm ${
          variant === 'success'
            ? 'border-emerald-100 shadow-emerald-900/10'
            : 'border-red-100 shadow-red-900/10'
        }`}
      >
        {/* Icon */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            variant === 'success' ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          {variant === 'success' ? (
            <svg
              className="h-3.5 w-3.5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
          {description && (
            <p className="mt-0.5 truncate text-xs text-slate-500">{description}</p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress bar */}
        <div
          className={`absolute inset-x-0 bottom-0 h-0.5 ${
            variant === 'success' ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          <div
            className={`h-full animate-[toast-progress_4s_linear] ${
              variant === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
}