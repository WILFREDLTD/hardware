'use client';

import { benefits } from './landingData';

export default function Benefits() {
  return (
    <section className="bg-white px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center md:mb-16">
          <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#059669]">Why Stores Choose Us</p>
          <h2 className="m-0 font-['Fraunces',serif] text-[clamp(26px,5vw,44px)] font-black tracking-[-0.02em] text-[#0f172a]">
            Why Hardware Stores Choose Our System
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="cursor-default rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:p-8"
            >
              <span className="mb-4 block text-3xl">{b.icon}</span>
              <h3 className="m-0 mb-2.5 text-[17px] font-bold text-[#0f172a]">{b.title}</h3>
              <p className="m-0 text-sm leading-[1.7] text-[#64748b]">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
