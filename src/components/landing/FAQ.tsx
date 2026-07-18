'use client';

import { faqs } from './landingData';

export default function FAQ({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (n: number | null) => void }) {
  return (
    <section id="faq" className="bg-white px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-12 text-center md:mb-[60px]">
          <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#059669]">FAQ</p>
          <h2 className="m-0 font-['Fraunces',serif] text-[clamp(26px,5vw,44px)] font-black tracking-[-0.02em] text-[#0f172a]">Common Questions</h2>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border border-[#e2e8f0] transition-colors ${openFaq === i ? 'bg-[#f8fafc]' : 'bg-white'}`}
            >
              <button
                className="flex w-full items-center justify-between border-none bg-transparent px-5 py-5 text-left sm:px-6"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-[15px] font-semibold text-[#0f172a]">{faq.q}</span>
                <span className={`ml-4 flex-shrink-0 text-[22px] text-[#94a3b8] transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-[15px] leading-[1.7] text-[#64748b] sm:px-6">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
