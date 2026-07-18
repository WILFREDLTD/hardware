'use client';

import { steps } from './landingData';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#fff7ed] px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center md:mb-16">
          <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">Process</p>
          <h2 className="m-0 font-['Fraunces',serif] text-[clamp(26px,5vw,44px)] font-black tracking-[-0.02em] text-[#0f172a]">Simple to Use</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.number} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute -right-2.5 top-7 z-10 hidden text-xl font-bold text-[#fed7aa] lg:block">→</div>
              )}
              <div className="h-full rounded-2xl border border-[#fed7aa] bg-white p-7 sm:p-8">
                <p className="m-0 mb-4 font-['Fraunces',serif] text-[36px] font-black leading-none text-[#fed7aa] sm:text-[44px]">{s.number}</p>
                <h3 className="m-0 mb-2.5 text-lg font-bold text-[#0f172a]">{s.label}</h3>
                <p className="m-0 text-sm leading-[1.7] text-[#64748b]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
