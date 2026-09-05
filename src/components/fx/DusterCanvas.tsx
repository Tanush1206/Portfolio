import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

/** How long the trail takes to catch the pointer. Lower drags further. */
const TAU = 0.115;
/** How long drawing continues after the pointer leaves, easing to a stop. */
const SETTLE_MS = 600;

const brushFor = (width: number) => Math.max(110, Math.min(220, width * 0.15));

/**
 * The duster.
 *
 * A canvas laid over its parent, filled solid black and composited with
 * `mix-blend-mode: exclusion`. Exclusion is `a + b - 2ab`, so black leaves
 * the parent exactly as it was, and anywhere the brush has painted white
 * every channel underneath is inverted — the dark panel turns pale and the
 * pale type on it turns dark, in one operation, with no duplicated markup
 * and nothing to keep in sync.
 *
 * The brush is a wide round-capped stroke drawn between successive
 * positions of a *lagged* pointer, not the pointer itself. That lag is the
 * whole character of the effect: the smear trails the cursor and keeps
 * moving for a moment after it leaves.
 *
 * Nothing is ever cleared, so the panel stays wiped where it has been
 * wiped. The parent must be positioned and must isolate, or the blend
 * would reach past it into the page behind.
 */
const DusterCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return undefined;

    // A finger has no hover state, so there is nothing here to drive.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let brush = 160;

    const reset = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      brush = brushFor(width);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#f6f6f6';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = brush;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    reset();

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const last = { x: 0, y: 0 };

    let raf = 0;
    let previous = 0;
    let seeding = true;
    let inside = false;
    let settleUntil = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      // Frame-rate independent exponential approach: the same visual lag
      // whether this runs at 60Hz or 144Hz.
      const k = 1 - Math.exp(-dt / TAU);
      eased.x += (target.x - eased.x) * k;
      eased.y += (target.y - eased.y) * k;

      if (seeding) {
        // First frame after entering: jump to the pointer rather than
        // striping the panel from wherever the last exit happened.
        seeding = false;
      } else {
        ctx.lineWidth = brush;
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(eased.x, eased.y);
        ctx.stroke();
      }

      last.x = eased.x;
      last.y = eased.y;

      if (inside || now < settleUntil) {
        raf = requestAnimationFrame(frame);
        return;
      }
      raf = 0;
    };

    const start = () => {
      if (raf !== 0) return;
      previous = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const at = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onEnter = (event: MouseEvent) => {
      const point = at(event);
      target.x = point.x;
      target.y = point.y;
      eased.x = point.x;
      eased.y = point.y;
      last.x = point.x;
      last.y = point.y;
      inside = true;
      seeding = true;
      start();
    };

    const onMove = (event: MouseEvent) => {
      const point = at(event);
      target.x = point.x;
      target.y = point.y;
      if (!inside) {
        // Entering over a child can swallow the enter event; recover.
        onEnter(event);
      }
    };

    const onLeave = () => {
      inside = false;
      // Let the trail finish arriving where the cursor last was.
      settleUntil = performance.now() + SETTLE_MS;
      start();
    };

    host.addEventListener('mouseenter', onEnter);
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);

    // Resizing changes the backing store, which drops the trail. That is
    // the reference's behaviour too, and re-projecting a smear across a
    // new width would look worse than starting the panel clean.
    const observer = new ResizeObserver(reset);
    observer.observe(host);

    return () => {
      host.removeEventListener('mouseenter', onEnter);
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full [mix-blend-mode:exclusion]"
    />
  );
};

export default DusterCanvas;
