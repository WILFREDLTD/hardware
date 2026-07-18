'use client';

import { stats } from './landingData';

export default function StatsBar() {
  return (
    <section className="bg-[#065f46]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 px-6 md:grid-cols-4 md:px-12">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-3 py-6 text-center sm:px-6 md:py-8 ${
              i < stats.length - 1 ? 'border-r border-white/10' : ''
            } ${i === 1 ? 'md:border-r' : ''}`}
          >
            <p className="m-0 font-['Fraunces',serif] text-[28px] font-black leading-none text-[#6ee7b7] sm:text-[38px]">{s.value}</p>
            <p className="m-0 mt-2 text-[11px] font-medium uppercase tracking-[0.05em] text-white/60 sm:text-[13px]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
