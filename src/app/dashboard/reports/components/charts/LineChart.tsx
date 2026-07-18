'use client';

interface LineChartProps {
  data: { x: string; y: number }[];
  color?: string;
}

export function LineChart({ data, color = '#1a6b45' }: LineChartProps) {
  if (data.length < 2) return <div className="text-sm text-gray-400 text-center py-8">Not enough data</div>;
  const max = Math.max(...data.map(d => d.y), 1);
  const H = 120;
  const W = 560;
  const PAD = 36;
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - d.y / max) * (H - PAD);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ maxHeight: 160 }}>
      {[0, 0.5, 1].map(t => {
        const y = PAD + (1 - t) * (H - PAD);
        return <line key={t} x1={PAD} y1={y} x2={W - 10} y2={y} stroke="#f3f4f6" strokeWidth="1" />;
      })}
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts.join(' ')} />
      {data.map((d, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        const y = PAD + (1 - d.y / max) * (H - PAD);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill={color} />
            <text x={x} y={H + 16} fontSize="9" fill="#6b7280" textAnchor="middle">{d.x}</text>
          </g>
        );
      })}
    </svg>
  );
}
