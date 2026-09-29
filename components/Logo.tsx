
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg' },
    md: { container: 'w-10 h-10', text: 'text-2xl' },
    lg: { container: 'w-16 h-16', text: 'text-4xl' },
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizes[size].container} bg-[#B89548] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#B89548]/20`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3/5 h-3/5">
          {/* Hanger Hook */}
          <path 
            d="M50 38 C50 25, 62 25, 62 32 C62 38, 50 38, 50 45" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
            fill="none"
          />
          {/* Hanger Triangle Body */}
          <path 
            d="M50 45 L25 65 C23 67, 24 70, 28 70 L72 70 C76 70, 77 67, 75 65 Z" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          {/* Tiny heart inside the hanger */}
          <path 
            d="M50 61 C50 61, 47 57, 44 57 C41 57, 40 59, 41 61 C42 63, 50 67, 50 67 C50 67, 58 63, 59 61 C60 59, 59 57, 56 57 C53 57, 50 61, 50 61 Z" 
            fill="white"
          />
        </svg>
      </div>
      {showText && (
        <span className={`${sizes[size].text} font-black tracking-tighter text-[#4A3B18]`}>
          Touti Boutique
        </span>
      )}
    </div>
  );
};

export default Logo;
