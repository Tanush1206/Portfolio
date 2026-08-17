import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { isSmallScreen } from '../engine/capabilities';
import { CLUSTER_HEX } from '../scene/palette';
import type { Cluster } from '../types';

const LABEL: Record<Cluster, string> = {
  ml: 'ai / ml + nlp',
  eng: 'full-stack / infra',
  data: 'data / analytics',
};

export function Legend() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const threshold = useStore((s) => s.edgeThreshold);
  const hasAnswer = useStore((s) => s.segments.length > 0);
  const [open, setOpen] = useState(() => !isSmallScreen());
  const autoClosed = useRef(false);

  /**
   * Fold away the first time an answer arrives — the answer panel occupies the
   * same left column and the two collide. Only once: after that the visitor's
   * own toggle wins, rather than the legend snapping shut on every query.
   */
  useEffect(() => {
    if (hasAnswer && !autoClosed.current) {
      autoClosed.current = true;
      setOpen(false);
    }
  }, [hasAnswer]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const n of nodes) c[n.cluster] = (c[n.cluster] ?? 0) + 1;
    return c;
  }, [nodes]);

  const forced = edges.filter((e) => e.forced).length;

  return (
    // Bottom-left belongs to the console on a phone, so the legend moves to the
    // top-right slot the telemetry readout vacates below `md`.
    <div
      className={`pointer-events-auto absolute right-0 top-[64px] z-20 m-[11px] w-[min(330px,80vw)] border border-muted/20 bg-panel md:bottom-0 md:left-0 md:right-auto md:top-auto md:m-[22px] ${
        hasAnswer ? 'hidden md:block' : ''
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-[11px] py-[11px] font-mono text-[11px] uppercase leading-[11px] tracking-[0.14em] text-muted transition-colors hover:text-ivory"
      >
        <span>legend</span>
        <span>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-[11px] border-t border-muted/20 p-[11px]">
          {(Object.keys(LABEL) as Cluster[]).map((c) => (
            <div
              key={c}
              className="flex items-center gap-[11px] font-mono text-[11px] leading-[11px]"
            >
              <span
                className="inline-block h-[9px] w-[9px] shrink-0"
                style={{ background: CLUSTER_HEX[c] }}
              />
              <span className="text-ivory/80">{LABEL[c]}</span>
              <span className="ml-auto text-muted">{counts[c] ?? 0}</span>
            </div>
          ))}

          <hr className="my-[7px] border-muted/20" />

          <p className="font-body text-sm text-muted">
            Large glowing nodes are projects. Small dimmed ones are skills.
          </p>
          <p className="font-body text-sm text-muted">
            Solid links are cosine similarity above{' '}
            <span className="font-mono text-[11px] text-ivory/80">{threshold}</span>. {forced}{' '}
            dashed links fall <em className="not-italic text-ivory/80">below</em> that threshold and
            are drawn only so nothing floats unconnected.
          </p>
          <p className="font-body text-sm text-muted">
            AI/ML and full-stack overlap because RAG and serving infrastructure genuinely do.
          </p>
        </div>
      )}
    </div>
  );
}
