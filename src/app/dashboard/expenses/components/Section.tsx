'use client';

interface SectionProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ title, subtitle, action, children }: SectionProps) {
  return (
    <div className="w-full bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] rounded-3xl border border-slate-200/80 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="text-sm uppercase tracking-[0.18em] text-slate-500 font-semibold">{title}</div>
          {subtitle && <div className="mt-2 text-sm text-slate-600 max-w-2xl">{subtitle}</div>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}
