import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// #about and #experience have no section yet; adding those ids to future
// sections wires these links with no change here.
// `to` renders a router Link, `href` a plain anchor.
const NAV_ITEMS: { label: string; to?: string; href?: string }[] = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/projects' },
  { label: 'Skills', to: '/skills' },
  { label: 'Certificates', to: '/certificates' },
  { label: 'About', to: '/about' },
  { label: 'Experience', to: '/experience' },
  { label: 'Contact', to: '/contact' },
];
const INK = '#000000';
const MUTED = '#6F6F6F';

const HomeNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Clicking Home while already home should still return to the top; a Link to
  // the current route is a no-op on its own.
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
        <Link
          to="/"
          onClick={backToTop}
          className="font-instrument text-2xl lg:text-3xl tracking-tight"
          style={{ color: INK }}
        >
          Tanush Thakran
        </Link>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {NAV_ITEMS.map((item) => {
            const active = item.to === pathname;
            const className = 'text-sm transition-colors duration-300 hover:!text-black';
            const style = { color: active ? INK : MUTED };
            return item.to ? (
              <Link
                key={item.label}
                to={item.to}
                onClick={active ? backToTop : undefined}
                className={className}
                style={style}
              >
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className={className} style={style}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <Link
          to="/contact"
          className="hidden lg:inline-block rounded-full px-6 py-2.5 text-sm text-white transition-transform duration-300 hover:scale-[1.03]"
          style={{ backgroundColor: INK }}
        >
          Get in touch
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="lg:hidden flex flex-col items-end gap-1.5 p-1"
        >
          <span className="w-6 h-[1.5px]" style={{ backgroundColor: INK }} />
          <span className="w-4 h-[1.5px]" style={{ backgroundColor: INK }} />
        </button>
        </div>
      </header>

      <div
        className={`lg:hidden fixed inset-0 z-50 bg-white flex flex-col transition-opacity duration-500 ease-menu ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="w-full px-6 py-5 flex items-center justify-between">
          <span className="font-instrument text-2xl tracking-tight" style={{ color: INK }}>
            Tanush Thakran
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="relative w-9 h-9 flex items-center justify-center"
          >
            <span className="absolute w-5 h-[1.5px] rotate-45" style={{ backgroundColor: INK }} />
            <span className="absolute w-5 h-[1.5px] -rotate-45" style={{ backgroundColor: INK }} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-7 px-6">
          {NAV_ITEMS.map((item, index) => {
            const active = item.to === pathname;
            const style = {
              color: active ? INK : MUTED,
              transitionDelay: menuOpen ? `${100 + index * 60}ms` : '0ms',
            };
            const className = `font-instrument text-4xl transition-all duration-500 ease-menu ${
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`;
            const close = () => {
              setMenuOpen(false);
              if (active) backToTop();
            };
            return item.to ? (
              <Link key={item.label} to={item.to} onClick={close} style={style} className={className}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} onClick={close} style={style} className={className}>
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="px-6 pb-12 flex justify-center">
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            style={{
              backgroundColor: INK,
              transitionDelay: menuOpen ? `${100 + NAV_ITEMS.length * 60}ms` : '0ms',
            }}
            className={`rounded-full px-10 py-4 text-base text-white transition-all duration-500 ease-menu ${
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Get in touch
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomeNav;
