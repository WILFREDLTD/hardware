'use client';


export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f8fafc]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1759200165738-6366977a73c6?w=1600&auto=format&fit=crop"
          alt="Background image"
          loading="lazy"
          decoding="async"
          className="w-full object-cover object-center max-h-full md:h-full"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,44,34,0.93)_0%,rgba(6,78,59,0.88)_40%,rgba(6,78,59,0.55)_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 sm:px-8 md:px-12 md:py-24 lg:py-[120px]">
        <div className="max-w-[680px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border-0 bg-green-500 px-4 py-1.5 whitespace-nowrap">
            <span className="inline-block h-[7px] w-[7px] animate-pulse rounded-full bg-red-600" />
            <span className="text-[7px] font-semibold uppercase tracking-[0.14em] text-red-600 sm:text-xs">Hardware Store Operations</span>
          </div>

          <h1 className="m-0 mb-6 font-['Fraunces',serif] text-[clamp(32px,8vw,68px)] font-black leading-[1.06] tracking-[-0.02em] text-white">
            Stop Losing Money to Missing Stock and Unrecorded Sales.
          </h1>

          <p className="m-0 mb-10 max-w-[540px] text-base leading-[1.75] text-white sm:text-lg">
            Manage inventory, record sales, track customer debts, and monitor business performance — all from one simple system built for hardware shops.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-7">
            {['No notebook needed', 'Works on any device', 'Designed for Kenya'].map(t => (
              <span key={t} className="flex items-center gap-2 text-[13px] font-medium text-white">
                <svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
