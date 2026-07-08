'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: '📦',
    title: 'Inventory Management',
    subtitle: 'Know Exactly What Is In Stock',
    description: 'Track products, monitor stock levels, and receive alerts when items are running low.',
    accent: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
  },
  {
    icon: '🧾',
    title: 'Sales Tracking',
    subtitle: 'Record Every Sale',
    description: 'Create sales quickly and keep a complete history of every transaction.',
    accent: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    icon: '📋',
    title: 'Debt Management',
    subtitle: 'Track Customer Credit Easily',
    description: 'Record debt sales, monitor outstanding balances, and track repayments.',
    accent: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
  },
  {
    icon: '📊',
    title: 'Business Reports',
    subtitle: 'See How Your Business Is Performing',
    description: 'View daily, weekly, and monthly sales reports and monitor revenue trends.',
    accent: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
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
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'DM Sans', sans-serif", color: '#0f172a' }}>

      {/* ── FONT IMPORT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #065f46, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em', lineHeight: 1.2 }}>VYQOR LABS</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', letterSpacing: '0.04em', fontWeight: 500 }}>Hardware Store System</p>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {['Features',  'FAQ'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} style={{
              fontSize: '14px', fontWeight: 500, color: '#475569', textDecoration: 'none',
              transition: 'color .2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')}
            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            >{link}</a>
          ))}
          <button
            onClick={openDashboard}
            style={{
              background: '#065f46', color: '#fff',
              border: 'none', borderRadius: '100px',
              padding: '10px 22px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'background .2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#047857')}
            onMouseLeave={e => (e.currentTarget.style.background = '#065f46')}
          >
            Open Dashboard
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
        {/* Background image with overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1759200165738-6366977a73c6?w=1600&auto=format&fit=crop"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(2,44,34,0.93) 0%, rgba(6,78,59,0.88) 40%, rgba(6,78,59,0.55) 70%, transparent 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '120px 48px 100px' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(52,211,153,0.35)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6ee7b7', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Hardware Store Operations</span>
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(42px, 5vw, 68px)',
              fontWeight: 900, lineHeight: 1.06,
              color: '#ffffff', margin: '0 0 24px',
              letterSpacing: '-0.02em',
            }}>
              Stop Losing Money to Missing Stock and Unrecorded Sales.
            </h1>

            <p style={{ fontSize: '18px', lineHeight: 1.75, color: 'rgba(255,255,255,0.75)', margin: '0 0 40px', maxWidth: '540px' }}>
              Manage inventory, record sales, track customer debts, and monitor business performance — all from one simple system built for hardware shops.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}>
              {/* <button
                onClick={() => router.push('/dashboard')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#10b981', color: '#fff',
                  border: 'none', borderRadius: '100px',
                  padding: '16px 32px', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all .2s',
                  boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Get Started Free
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M21 12H3"/></svg>
              </button> */}
              {/* <a
                href="#features"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '100px', padding: '16px 32px',
                  fontSize: '15px', fontWeight: 600, color: '#fff',
                  textDecoration: 'none', transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                See How It Works
              </a> */}
            </div>

            {/* Trust row */}
            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              {['No notebook needed', 'Works on any device', 'Designed for Kenya'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                  <svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: '#065f46' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              padding: '32px 24px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: '38px', fontWeight: 900, color: '#6ee7b7', lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ background: '#0f172a', padding: '96px 48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#f97316', letterSpacing: '0.2em', textTransform: 'uppercase' }}>The Reality</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", margin: 0, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Running a Hardware Store Is Hard Enough
            </h2>
            <p style={{ margin: '16px auto 0', fontSize: '17px', color: '#94a3b8', maxWidth: '560px', lineHeight: 1.7 }}>
              Most stores rely on memory, notebooks, and manual calculations. That leads to real money lost every day.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { icon: '📦', pain: 'Missing stock that no one noticed', color: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
              { icon: '🧾', pain: 'Sales recorded on scraps of paper', color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
              { icon: '💸', pain: 'Customer debts that are forgotten', color: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.25)' },
              { icon: '❓', pain: "No idea what the actual profit is", color: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.25)' },
              { icon: '⏰', pain: 'Wasted hours searching through records', color: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)' },
              { icon: '✅', pain: 'Our system fixes every one of these', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', highlight: true },
            ].map((item, i) => (
              <div key={i} style={{
                background: item.color, border: `1px solid ${item.border}`,
                borderRadius: '16px', padding: '20px 22px',
                display: 'flex', alignItems: 'center', gap: '14px',
              }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: item.highlight ? 700 : 500, color: item.highlight ? '#6ee7b7' : '#cbd5e1', lineHeight: 1.5 }}>{item.pain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background: '#ffffff', padding: '96px 48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#f97316', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Features</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", margin: 0, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Everything You Need to Manage Your Store
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {features.map((f) => (
              <div key={f.title} style={{
                background: f.bg, border: `1px solid ${f.border}`,
                borderRadius: '24px', padding: '36px',
                transition: 'transform .2s',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '16px',
                  background: f.accent, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '24px', marginBottom: '20px',
                }}>
                  {f.icon}
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: f.accent, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{f.title}</p>
                <h3 style={{ fontFamily: "'Fraunces', serif", margin: '0 0 12px', fontSize: '22px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{f.subtitle}</h3>
                <p style={{ margin: 0, fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW SECTIONS ── */}
      <section style={{ background: '#f8fafc', padding: '96px 48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '100px' }}>
          {sections.map((section, index) => (
            <div key={section.title} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
            }}>
              <div style={{ order: index % 2 === 1 ? 2 : 1 }}>
                <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{section.tag}</p>
                <h2 style={{ fontFamily: "'Fraunces', serif", margin: '0 0 20px', fontSize: 'clamp(26px, 2.5vw, 38px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{section.title}</h2>
                <p style={{ margin: '0 0 28px', fontSize: '16px', color: '#475569', lineHeight: 1.8 }}>{section.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {section.bullets.map((bullet) => (
                    <div key={bullet} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', background: '#065f46',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px',
                      }}>
                        <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <span style={{ fontSize: '15px', color: '#334155', fontWeight: 500, lineHeight: 1.6 }}>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ order: index % 2 === 1 ? 1 : 2 }}>
                <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 24px 64px rgba(0,0,0,0.08)' }}>
                  <img src={section.image} alt={section.imageAlt} style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ background: '#ffffff', padding: '96px 48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Why Stores Choose Us</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", margin: 0, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Why Hardware Stores Choose Our System
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {benefits.map((b) => (
              <div key={b.title} style={{
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: '20px', padding: '32px 28px',
                transition: 'all .2s', cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '16px' }}>{b.icon}</span>
                <h3 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>{b.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXTRA IMAGE STRIP ── */}
      <section style={{ background: '#0f172a', padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', height: '320px' }}>
          {[
            { src: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop', label: 'Inventory control' },
            { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop', label: 'Store operations' },
            { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', label: 'Business reporting' },
          ].map(img => (
            <div key={img.label} style={{ position: 'relative', overflow: 'hidden' }}>
              <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
              <p style={{ position: 'absolute', bottom: '20px', left: '24px', margin: 0, fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{img.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: '#fff7ed', padding: '96px 48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#f97316', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Process</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", margin: 0, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Simple to Use</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {steps.map((s, i) => (
              <div key={s.number} style={{ position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: '28px', right: '-10px', zIndex: 1, color: '#fed7aa', fontSize: '20px', fontWeight: 700 }}>→</div>
                )}
                <div style={{ background: '#fff', border: '1px solid #fed7aa', borderRadius: '20px', padding: '32px 28px', height: '100%' }}>
                  <p style={{ margin: '0 0 16px', fontFamily: "'Fraunces', serif", fontSize: '44px', fontWeight: 900, color: '#fed7aa', lineHeight: 1 }}>{s.number}</p>
                  <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{s.label}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ background: '#065f46', padding: '96px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '28px' }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          <blockquote style={{ fontFamily: "'Fraunces', serif", margin: '0 0 24px', fontSize: 'clamp(22px, 2.5vw, 34px)', fontWeight: 700, color: '#fff', lineHeight: 1.35, fontStyle: 'italic', letterSpacing: '-0.01em' }}>
            "Tracking stock is now much easier. We finally know exactly who owes us money."
          </blockquote>
          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>— Hardware store owner, Nairobi</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background: '#ffffff', padding: '96px 48px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#059669', letterSpacing: '0.2em', textTransform: 'uppercase' }}>FAQ</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", margin: 0, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', background: openFaq === i ? '#f8fafc' : '#fff', transition: 'background .2s' }}>
                <button
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{faq.q}</span>
                  <span style={{ fontSize: '22px', color: '#94a3b8', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform .2s', flexShrink: 0, marginLeft: '16px' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px', fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#0f172a', padding: '60px 48px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '320px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 700, color: '#34d399', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Get Started</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", margin: '0 0 20px', fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Ready to Organize Your Hardware Store?
          </h2>
          <p style={{ margin: '0 0 44px', fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            Start managing inventory, sales, and customer debts from one central system.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={openDashboard}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#10b981', color: '#fff', border: 'none',
                borderRadius: '100px', padding: '18px 36px',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(16,185,129,0.35)', transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              View Dashboard
            </button>
          </div>
          <p style={{ margin: '28px 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>
            powered by VYQOR LABS -0791614036
          </p>
        </div>
      </section>
    </main>
  );
}