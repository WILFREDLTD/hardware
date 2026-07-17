'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: '📦',
    title: 'Inventory Management',
    subtitle: 'Know Exactly What Is In Stock',
    description: 'Track products, monitor stock levels, and receive alerts when items are running low.',
    accentClass: 'bg-orange-500',
    textClass: 'text-orange-600',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-100',
  },
  {
    icon: '🧾',
    title: 'Sales Tracking',
    subtitle: 'Record Every Sale',
    description: 'Create sales quickly and keep a complete history of every transaction.',
    accentClass: 'bg-sky-500',
    textClass: 'text-sky-600',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-100',
  },
  {
    icon: '📋',
    title: 'Debt Management',
    subtitle: 'Track Customer Credit Easily',
    description: 'Record debt sales, monitor outstanding balances, and track repayments.',
    accentClass: 'bg-rose-500',
    textClass: 'text-rose-600',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-100',
  },
  {
    icon: '📊',
    title: 'Business Reports',
    subtitle: 'See How Your Business Is Performing',
    description: 'View daily, weekly, and monthly sales reports and monitor revenue trends.',
    accentClass: 'bg-emerald-500',
    textClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-100',
  },
];

const benefits = [
  { icon: '🔒', title: 'Reduce Stock Loss', desc: 'Keep accurate inventory records and identify missing stock quickly.' },
  { icon: '⚡', title: 'Save Time', desc: 'Find products, sales, and customer debt records instantly.' },
  { icon: '👁️', title: 'Improve Accountability', desc: 'Know who recorded sales and inventory changes at every step.' },
  { icon: '📈', title: 'Better Business Decisions', desc: 'Use reports to understand sales performance and inventory needs.' },
];

const steps = [
  { number: '01', label: 'Add Products', desc: 'Add your products and set current stock levels.' },
  { number: '02', label: 'Record Sales', desc: 'Record sales as customers purchase items.' },
  { number: '03', label: 'Track Debts', desc: 'Log debt sales, track payments and balances.' },
  { number: '04', label: 'View Reports', desc: 'Monitor performance and make smart decisions.' },
];

const faqs = [
  { q: 'Can I track customer debts?', a: 'Yes. Record debt sales and monitor repayments in real time.' },
  { q: 'Can I manage inventory?', a: 'Yes. Track stock levels, stock movements, and low-stock alerts.' },
  { q: 'Can I view sales reports?', a: 'Yes. Generate reports for daily, weekly, and monthly performance.' },
  { q: 'Is my data secure?', a: 'Yes. Access is protected through secure authentication and encrypted data storage.' },
  { q: 'Does it work on mobile?', a: 'Yes. The system is fully responsive and works on any device or screen size.' },
  { q: 'Can multiple staff use it?', a: 'Yes. Multiple team members can log in with individual accounts and permissions.' },
];

const sections = [
  {
    tag: 'Stock Control',
    title: 'Keep stock accurate without paper',
    description: 'Capture every product and quantity. Set reorder points, get alerts when parts are low, and keep your shelves aligned with your books.',
    bullets: ['Add products with item details', 'Monitor low stock in real time', 'Avoid lost sales from missing inventory'],
    image: 'https://plus.unsplash.com/premium_photo-1682090561671-efbabc3003d4?mark=https%3A%2F%2Fimages.unsplash.com%2Fopengraph%2Flogo.png&mark-w=64&mark-align=top%2Cleft&mark-pad=50&h=630&w=1200&crop=faces%2Cedges&blend-w=1&blend=000000&blend-mode=normal&blend-alpha=10&auto=format&fit=crop&q=60&ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzgwNDE0NjExfA&ixlib=rb-4.1.0',
    imageAlt: 'Tools and hardware on store shelves',
  },
  {
    tag: 'Sales Recording',
    title: 'Record sales quickly at the counter',
    description: 'Add items, print receipts, and close transactions fast so your shop moves with customers instead of slowing them down.',
    bullets: ['Scan or search products fast', 'Update stock instantly on every sale', 'Match every sale with inventory changes'],
    image: 'https://plus.unsplash.com/premium_photo-1663011078369-1613ac0a4758?w=1200&auto=format&fit=crop',
    imageAlt: 'Customers choosing hardware supplies',
  },
  {
    tag: 'Debt Tracking',
    title: 'Track customer credit clearly',
    description: 'Know who owes what and manage repayments without guesswork. This reduces overdue balances and improves cash collection.',
    bullets: ['Log debt sales with customer names', 'Monitor outstanding balances at a glance', 'Mark payments as received instantly'],
    image: 'https://images.unsplash.com/photo-1758348609464-770fef766474?w=1200&auto=format&fit=crop',
    imageAlt: 'Hardware store front',
  },
];

const stats = [
  { value: '100%', label: 'Paperless records' },
  { value: '< 30s', label: 'To record a sale' },
  { value: '0 KES', label: 'Forgotten debts' },
  { value: '24/7', label: 'Access your data' },
];

export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openDashboard = () => {
    router.push('/login');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.clear();
    }
  }, []);

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden bg-white text-slate-950"
      style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;0,900;1,600;1,700&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-4 sm:px-6 md:px-12 md:py-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-500 sm:h-11 sm:w-11">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="sm:h-[22px] sm:w-[22px]">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <div>
              <p className="font-display text-sm font-bold leading-tight text-slate-950">VYQOR LABS</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-[11px] sm:tracking-[0.18em]">Hardware Store System</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 justify-end sm:gap-3">
            {['Features', 'FAQ'].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">
                {link}
              </a>
            ))}
            <button onClick={() => router.push('/login')} className="rounded-full border border-slate-300 bg-transparent px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-slate-50 hover:text-emerald-900 sm:px-5 sm:py-2.5">
              Login
            </button>
            <button onClick={() => router.push('/register')} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:px-5 sm:py-2.5">
              Register
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1759200165738-6366977a73c6?w=1600&auto=format&fit=crop" alt="Hardware store interior" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,44,34,0.93)_0%,rgba(6,78,59,0.88)_40%,rgba(6,78,59,0.55)_70%,transparent_100%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-200/40 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 sm:mb-7 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-300 animate-pulse" />
              Hardware Store Operations
            </div>
            <h1 className="font-display mb-5 text-[clamp(34px,8vw,68px)] font-black leading-[1.08] text-white sm:mb-6">
              Stop Losing Money to Missing Stock and Unrecorded Sales.
            </h1>
            <p className="mb-8 max-w-xl text-base leading-7 text-white/80 sm:mb-10 sm:text-lg sm:leading-8">
              Manage inventory, record sales, track customer debts, and monitor business performance — all from one simple system built for hardware shops.
            </p>
            <div className="flex flex-wrap gap-2.5 sm:gap-5">
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.18em]">No notebook needed</div>
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.18em]">Works on any device</div>
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.18em]">Designed for Kenya</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-700">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 py-8 sm:px-6 sm:py-10 xl:grid-cols-4 xl:px-12 xl:py-14">
          {stats.map((s, i) => (
            <div key={s.label} className={`rounded-3xl px-4 py-6 text-center text-white sm:px-6 sm:py-8 ${i < stats.length - 2 ? 'border-b border-white/20 xl:border-b-0' : ''} ${i % 2 === 0 ? 'border-r border-white/20 xl:border-r xl:border-white/20' : ''}`}>
              <p className="font-display text-2xl font-black leading-none text-emerald-200 sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/75 sm:text-xs sm:tracking-[0.18em]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-14 text-slate-100 sm:px-6 sm:py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-16">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-400">The Reality</p>
            <h2 className="font-display mx-auto max-w-2xl text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">Running a Hardware Store Is Hard Enough</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:mt-5 sm:text-base sm:leading-8">Most stores rely on memory, notebooks, and manual calculations. That leads to real money lost every day.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { icon: '📦', pain: 'Missing stock that no one noticed', bg: 'bg-orange-500/10', border: 'border-orange-500/20', color: 'text-orange-100' },
              { icon: '🧾', pain: 'Sales recorded on scraps of paper', bg: 'bg-sky-500/10', border: 'border-sky-500/20', color: 'text-sky-100' },
              { icon: '💸', pain: 'Customer debts that are forgotten', bg: 'bg-rose-500/10', border: 'border-rose-500/20', color: 'text-rose-100' },
              { icon: '❓', pain: 'No idea what the actual profit is', bg: 'bg-amber-500/10', border: 'border-amber-500/20', color: 'text-amber-100' },
              { icon: '⏰', pain: 'Wasted hours searching through records', bg: 'bg-violet-500/10', border: 'border-violet-500/20', color: 'text-violet-100' },
              { icon: '✅', pain: 'Our system fixes every one of these', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', color: 'text-emerald-100' },
            ].map((item, index) => (
              <div key={index} className={`${item.bg} ${item.border} rounded-3xl border p-5 flex gap-4 sm:p-6`}>
                <span className={`text-2xl sm:text-3xl ${item.color}`}>{item.icon}</span>
                <p className="text-sm font-medium leading-7 text-slate-100">{item.pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-5 py-14 sm:px-6 sm:py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-16">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-500">Features</p>
            <h2 className="font-display text-2xl font-black text-slate-950 sm:text-3xl md:text-4xl">Everything You Need to Manage Your Store</h2>
          </div>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className={`${f.bgClass} ${f.borderClass} rounded-[28px] border p-6 transition-transform hover:-translate-y-1 sm:p-8`}>
                <div className={`${f.accentClass} mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white sm:mb-5 sm:h-14 sm:w-14 sm:text-2xl`}>{f.icon}</div>
                <p className={`${f.textClass} mb-3 text-[11px] font-bold uppercase tracking-[0.22em]`}>{f.title}</p>
                <h3 className="font-display mb-3 text-xl font-black text-slate-950 sm:text-2xl">{f.subtitle}</h3>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:px-6 sm:py-20 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 sm:gap-24">
          {sections.map((section, index) => (
            <div key={section.title} className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-600 sm:mb-4">{section.tag}</p>
                <h2 className="font-display mb-5 text-2xl font-black leading-tight text-slate-950 sm:mb-6 sm:text-3xl md:text-4xl">{section.title}</h2>
                <p className="mb-6 max-w-xl text-sm leading-7 text-slate-600 sm:mb-8 sm:text-base sm:leading-8">{section.description}</p>
                <div className="space-y-3.5 sm:space-y-4">
                  {section.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white sm:mt-1 sm:h-9 sm:w-9">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                      </span>
                      <p className="text-sm leading-7 text-slate-700 sm:text-base">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
                  <img src={section.image} alt={section.imageAlt} className="h-[420px] w-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-6 sm:py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-16">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Why Stores Choose Us</p>
            <h2 className="font-display text-2xl font-black text-slate-950 sm:text-3xl md:text-4xl">Why Hardware Stores Choose Our System</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-transform hover:-translate-y-1 hover:shadow-lg sm:p-8">
                <div className="mb-4 text-3xl sm:text-4xl">{b.icon}</div>
                <h3 className="font-display mb-3 text-base font-bold text-slate-950 sm:text-lg">{b.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden md:grid grid-cols-3 h-80 overflow-hidden bg-slate-950">
        {[
          { src: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop', label: 'Inventory control' },
          { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop', label: 'Store operations' },
          { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', label: 'Business reporting' },
        ].map((img) => (
          <div key={img.label} className="relative overflow-hidden">
            <img src={img.src} alt={img.label} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <p className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.18em] text-white">{img.label}</p>
          </div>
        ))}
      </section>

      <section id="how-it-works" className="bg-orange-50 px-5 py-14 sm:px-6 sm:py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-16">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-500">Process</p>
            <h2 className="font-display text-2xl font-black text-slate-950 sm:text-3xl md:text-4xl">Simple to Use</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.number} className="relative rounded-[24px] border border-orange-200 bg-white p-6 sm:p-8">
                {i < steps.length - 1 && <div className="pointer-events-none absolute top-7 right-[-10px] hidden text-2xl font-black text-orange-300 sm:block xl:block">→</div>}
                <p className="font-display mb-3 text-3xl font-black leading-none text-orange-400 sm:mb-4 sm:text-[2.5rem]">{s.number}</p>
                <h3 className="font-display mb-3 text-base font-bold text-slate-950 sm:text-lg">{s.label}</h3>
                <p className="text-sm leading-7 text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-700 px-5 py-14 text-center text-white sm:px-6 sm:py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center gap-2 sm:mb-8">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" className="inline-block sm:h-5 sm:w-5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <blockquote className="font-display mx-auto max-w-3xl text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
            "Tracking stock is now much easier. We finally know exactly who owes us money."
          </blockquote>
          <p className="mt-5 text-xs uppercase tracking-[0.16em] text-emerald-200 sm:mt-6 sm:text-sm sm:tracking-[0.18em]">— Hardware store owner, Nairobi</p>
        </div>
      </section>

      <section id="faq" className="bg-white px-5 py-14 sm:px-6 sm:py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center sm:mb-16">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">FAQ</p>
            <h2 className="font-display text-2xl font-black text-slate-950 sm:text-3xl md:text-4xl">Common Questions</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className={`rounded-[20px] border border-slate-200 bg-slate-50 transition ${openFaq === i ? 'bg-slate-100' : 'bg-white'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-950 sm:px-6 sm:py-5 sm:text-base">
                  <span>{faq.q}</span>
                  <span className={`shrink-0 text-2xl text-slate-500 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6 sm:pb-6 sm:text-base">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-5 py-14 text-center text-white sm:px-6 sm:py-20 md:px-12 lg:px-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Get Started</p>
          <h2 className="font-display mb-5 text-3xl font-black leading-tight sm:mb-6 sm:text-4xl md:text-5xl">Ready to Organize Your Hardware Store?</h2>
          <p className="mb-10 text-base leading-7 text-slate-300 sm:mb-12 sm:text-lg sm:leading-8">Start managing inventory, sales, and customer debts from one central system.</p>
          <button onClick={openDashboard} className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-8 py-3.5 text-base font-bold text-white shadow-[0_24px_40px_rgba(16,185,129,0.25)] transition hover:bg-emerald-600 sm:w-auto sm:px-10 sm:py-4">
            View Dashboard
          </button>
          <p className="mt-8 text-sm italic text-slate-400">powered by VYQOR LABS -0791614036</p>
        </div>
      </section>
    </main>
  );
}