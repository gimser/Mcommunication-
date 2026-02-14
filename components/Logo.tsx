import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className = "h-10", variant = 'color' }) => {
  const id = React.useId();
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto" aria-labelledby={`title-${id}`}>
        <title id={`title-${id}`}>Gim Services - Mcommunication</title>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#009746', stopOpacity: 1 }} /> {/* Gim Green */}
            <stop offset="100%" style={{ stopColor: '#FFD100', stopOpacity: 1 }} /> {/* Gim Yellow */}
          </linearGradient>
        </defs>
        
        {/* The 'M' Shape - Strong, Architectural, Balanced */}
        <path 
          d="M15 85 V 25 L 50 60 L 85 25 V 85" 
          fill="none" 
          stroke={variant === 'white' ? '#fff' : `url(#grad-${id})`} 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* The Dot for Digital Connection */}
        <circle cx="50" cy="85" r="5" fill={variant === 'white' ? '#fff' : `url(#grad-${id})`} />
      </svg>
      
      <div className="flex flex-col leading-none justify-center">
        <span className={`font-display font-bold text-xl tracking-tight ${variant === 'white' ? 'text-white' : 'text-slate-900'}`}>
          M<span className="font-sans font-medium">communication</span>
        </span>
        <span className={`text-sm font-bold tracking-widest ${variant === 'white' ? 'text-white/80' : 'text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow'}`}>
          3.0
        </span>
      </div>
    </div>
  );
};

export default Logo;