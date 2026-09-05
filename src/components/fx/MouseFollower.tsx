import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

/** Seconds for the pill to catch the cursor. */
const TAU = 0.085;
const DOT = 18;
const PAD_LEFT = 22;
const PAD_RIGHT = 10;

/**
 * A small pill that trails the cursor and, over anything carrying
 * `data-mouse-content`, widens to show that element's label inside itself.
 * It replaces the tooltip: the answer to "what happens if I click this"
 * arrives at the cursor rather than somewhere else on screen.
 *
 * Everything here is written straight to the node. It runs every frame,
 * and it is chrome — putting it through React would re-render the tree
 * around it for no visible gain.
 */
const MouseFollower = () => {
  const pillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const pill = pillRef.current;
    const label = labelRef.current;
    if (!pill || !label) return undefined;

    const target = { x: -100, y: -100 };
    const eased = { x: -100, y: -100 };

    let raf = 0;
    let previous = performance.now();
    let current: Element | null = null;

    const frame = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      const k = 1 - Math.exp(-dt / TAU);
      eased.x += (target.x - eased.x) * k;
      eased.y += (target.y - eased.y) * k;
      pill.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      pill.style.opacity = '1';
    };

    const clear = () => {
      current = null;
      pill.style.width = `${DOT}px`;
      label.style.opacity = '0';
      window.setTimeout(() => {
        if (current === null) label.textContent = '';
      }, 200);
    };

    const onOver = (event: MouseEvent) => {
      const host = (event.target as Element | null)?.closest?.('[data-mouse-content]');
      if (!host) {
        if (current) clear();
        return;
      }
      if (host === current) return;

      current = host;
      const text = (host.getAttribute('data-mouse-content') ?? '').toUpperCase();

      // Measure before revealing: the pill has to widen to the settled
      // text, or a longer label would be clipped as it appears.
      label.style.opacity = '0';
      label.textContent = text;
      const width = label.scrollWidth;
      label.style.opacity = '1';
      pill.style.width = `${PAD_LEFT + PAD_RIGHT + width}px`;
    };

    // A pressed cursor should acknowledge the press.
    const onDown = () => pill.classList.add('is-pressed');
    const onUp = () => pill.classList.remove('is-pressed');
    const onOut = (event: MouseEvent) => {
      if (event.relatedTarget === null) pill.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={pillRef} aria-hidden="true" className="mouse-follower">
      <span ref={labelRef} className="mouse-content" />
    </div>
  );
};

export default MouseFollower;
