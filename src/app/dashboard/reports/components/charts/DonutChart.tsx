'use client';

import { formatKES } from '@/lib/utils';

interface DonutChartSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutChartSlice[];
}

export function DonutChart({ slices }: DonutChartProps) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (!total) return <div className="text-sm text-gray-400 text-center py-8">No data</div>;

  let angle = -Math.PI / 2;
  const R = 60;
  const r = 36;
  const cx = 80;
  const cy = 80;
  const paths = slices.map(sl => {
    const sweep = (sl.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    const xi1 = cx + r * Math.cos(angle - sweep);
    const yi1 = cy + r * Math.sin(angle - sweep);
    const xi2 = cx + r * Math.cos(angle);
    const yi2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`,
      color: sl.color,
      label: sl.label,
      value: sl.value,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="flex-shrink-0" style={{ width: 130 }}>
        {paths.map((p, i) => <path key={i} d={p.path} fill={p.color} stroke="white" strokeWidth="2" />)}
        <text x={cx} y={cy + 5} fontSize="12" fontWeight="600" fill="#374151" textAnchor="middle">{formatKES(total)}</text>
      </svg>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {slices.map(sl => (
          <div key={sl.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sl.color }} />
            <span className="text-xs text-gray-600 flex-1 truncate">{sl.label}</span>
            <span className="text-xs font-semibold text-gray-900">{((sl.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
