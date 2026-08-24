import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BoomerangVideoBg from './BoomerangVideoBg';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

// Where the home page hands over: the hero owns the first screen, this takes
// the rest rather than leaving flat white behind the project cards.
const HANDOVER = 0.5;

/**
 * Boomerang video backdrop. Interior pages get it immediately. The home page
 * keeps its own hero video up top and only brings this in once the visitor
 * scrolls past — the clip is 16MB and is not worth paying for on landing.
 */
const PageBackground = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * HANDOVER);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const active = !isHome || pastHero;

  // Latches: once the footage has been captured, keep it around so returning
  // to the top and scrolling down again does not re-capture.
  const [mounted, setMounted] = useState(active);
  useEffect(() => {
    if (active) setMounted(true);
  }, [active]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />
      {/* Scrim keeps the black body copy legible over the footage. */}
      <div className="absolute inset-0 bg-white/70" />
    </div>
  );
};

export default PageBackground;
