'use client';

import { features } from './landingData';

export default function Features() {
  return (
    <section id="features" className="bg-white px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center md:mb-16">
          <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">Features</p>
          <h2 className="m-0 font-['Fraunces',serif] text-[clamp(26px,5vw,44px)] font-black tracking-[-0.02em] text-[#0f172a]">
            Everything You Need to Manage Your Store
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              style={{ background: f.bg, borderColor: f.border }}
              className="cursor-default rounded-3xl border p-7 transition-transform duration-200 hover:-translate-y-1 sm:p-9"
            >
              <div
                style={{ background: f.accent }}
                className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-2xl"
              >
                {f.icon}
              </div>
              <p style={{ color: f.accent }} className="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">{f.title}</p>
              <h3 className="m-0 mb-3 font-['Fraunces',serif] text-xl font-bold tracking-[-0.01em] text-[#0f172a] sm:text-[22px]">{f.subtitle}</h3>
              <p className="m-0 text-[15px] leading-[1.7] text-[#475569]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
