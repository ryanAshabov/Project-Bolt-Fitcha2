import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800 shadow-sm',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500 active:bg-slate-800 shadow-sm',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500 active:bg-slate-100 bg-white',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500 active:bg-slate-200',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 active:bg-emerald-800 shadow-sm',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 active:bg-amber-800 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800 shadow-sm'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};