'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const features = [
  {
    icon: '📦',
    title: 'Inventory Management',
    subtitle: 'Know Exactly What Is In Stock',
    description: 'Track products, monitor stock levels, and receive alerts when items are running low.',
    color: 'from-orange-500 to-amber-400',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'text-orange-600',
  },
  {
    icon: '🧾',
    title: 'Sales Tracking',
    subtitle: 'Record Every Sale',
    description: 'Create sales quickly and keep a complete history of every transaction.',
    color: 'from-blue-600 to-cyan-400',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-600',
  },
  {
    icon: '📋',
    title: 'Debt Management',
    subtitle: 'Track Customer Credit Easily',
    description: 'Record debt sales, monitor outstanding balances, and track repayments.',
    color: 'from-rose-500 to-pink-400',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    accent: 'text-rose-600',
  },
  {
    icon: '📊',
    title: 'Business Reports',
    subtitle: 'See How Your Business Is Performing',
    description: 'View daily, weekly, and monthly sales reports and monitor revenue trends.',
    color: 'from-emerald-600 to-green-400',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-600',
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
];

const sections = [
  {
    title: 'Keep stock accurate without paper',
    description: 'Capture every product and quantity. Set reorder points, get alerts when parts are low, and keep your shelves aligned with your books.',
    bullets: ['Add products with item details', 'Monitor low stock in real time', 'Avoid lost sales from missing inventory'],
    image: 'https://plus.unsplash.com/premium_photo-1682090561671-efbabc3003d4?mark=https%3A%2F%2Fimages.unsplash.com%2Fopengraph%2Flogo.png&mark-w=64&mark-align=top%2Cleft&mark-pad=50&h=630&w=1200&crop=faces%2Cedges&blend-w=1&blend=000000&blend-mode=normal&blend-alpha=10&auto=format&fit=crop&q=60&ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzgwNDE0NjExfA&ixlib=rb-4.1.0',
    imageAlt: 'Tools and hardware on store shelves',
  },
  {
    title: 'Record sales quickly at the counter',
    description: 'Add items, print receipts, and close transactions fast so your shop moves with customers instead of slowing them down.',
    bullets: ['Scan or search products fast', 'Update stock instantly', 'Match every sale with inventory changes'],
    image: 'https://plus.unsplash.com/premium_photo-1663011078369-1613ac0a4758?w=1200&auto=format&fit=crop',
    imageAlt: 'Customers choosing nails and hardware supplies',
  },
  {
    title: 'Track customer credit clearly',
    description: 'Know who owes what and manage repayments without guesswork. This reduces overdue balances and improves cash collection.',
    bullets: ['Log debt sales with names', 'Monitor outstanding balances', 'Mark payments as received'],
    image: 'https://images.unsplash.com/photo-1758348609464-770fef766474?w=1200&auto=format&fit=crop',
    imageAlt: 'Cluttered storefront with hardware and tools',
  },
];

export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white font-bold text-lg">V</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Vico Softwares</p>
            <p className="text-xs text-slate-500">Hardware Store System</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/30 transition hover:bg-emerald-800"
        >
          Open Dashboard
        </button>
      </nav>

      <section className="relative overflow-hidden bg-white text-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Hardware store operations
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Run your store with accurate stock, fast sales, and clear customer credit.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Capture inventory, record sales, and track debts in one system designed for hardware shop owners.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="rounded-full bg-emerald-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 transition hover:bg-emerald-800"
                >
                  Open dashboard
                </button>
                <a
                  href="#sections"
                  className="rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  See the workflow
                </a>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1759200165738-6366977a73c6?w=1200&auto=format&fit=crop"
                alt="Hardware store tools display"
                className="h-[420px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 px-6">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">The reality</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Running a Hardware Store Is Hard Enough</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Most hardware stores still rely on notebooks, memory, and manual calculations. This leads to errors, stock loss, and slow customer service.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 text-left">
            {[
              { icon: '📦', pain: 'Missing stock', color: 'border-orange-500/30 bg-orange-500/5' },
              { icon: '🧾', pain: 'Unrecorded sales', color: 'border-blue-500/30 bg-blue-500/5' },
              { icon: '💸', pain: 'Forgotten debts', color: 'border-rose-500/30 bg-rose-500/5' },
              { icon: '❓', pain: "Don't know actual profit", color: 'border-amber-500/30 bg-amber-500/5' },
              { icon: '⏰', pain: 'Wasted time searching records', color: 'border-purple-500/30 bg-purple-500/5' },
              { icon: '✅', pain: 'Our system solves all of this', color: 'border-green-500/30 bg-green-500/10 text-green-700' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl border ${item.color} px-5 py-4 flex items-center gap-3`}>
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium text-slate-700">{item.pain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Everything You Need to Manage Your Store</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className={`rounded-3xl border ${f.border} ${f.bg} p-8 space-y-4 hover:-translate-y-1 transition-transform duration-200`}>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-2xl shadow-sm`}>
                  {f.icon}
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest ${f.accent}`}>{f.title}</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{f.subtitle}</h3>
                  <p className="text-slate-600 mt-2 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-24">
          {sections.map((section, index) => (
            <div key={section.title} className="grid gap-10 items-center lg:grid-cols-2">
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} space-y-6`}>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  {index === 0 ? 'Stock control' : index === 1 ? 'Sales recording' : 'Debt tracking'}
                </p>
                <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
                <p className="text-base leading-8 text-slate-600">{section.description}</p>
                <ul className="space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-slate-700">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-sm text-white">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-xl`}>
                <img src={section.image} alt={section.imageAlt} className="h-[420px] w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Why stores choose us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Why Hardware Stores Choose Our System</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-3xl border border-slate-200 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white">
                <span className="text-3xl">{b.icon}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-4">{b.title}</h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-24 px-6 bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Simple to Use</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.number} className="relative bg-white rounded-3xl border border-orange-100 p-7 shadow-sm hover:shadow-md transition-shadow">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 text-orange-300 text-xl z-10">→</div>
                )}
                <span className="text-4xl font-black text-orange-200">{s.number}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-3">{s.label}</h3>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-100 text-center">
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm text-emerald-700">
            <span className="text-emerald-500 text-base">★★★★★</span>
            Designed for hardware store teams
          </div>
          <blockquote className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
            "Tracking stock is now much easier. We finally know exactly who owes us money."
          </blockquote>
          <p className="text-slate-600 text-sm">— Hardware store owner, Nairobi</p>
        </div>
      </section>

      <section id="faq" className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className={`text-slate-500 text-xl transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 text-white text-center">
        <div className="mx-auto max-w-2xl space-y-7">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">Ready to Organize Your Hardware Store?</h2>
          <p className="text-orange-100 text-lg max-w-lg mx-auto">Start managing inventory, sales, and customer debts from one central system.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 rounded-full bg-white text-orange-600 font-bold px-8 py-4 text-base shadow-xl shadow-orange-700/30 hover:bg-orange-50 transition-colors"
            >
              Get Started Today
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/5 text-white font-bold px-8 py-4 text-base hover:bg-white/10 transition-colors"
            >
              View store workflow
            </button>
          </div>
        </div>
      </section>

      <footer className="py-2 px-6 text-center">
        <p className="text-xs text-slate-600">powered by <span className="italic">vico softwares</span></p>
      </footer>
    </main>
  );
}
