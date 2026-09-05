import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

/**
 * One word slot that keeps replacing itself: the outgoing line leaves
 * upward while the incoming one arrives from below, both clipped by the
 * slot. The reference uses it to cycle a wall of client logos through a
 * fixed number of cells; the equivalent here is cycling a list that is too
 * long to print in full without turning into a wall of text.
 *
 * The cycle pauses while off-screen, and holds still entirely for anyone
 * who has asked for less motion — a word that rewrites itself under the
 * reader is exactly what that preference is about.
 */
const SlotCycle = ({
  items,
  interval = 2400,
  className = '',
}: {
  items: string[];
  interval?: number;
  className?: string;
}) => {
  const [index, setIndex] = useState(0);
  const hostRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || items.length < 2) return undefined;

    const host = hostRef.current;
    if (!host) return undefined;

    let timer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries[0]?.isIntersecting ?? false;
        window.clearInterval(timer);
        if (seen) {
          timer = window.setInterval(
            () => setIndex((value) => (value + 1) % items.length),
            interval,
          );
        }
      },
      { threshold: 0 },
    );
    observer.observe(host);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [items.length, interval, reduced]);

  return (
    <span
      ref={hostRef}
      // The slot is one line tall and clips; both words are in it at once
      // during the swap, so the incoming one is positioned over the exit.
      className={`relative inline-grid overflow-hidden align-bottom ${className}`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={items[index]}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={reduced ? false : { y: '110%' }}
          animate={{ y: '0%' }}
          exit={reduced ? undefined : { y: '-110%' }}
          transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default SlotCycle;
