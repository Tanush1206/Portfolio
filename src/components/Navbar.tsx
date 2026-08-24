import React, { useEffect, useState } from 'react';

interface NavbarProps {
  menuOpen: boolean;
  onToggle: () => void;
  onEnter: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ menuOpen, onToggle, onEnter }) => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const entranceClass = mounted
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 -translate-y-4';

  const delay = (ms: number) => ({ transitionDelay: mounted ? `${ms}ms` : '0ms' });

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-end h-16 md:h-20">
        <button
          type="button"
          onClick={onEnter}
          aria-label="Enter site"
          style={delay(400)}
          className={`hidden md:block relative z-50 transition-[opacity,transform] duration-700 ease-entrance ${entranceClass}`}
        >
          <img src="/images/logo.png" alt="" className="w-9 h-9 object-contain" />
        </button>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={onToggle}
          style={delay(200)}
          className={`md:hidden relative z-50 w-8 h-8 flex flex-col items-center justify-center gap-1.5 transition-[opacity,transform] duration-700 ease-entrance ${entranceClass}`}
        >
          <span
            className={`w-6 h-[2px] bg-white transition-transform duration-500 ease-overlay ${
              menuOpen ? 'rotate-45 translate-y-[4px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-transform duration-500 ease-overlay ${
              menuOpen ? '-rotate-45 -translate-y-[4px]' : ''
            }`}
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
