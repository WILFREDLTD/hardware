'use client';

export default function FinalCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] px-6 py-14 text-center md:px-12">
      <div className="pointer-events-none absolute -top-[60px] left-1/2 h-[320px] w-[600px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-[700px]">
        <p className="m-0 mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#34d399]">Get Started</p>
        <h2 className="m-0 mb-5 font-['Fraunces',serif] text-[clamp(28px,6vw,54px)] font-black leading-[1.1] tracking-[-0.02em] text-white">
          Ready to Organize Your Hardware Store?
        </h2>
        <p className="m-0 mb-11 text-base leading-[1.7] text-white/60 sm:text-lg">
          Start managing inventory, sales, and customer debts from one central system.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-full border-none bg-[#10b981] px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(16,185,129,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#059669]"
          >
            View Dashboard
          </button>
        </div>
        <p className="m-0 mt-7 text-sm italic text-white/65">powered by VYQOR LABS -0791614036</p>
      </div>
    </section>
  );
}
