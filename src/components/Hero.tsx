import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Curved text - DEVELOPER */}
      <div className="absolute top-16 left-8 md:top-20 md:left-16">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120" className="animate-spin-slow">
            <defs>
              <path
                id="circle-path"
                d="M 60, 60 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
              />
            </defs>
            <text className="text-sm font-semibold fill-white/60 tracking-[0.3em]">
              <textPath href="#circle-path" startOffset="0%">
                DEVELOPER • DESIGNER • CREATOR • 
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="text-center z-10 px-4">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-tight tracking-wider">
            <span className="block animate-fade-in-up">HEY, I AM</span>
            <span className="block animate-fade-in-up animation-delay-500 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              TANUSH
            </span>
            <span className="block animate-fade-in-up animation-delay-1000 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              THAKRAN
            </span>
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animation-delay-1500">
          <button
            onClick={scrollToProjects}
            className="group bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
          >
            View My Work
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* Presentation label */}
      <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16">
        <span className="text-white/60 text-sm font-semibold tracking-[0.3em]">PRESENTATION</span>
      </div>

      {/* Scroll indicator */}
      <button 
        onClick={scrollToProjects}
        className="absolute bottom-8 right-8 md:bottom-16 md:right-16 w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all duration-300 group"
      >
        <ChevronDown size={20} className="group-hover:animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;