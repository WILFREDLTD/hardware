import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200
        shadow-sm hover:shadow-md transition-shadow
        p-6 ${className}
      `}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'red' | 'gray';
}

const colorClasses = {
  green: 'bg-green-50 text-green-600',
  blue: 'bg-accent-50 text-accent-600',
  red: 'bg-danger-50 text-danger-600',
  gray: 'bg-gray-50 text-gray-600',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = 'green',
}) => {
  return (
    <Card className={colorClasses[color]}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {icon && <div className="text-4xl opacity-25">{icon}</div>}
      </div>
    </Card>
  );
};
