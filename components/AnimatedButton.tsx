'use client';

import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

interface AnimatedButtonProps {
  children: React.ReactNode;
}

export default function AnimatedButton({ children }: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden px-8 py-4 rounded-full text-lg font-bold
        transform transition-all duration-300 button-glow
        ${isHovered ? 'scale-105' : 'scale-100'}
        bg-gradient-to-r from-indigo-600 via-pink-500 to-indigo-400
        hover:from-indigo-500 hover:via-pink-400 hover:to-indigo-300
        animate-gradient-x flex items-center gap-2 group text-white
      `}
    >
      <div className="flex items-center gap-2">
        {children}
        <FaPlay 
          className={`
            transform transition-all duration-300 
            ${isHovered ? 'translate-x-1' : ''} 
            group-hover:scale-110
          `} 
        />
      </div>
      
      {/* Animated glow effect */}
      <div 
        className={`
          absolute inset-0 -z-10 bg-gradient-to-r 
          from-indigo-600 via-pink-500 to-indigo-400
          opacity-0 group-hover:opacity-50 blur-xl
          transition-all duration-500
        `}
      />
      
      {/* Shine effect */}
      <div 
        className={`
          absolute inset-0 -z-5 bg-gradient-to-r from-transparent via-white/20 to-transparent
          translate-x-[-200%] group-hover:translate-x-[200%]
          transition-all duration-1000
        `}
      />
    </button>
  );
}