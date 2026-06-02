import React from "react";

interface ToastProps {
  title?: string;
  description?: string;
  open: boolean;
  onClose: () => void;
}

export default function Toast({
  title = "Success",
  description,
  open,
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

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in"
    >
      <div className="w-[340px] rounded-2xl border border-emerald-700/20 bg-emerald-600 shadow-2xl shadow-emerald-900/30">
        <div className="flex items-start gap-3 p-3">
          {/* Success Icon */}
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-xs text-emerald-100 leading-5">
                {description}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-emerald-100 transition hover:bg-emerald-500 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 overflow-hidden rounded-b-xl bg-emerald-500/40">
          <div className="h-full animate-[toast-progress_4s_linear] bg-white" />
        </div>
      </div>
    </div>
  );
}