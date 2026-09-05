import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

const SPEED_WIDE = 90;
const SPEED_NARROW = 45;
const BREAKPOINT = 1024;
/** Fraction of velocity surviving one second of coasting. */
const FRICTION = 0.00001;

/**
 * A marquee you can grab.
 *
 * It drifts on its own, but a drag takes it over and the release keeps the
 * throw — velocity is sampled from the pointer and then bled off by
 * friction until the idle drift resumes. That is the difference between a
 * strip that plays at you and one that answers you.
 *
 * The content is rendered twice and the offset wraps at the width of one
 * copy, so there is no seam and no reflow at the loop point. The whole
 * thing pauses off-screen: an unobserved rAF loop is just heat.
 */
const DragMarquee = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const frame = frameRef.current;
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!frame || !track || !copy) return undefined;

    let span = copy.offsetWidth;
    let position = 0;
    let velocity = 0;
    let speed = window.innerWidth < BREAKPOINT ? SPEED_NARROW : SPEED_WIDE;

    let dragging = false;
    let lastX = 0;
    let lastTime = 0;
    let visible = true;
    let raf = 0;
    let previous = performance.now();

    const wrap = () => {
      if (span <= 0) return;
      if (position <= -span) position += span;
      else if (position > 0) position -= span;
    };

    const paint = () => {
      track.style.transform = `translate3d(${position}px, 0, 0)`;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      if (visible && !dragging) {
        if (Math.abs(velocity) > 10) {
          position += velocity * dt;
          velocity *= FRICTION ** dt;
        } else {
          position -= speed * dt;
          velocity = 0;
        }
        wrap();
        paint();
      }

      raf = requestAnimationFrame(tick);
    };

    if (!reduced) raf = requestAnimationFrame(tick);

    const pointFrom = (event: MouseEvent | TouchEvent) =>
      'touches' in event ? event.touches[0]?.clientX ?? lastX : event.clientX;

    const onDown = (event: MouseEvent | TouchEvent) => {
      dragging = true;
      velocity = 0;
      lastX = pointFrom(event);
      lastTime = performance.now();
      track.style.cursor = 'grabbing';
    };

    const onDrag = (event: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const x = pointFrom(event);
      const now = performance.now();
      const dx = x - lastX;
      const dt = (now - lastTime) / 1000;
      lastX = x;
      lastTime = now;
      if (dt > 0) velocity = dx / dt;
      position += dx;
      wrap();
      paint();
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      track.style.cursor = 'grab';
    };

    track.style.cursor = 'grab';
    track.style.touchAction = 'pan-y';

    track.addEventListener('mousedown', onDown);
    track.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onDrag, { passive: true });
    window.addEventListener('touchmove', onDrag, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    const onResize = () => {
      span = copy.offsetWidth;
      speed = window.innerWidth < BREAKPOINT ? SPEED_NARROW : SPEED_WIDE;
      wrap();
      paint();
    };
    window.addEventListener('resize', onResize);

    const seen = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        // Coming back into view after a long absence should not replay the
        // travel that would have happened while hidden.
        previous = performance.now();
      },
      { threshold: 0 },
    );
    seen.observe(frame);

    const sizes = new ResizeObserver(onResize);
    sizes.observe(copy);

    return () => {
      track.removeEventListener('mousedown', onDown);
      track.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', onResize);
      seen.disconnect();
      sizes.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={frameRef} className={`mask-fade-x select-none overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div ref={copyRef} className="flex shrink-0">
          {children}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DragMarquee;
