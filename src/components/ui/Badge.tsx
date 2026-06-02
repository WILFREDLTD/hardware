import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'info' | 'warning' | 'danger' | 'neutral';
}

const variants = {
  success: 'bg-green-100 text-green-800',
  info: 'bg-accent-100 text-accent-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-danger-100 text-danger-800',
  neutral: 'bg-gray-100 text-gray-800',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        text-sm font-medium
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
};
