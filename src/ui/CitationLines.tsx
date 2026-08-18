import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { rig, screenPosOf } from '../scene/screen';
import { QUERY_HEX } from '../scene/palette';

/**
 * Lines from each citation chip to the node in 3D it came from.
 *
 * This runs entirely outside React. Chip rectangles come from the DOM and node
 * positions from the module-level screen buffer, both read in one rAF, and the
 * SVG children are mutated in place — the alternative is re-rendering the
 * overlay every frame the camera moves, for a line that moved four pixels.
 */
export function CitationLines() {
  const segments = useStore((s) => s.segments);
  const hits = useStore((s) => s.hits);
  const svgRef = useRef<SVGSVGElement>(null);

  // Only the strongest citation on each chip draws by default. A chip with
  // three cites fanning three lines across the cloud reads as noise rather than
  // as provenance, so the rest appear on hover — see `expanded` below.
  const primary = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const scoreOf = (id: string) => hits.find((h) => h.id === id)?.score ?? 0;
    const m = new Map<string, string>();
    segments.forEach((seg, i) => {
      if (!seg.cites?.length) return;
      const best = [...seg.cites].sort((a, b) => scoreOf(b) - scoreOf(a))[0];
      m.set(String(i), best);
    });
    primary.current = m;
  }, [segments, hits]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let raf = 0;
    let fade = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const chips = Array.from(document.querySelectorAll<HTMLElement>('[data-cite]'));

      // The reframe easing and the answer mounting overlap in time. Drawing
      // through that window makes every line whip across the screen, so hold
      // them back until the camera has arrived rather than damping the lines.
      const want = rig.settled && chips.length ? 1 : 0;
      fade += (want - fade) * 0.12;
      svg.style.opacity = String(fade);

      if (fade < 0.01) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        return;
      }

      const hovered = useStore.getState().hoveredCite;
      const wanted: { key: string; x1: number; y1: number; x2: number; y2: number; on: boolean }[] =
        [];

      for (const chip of chips) {
        const id = chip.dataset.cite;
        const segIdx = chip.dataset.seg;
        if (!id || segIdx === undefined) continue;
        const p = screenPosOf(id);
        if (!p) continue;

        const isPrimary = primary.current.get(segIdx) === id;
        const isHovered = hovered === id;
        if (!isPrimary && !isHovered) continue;

        const r = chip.getBoundingClientRect();
        wanted.push({
          key: `${segIdx}:${id}`,
          x1: r.right,
          y1: r.top + r.height / 2,
          x2: p.x,
          y2: p.y,
          on: isHovered,
        });
      }

      // Reconcile by hand: reuse the existing <line> nodes, add or drop only
      // the difference. Rebuilding the list every frame churns the DOM at 60 Hz.
      while (svg.childElementCount > wanted.length) svg.removeChild(svg.lastChild!);
      while (svg.childElementCount < wanted.length) {
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('stroke', QUERY_HEX);
        l.setAttribute('stroke-width', '1');
        svg.appendChild(l);
      }

      wanted.forEach((w, i) => {
        const l = svg.children[i] as SVGLineElement;
        l.setAttribute('x1', String(w.x1));
        l.setAttribute('y1', String(w.y1));
        l.setAttribute('x2', String(w.x2));
        l.setAttribute('y2', String(w.y2));
        l.setAttribute('stroke-opacity', w.on ? '0.9' : '0.35');
        l.setAttribute('stroke-dasharray', w.on ? '' : '2 4');
      });
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // The <svg> is always mounted, even with nothing to draw. Returning null
  // until the first answer arrives means the rAF effect below — which has no
  // dependencies by design, because it must not restart every render — runs
  // once against a null ref and never again. The element is inert and empty
  // until there is something to point at.
  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      style={{ opacity: 0 }}
    />
  );
}
