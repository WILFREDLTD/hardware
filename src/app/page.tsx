 'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Nav from '../components/landing/Nav';
import Hero from '../components/landing/Hero';
import StatsBar from '../components/landing/StatsBar';
import Problem from '../components/landing/Problem';
import Features from '../components/landing/Features';
import Workflow from '../components/landing/Workflow';
import Benefits from '../components/landing/Benefits';
import ImageStrip from '../components/landing/ImageStrip';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonial from '../components/landing/Testimonial';
import FAQ from '../components/landing/FAQ';
import FinalCTA from '../components/landing/FinalCTA';

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
    <main className="min-h-screen bg-white font-['DM_Sans',sans-serif] text-[#0f172a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
      `}</style>

      <Nav />
      <Hero />
      <StatsBar />
      <Problem />
      <Features />
      <Workflow />
      <Benefits />
      <ImageStrip />
      <HowItWorks />
      <Testimonial />
      <FAQ openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <FinalCTA onOpen={openDashboard} />
    </main>
  );
}