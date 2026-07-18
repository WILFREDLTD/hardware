'use client';


import { sections } from './landingData';

export default function Workflow() {
  return (
    <section className="bg-[#f8fafc] px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-16 md:gap-[100px]">
        {sections.map((section, index) => (
          <div key={section.title} className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-20">
            <div className={index % 2 === 1 ? 'md:order-2' : 'md:order-1'}>
              <p className="m-0 mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#059669]">{section.tag}</p>
              <h2 className="m-0 mb-5 font-['Fraunces',serif] text-[clamp(24px,4vw,38px)] font-black leading-[1.15] tracking-[-0.02em] text-[#0f172a]">{section.title}</h2>
              <p className="m-0 mb-7 text-[15px] leading-[1.8] text-[#475569] sm:text-base">{section.description}</p>
              <div className="flex flex-col gap-3">
                {section.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-[#065f46]">
                      <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span className="text-sm font-medium leading-[1.6] text-[#334155]">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`hidden md:block ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
              <div className="overflow-hidden rounded-3xl border border-[#e2e8f0] shadow-[0_24px_64px_rgba(0,0,0,0.08)]">
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="block h-[420px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
