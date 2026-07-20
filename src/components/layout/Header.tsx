'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between mb-6 sm:mb-10">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 mt-1 sm:mt-2 max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};
