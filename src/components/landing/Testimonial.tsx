'use client';

export default function Testimonial() {
  return (
    <section className="bg-[#065f46] px-6 py-16 text-center md:px-12 md:py-24">
      <div className="mx-auto max-w-[800px]">
        <div className="mb-7 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
          ))}
        </div>
        <blockquote className="m-0 mb-6 font-['Fraunces',serif] text-[clamp(20px,5vw,34px)] font-bold italic leading-[1.35] tracking-[-0.01em] text-white">
          "Tracking stock is now much easier. We finally know exactly who owes us money."
        </blockquote>
        <p className="m-0 text-sm font-medium uppercase tracking-[0.06em] text-white/55">— Hardware store owner, Nairobi</p>
      </div>
    </section>
  );
}
