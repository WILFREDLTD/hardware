'use client';

interface BarChartProps {
  data: { x: string; y: number }[];
  color?: string;
}

export function BarChart({ data, color = '#1a6b45' }: BarChartProps) {
  if (!data.length) return <div className="text-sm text-gray-400 text-center py-8">No data</div>;
  const max = Math.max(...data.map(d => d.y), 1);
  const H = 140;
  const W = 560;
  const PAD = 40;
  const BAR_W = Math.min(40, (W - PAD * 2) / data.length - 8);

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" style={{ maxHeight: 180 }}>
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = PAD + (1 - t) * (H - PAD);
        return (
          <g key={t}>
            <line x1={PAD} y1={y} x2={W - 10} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD - 6} y={y + 4} fontSize="9" fill="#9ca3af" textAnchor="end">{Math.round(max * t)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = PAD + (i + 0.5) * ((W - PAD * 2) / data.length);
        const barH = Math.max(2, ((d.y / max) * (H - PAD)));
        const y = H - barH;
        return (
          <g key={i}>
            <rect x={x - BAR_W / 2} y={y} width={BAR_W} height={barH} rx="3" fill={color} opacity="0.85" />
            <text x={x} y={H + 16} fontSize="9" fill="#6b7280" textAnchor="middle">{d.x}</text>
          </g>
        );
      })}
    </svg>
  );
}
