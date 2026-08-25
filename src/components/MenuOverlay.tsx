import React from 'react';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Work', path: '/projects' },
  { label: 'Skills', path: '/skills' },
  { label: 'Certificates', path: '/certificates' },
  { label: 'About', path: '/about' },
  { label: 'Experience', path: '/experience' },
  { label: 'Contact', path: '/contact' },
];

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  /** Opens the gate and lands on the chosen route. */
  onNavigate: (path: string) => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ open, onClose, onNavigate }) => (
  <div
    onClick={onClose}
    className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-700 ease-overlay ${
      open ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}
  >
    <nav className="flex flex-col items-center gap-6 md:gap-7">
      {NAV_LINKS.map((link, index) => (
        <button
          key={link.label}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(link.path);
          }}
          style={{ transitionDelay: open ? `${150 + index * 80}ms` : '0ms' }}
          className={`text-white font-instrument text-3xl sm:text-4xl md:text-5xl hover:opacity-60 transition-[opacity,transform] duration-[600ms] ease-overlay ${
            open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {link.label}
        </button>
      ))}
    </nav>
  </div>
);

export default MenuOverlay;
