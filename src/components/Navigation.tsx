import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'PROJ', href: '/projects' },
    { name: 'EXP', href: '/experience' },
    { name: 'STACK', href: '/skills' },
    { name: 'EDU', href: '/education' },
    { name: 'LOG', href: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-safe py-4 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(79,70,229,0.15)]">
      <Link to="/" className="font-headline-md text-headline-md text-primary tracking-tighter">
        TERMINAL_LUXE
      </Link>
      
      <nav className="hidden md:flex items-center space-x-8 font-code-snippet text-code-snippet">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`transition-colors hover:bg-primary/10 transition-all duration-300 px-2 py-1 ${
              location.pathname === item.href ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <Link 
        to="/contact"
        className="hidden md:block font-code-snippet text-code-snippet border border-primary px-6 py-2 text-primary hover:bg-primary hover:text-background transition-all duration-300 active:scale-95"
      >
        CONTACT_INIT
      </Link>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-primary transition-colors p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/5 py-8 animate-fade-in">
          <div className="flex flex-col items-center space-y-6 font-code-snippet">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold text-white hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="border border-primary px-8 py-3 text-primary hover:bg-primary hover:text-background transition-all"
            >
              CONTACT_INIT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;