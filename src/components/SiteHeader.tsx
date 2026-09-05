import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { personalInfo } from '../data/personal';
import type { Theme } from './ui';

const NAV = [
  { label: 'Work', to: '/projects' },
  { label: 'Skills', to: '/skills' },
  { label: 'Certificates', to: '/certificates' },
  { label: 'About', to: '/about' },
  { label: 'Experience', to: '/experience' },
];

/** Height of the bar, and therefore where the detection line sits. */
const BAR = 72;

/**
 * Reports the theme of whichever band is currently under the header.
 *
 * This is a direct hit test, not an IntersectionObserver. An observer was
 * the obvious tool and it was wrong: the probe is a line at the header's
 * baseline, and at every boundary the outgoing band and the incoming one
 * both straddle it, so both are reported intersecting in the same batch.
 * Entry order is not specified, so it was a coin flip which one won — and
 * the loser stuck until the next boundary, which is how the bar ended up
 * dark-on-dark and invisible.
 *
 * Measuring rects directly has no such ambiguity: the last band in DOM
 * order that contains the probe line is the one painting there. Last, not
 * first, because the footer rises over the section above it and is the one
 * you can actually see.
 *
 * It runs in a layout effect so the bar is already the right colour on the
 * first painted frame. In a plain effect the first paint uses the initial
 * guess, and on a route whose opening band contradicts that guess the bar
 * flashes the wrong colour — which, on a dark band, means it flashes
 * invisible.
 */
const useThemeUnderHeader = (): Theme => {
  const [theme, setTheme] = useState<Theme>('dark');
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    let frame = 0;

    const probe = () => {
      frame = 0;
      let next: Theme | null = null;

      document.querySelectorAll<HTMLElement>('[data-band]').forEach((band) => {
        const { top, bottom } = band.getBoundingClientRect();
        if (top > BAR || bottom <= BAR) return;
        const value = band.dataset.theme;
        if (value === 'light' || value === 'dark') next = value;
      });

      // Re-annotated because the assignment happens inside a callback,
      // which TypeScript cannot follow — without this it narrows to null.
      // Nothing under the probe means the page is shorter than the bar is
      // tall, or the route has not laid out yet. Fall back to the first
      // band rather than keeping a value that describes a different page.
      const first = document.querySelector<HTMLElement>('[data-band]')?.dataset.theme;
      if (next === null && (first === 'light' || first === 'dark')) next = first;

      const resolved: Theme | null = next;
      if (resolved) setTheme((previous) => (previous === resolved ? previous : resolved));
    };

    // Rects are only worth re-reading once per painted frame.
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(probe);
    };

    probe();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    // Bands move when content above them changes height — a webfont
    // landing, an image decoding, a reveal running. Watching the document
    // catches those without a timer.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
    };
    // Re-run per route: each page mounts a different set of bands.
  }, [pathname]);

  return theme;
};

const SiteHeader = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useThemeUnderHeader();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* The bar carries the theme of the band beneath it, so its own tokens
          resolve to the right contrast without any per-colour logic. */}
      <header
        data-theme={theme}
        style={{ height: BAR }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          scrolled ? 'border-b border-line bg-bg/70 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-shell items-center justify-between px-5 text-fg sm:px-8 lg:px-12">
          <Link
            to="/"
            data-mouse-content="Back to the start"
            className="text-[15px] font-medium tracking-tight"
          >
            {personalInfo.name}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={pathname === item.to ? 'page' : undefined}
                className={`link-grow text-sm transition-opacity duration-300 ${
                  pathname === item.to ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/contact" className="btn hidden !px-5 !py-2.5 !text-[13px] sm:inline-flex">
              Get in touch
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 block h-px w-full bg-fg transition-transform duration-300 ease-overlay ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-fg transition-transform duration-300 ease-overlay ${
                    open ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer. Rendered outside the header so its backdrop is not
          clipped by the bar's own stacking context. */}
      <div
        data-theme="dark"
        className={`section fixed inset-0 z-50 transition-opacity duration-300 ease-overlay lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-[72px] items-center justify-between px-5 sm:px-8">
          <span className="text-[15px] font-medium tracking-tight">{personalInfo.name}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="kicker"
          >
            Close
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-6 px-5 sm:px-8">
          {[{ label: 'Home', to: '/' }, ...NAV, { label: 'Contact', to: '/contact' }].map(
            (item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-baseline gap-5 border-b border-line py-5"
              >
                <span className="kicker tabular">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="display text-[clamp(1.75rem,8vw,2.5rem)]">{item.label}</span>
              </Link>
            ),
          )}
        </nav>

        <p className="kicker absolute bottom-8 left-5 sm:left-8">
          {personalInfo.location} — {personalInfo.timezone}
        </p>
      </div>
    </>
  );
};

export default SiteHeader;
