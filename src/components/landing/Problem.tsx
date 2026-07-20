'use client';

export default function Problem() {
  const items = [
    { icon: '📦', pain: 'Missing stock that no one noticed', color: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
    { icon: '🧾', pain: 'Sales recorded on scraps of paper', color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
    { icon: '💸', pain: 'Customer debts that are forgotten', color: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.25)' },
    { icon: '❓', pain: "No idea what the actual profit is", color: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.25)' },
    { icon: '⏰', pain: 'Wasted hours searching through records', color: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)' },
    { icon: '✅', pain: 'Our system fixes every one of these', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', highlight: true },
  ];

  return (
    <section className="bg-[#0f172a] px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center md:mb-[60px]">
          <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">The Reality</p>
          <h2 className="m-0 font-['Fraunces',serif] text-[clamp(26px,5vw,44px)] font-black tracking-[-0.02em] text-[#f8fafc]">
            Running a Hardware Store Is Hard Enough
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-[1.7] text-[#94a3b8] sm:text-[17px]">
            Most stores rely on memory, notebooks, and manual calculations. That leads to real money lost every day.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              style={{ background: item.color, borderColor: item.border }}
              className="flex items-center gap-3.5 rounded-2xl border px-5 py-5 sm:gap-4 sm:px-[22px]"
            >
              <span className="flex-shrink-0 text-2xl">{item.icon}</span>
              <span className={`text-sm leading-[1.5] ${item.highlight ? 'font-bold text-[#6ee7b7]' : 'font-medium text-[#cbd5e1]'}`}>{item.pain}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
