import { useEffect, useState } from 'react';

// Below this the gate zoom, the stacking deck and the wide project cards all
// lose the room they were designed around.
const SMALL_SCREEN = '(max-width: 767px)';
const DISMISS_KEY = 'portfolio:small-screen-dismissed';

const wasDismissed = () => {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * Asks small-screen visitors to switch to a larger display. Deliberately
 * dismissible — someone reaching this from a phone should still be able to
 * read the work rather than hit a wall.
 */
const SmallScreenNotice = () => {
  const [isSmall, setIsSmall] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(SMALL_SCREEN).matches,
  );
  const [dismissed, setDismissed] = useState(wasDismissed);

  useEffect(() => {
    const query = window.matchMedia(SMALL_SCREEN);
    const sync = () => setIsSmall(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const visible = isSmall && !dismissed;

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Non-fatal: the notice simply returns on the next load.
    }
    setDismissed(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="small-screen-title"
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center px-8"
    >
      <p className="font-instrument text-white text-2xl tracking-tight">Tanush Thakran</p>

      <h2
        id="small-screen-title"
        className="font-instrument text-white text-4xl leading-[0.95] mt-10"
        style={{ letterSpacing: '-0.0256em' }}
      >
        Best seen on a bigger screen
      </h2>

      <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
        This portfolio is built around a full-width layout — the entrance, the
        stacked project cards and the background all need the room. Open it on a
        laptop or desktop for the experience as intended.
      </p>

      <button
        type="button"
        onClick={dismiss}
        className="mt-10 rounded-full border border-white/25 px-7 py-3 text-sm text-white/90 transition-colors duration-300 hover:border-white/60"
      >
        Continue anyway
      </button>
    </div>
  );
};

export default SmallScreenNotice;
