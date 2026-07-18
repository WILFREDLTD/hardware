'use client';

export default function ImageStrip() {
  const imgs = [
    { src: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop', label: 'Inventory control' },
    { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop', label: 'Store operations' },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', label: 'Business reporting' },
  ];

  return (
    <section className="hidden overflow-hidden bg-[#0f172a] md:block">
      <div className="grid h-[320px] grid-cols-3">
        {imgs.map(img => (
          <div key={img.label} className="group relative overflow-hidden">
            <img
              src={img.src}
              alt={img.label}
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.6)_0%,transparent_60%)]" />
            <p className="absolute bottom-5 left-6 m-0 text-sm font-semibold uppercase tracking-[0.06em] text-white">{img.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
