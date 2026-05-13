import React, { useState, useEffect } from 'react';

const AnimatedCharacters: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) {
        // Subtle movement following cursor at a distance
        const targetX = e.clientX / 20;
        const targetY = e.clientY / 20;
        setPosition({ x: targetX, y: targetY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Coder Character - Floating in bottom left */}
      <div 
        className="absolute bottom-10 left-10 pointer-events-auto transition-transform duration-700 ease-out"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative group">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-background text-[10px] font-mono font-bold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            HELLO WORLD_
          </div>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
            <rect x="10" y="10" width="40" height="40" rx="8" fill="#131313" stroke="#C3C0FF" strokeWidth="2"/>
            <rect x="20" y="25" width="20" height="4" rx="2" fill="#C3C0FF"/>
            <circle cx="22" cy="20" r="2" fill="#C3C0FF"/>
            <circle cx="38" cy="20" r="2" fill="#C3C0FF"/>
            {/* Pulsing screen glow */}
            <rect x="12" y="12" width="36" height="36" rx="6" fill="#C3C0FF" fillOpacity="0.05" className="animate-pulse"/>
          </svg>
        </div>
      </div>

      {/* Explorer Character - Floating in top right */}
      <div 
        className="absolute top-20 right-10 pointer-events-auto transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${-position.x * 1.5}px, ${-position.y * 1.5}px)` }}
      >
        <div className="relative group">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white text-background text-[10px] font-mono font-bold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase">
            Exploring...
          </div>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float" style={{ animationDelay: '1s' }}>
            <circle cx="25" cy="25" r="15" stroke="#DDB8FF" strokeWidth="2" strokeDasharray="4 4"/>
            <circle cx="25" cy="25" r="8" fill="#DDB8FF" className="animate-pulse"/>
            <path d="M25 5V10M25 40V45M5 25H10M40 25H45" stroke="#DDB8FF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCharacters;
