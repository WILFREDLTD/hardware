'use client';

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  icon: string;
}

export function KPICard({ label, value, sub, accent, icon }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: accent }} />
      <div className="pl-2">
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</div>
        <div className="text-lg sm:text-2xl font-bold text-gray-900">{icon} {value}</div>
        {sub && <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}
