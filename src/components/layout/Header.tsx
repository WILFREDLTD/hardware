'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-base md:text-lg text-slate-600 mt-2 max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
