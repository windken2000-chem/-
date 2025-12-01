import React from 'react';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  colorClass?: string; // e.g., 'bg-blue-500'
  shadowClass?: string; // e.g., 'bg-blue-700'
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GameButton: React.FC<GameButtonProps> = ({
  children,
  onClick,
  colorClass = 'bg-yellow-400',
  shadowClass = 'bg-yellow-600',
  disabled = false,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-lg',
    lg: 'px-8 py-4 text-xl',
  };

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        relative group inline-block font-bold text-white rounded-2xl
        transition-all duration-150 transform
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:top-[4px] hover:-translate-y-1'}
        ${className}
      `}
    >
      {/* 3D Shadow Layer */}
      <span className={`
        absolute top-[6px] left-0 w-full h-full rounded-2xl
        ${disabled ? 'bg-gray-400' : shadowClass}
        transition-all duration-150 group-active:top-0
      `}></span>
      
      {/* Main Button Layer */}
      <span className={`
        relative block border-2 border-white/20
        ${disabled ? 'bg-gray-300' : colorClass}
        rounded-2xl ${sizeClasses[size]}
      `}>
        {children}
      </span>
    </button>
  );
};