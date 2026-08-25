import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4';

// How far the gate pushes in at full progress, and where the push is aimed —
// the doorway sits centred horizontally and a little above the midline.
const MAX_ZOOM = 2.6;
const ZOOM_ORIGIN = '50% 42%';

// Roughly three deliberate trackpad flicks, or one firm mouse-wheel sweep.
const WHEEL_SENSITIVITY = 0.0011;
const TOUCH_SENSITIVITY = 0.0026;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

interface HeroSectionProps {
  onOpen: () => void;
  /** Suppressed while the gate's own menu is covering the screen. */
  locked?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpen, locked = false }) => {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const entered = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  const enter = useCallback(() => {
    if (entered.current) return;
    entered.current = true;
    onOpen();
  }, [onOpen]);

  // Scrolling pushes through the doorway. The page itself never scrolls — the
  // gate is a single viewport — so wheel and touch drive the zoom directly.
  useEffect(() => {
    if (!mounted || locked) return;

    const advance = (amount: number) => {
      setProgress((current) => {
        const next = clamp(current + amount);
        if (next >= 1) enter();
        return next;
      });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      advance(event.deltaY * WHEEL_SENSITIVITY);
    };

    let lastTouchY: number | null = null;
    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      if (y == null || lastTouchY == null) return;
      event.preventDefault();
      advance((lastTouchY - y) * TOUCH_SENSITIVITY);
      lastTouchY = y;
    };
    const handleTouchEnd = () => {
      lastTouchY = null;
    };

    // Keyboard equivalent: the gate must not be scroll-only.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['Enter', ' ', 'Spacebar'].includes(event.key)) {
        event.preventDefault();
        enter();
        return;
      }
      if (['ArrowDown', 'PageDown'].includes(event.key)) {
        event.preventDefault();
        advance(0.34);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [mounted, locked, enter]);

  const entranceClass = mounted
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-8';

  const delay = (ms: number) => ({ transitionDelay: mounted ? `${ms}ms` : '0ms' });

  // Copy and controls clear out of the way as the doorway fills the frame.
  const foregroundFade = { opacity: clamp(1 - progress * 1.6) };

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-end justify-center">
      <div
        style={{
          transform: reducedMotion
            ? undefined
            : `scale(${1 + progress * (MAX_ZOOM - 1)})`,
          transformOrigin: ZOOM_ORIGIN,
        }}
        className={`absolute inset-0 transition-transform duration-300 ease-out ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`w-full h-full transition-all duration-[1400ms] ease-entrance ${
            mounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
        >
          <video
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
        <h1
          style={{ ...delay(400), ...foregroundFade }}
          className={`font-instrument text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl transition-[opacity,transform] duration-[900ms] ease-entrance ${entranceClass}`}
        >
          A carefully curated<br className="hidden sm:block" /> collection beyond compare
        </h1>

        <p
          style={{ ...delay(900), ...foregroundFade }}
          className={`mt-8 text-white/50 text-xs tracking-[0.2em] uppercase transition-[opacity,transform] duration-[900ms] ease-entrance ${entranceClass}`}
        >
          Scroll or press Enter to continue
        </p>

        <button
          type="button"
          onClick={enter}
          style={{ ...delay(1100), ...foregroundFade }}
          className={`mt-6 rounded-full border border-white/25 px-6 py-2.5 text-sm text-white/90 transition-[opacity,transform,colors] duration-[900ms] ease-entrance hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${entranceClass}`}
        >
          Enter
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
