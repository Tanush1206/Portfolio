import React, { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

const BubbleBackground: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const createBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < 15; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 100 + 20,
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 20 + 10,
        });
      }
      setBubbles(newBubbles);
    };

    createBubbles();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm animate-float"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      
      {/* Additional flowing elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-500/10 animate-pulse" />
      <div className="absolute bottom-32 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-500/10 animate-pulse animation-delay-2000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-indigo-400/10 to-purple-500/10 animate-bounce animation-delay-1000" />
    </div>
  );
};

export default BubbleBackground;