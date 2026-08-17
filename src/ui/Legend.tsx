import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { CLUSTER_HEX } from '../scene/palette';
import type { Cluster } from '../types';

const LABEL: Record<Cluster, string> = {
  ml: 'machine learning',
  eng: 'engineering',
  data: 'data',
};

export function Legend() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const threshold = useStore((s) => s.edgeThreshold);
  const [open, setOpen] = useState(true);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const n of nodes) c[n.cluster] = (c[n.cluster] ?? 0) + 1;
    return c;
  }, [nodes]);

  const forced = edges.filter((e) => e.forced).length;

  return (
    <div className="border-line bg-panel pointer-events-auto absolute bottom-0 left-0 z-20 m-[22px] w-[min(330px,80vw)] border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-muted hover:text-fg flex w-full items-center justify-between px-[11px] py-[11px] text-[11px] uppercase leading-[11px] tracking-[0.14em] transition-colors"
      >
        <span>legend</span>
        <span>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="border-line flex flex-col gap-[11px] border-t p-[11px]">
          {(Object.keys(LABEL) as Cluster[]).map((c) => (
            <div key={c} className="flex items-center gap-[11px]">
              <span className="inline-block h-[9px] w-[9px] shrink-0" style={{ background: CLUSTER_HEX[c] }} />
              <span className="text-dim text-[11px] leading-[11px]">{LABEL[c]}</span>
              <span className="text-muted ml-auto text-[11px] leading-[11px]">{counts[c] ?? 0}</span>
            </div>
          ))}

          <hr className="border-line my-[7px]" />

          <p className="text-muted text-[11px] leading-[17px]">
            Large glowing nodes are projects. Small dimmed ones are skills.
          </p>
          <p className="text-muted text-[11px] leading-[17px]">
            Solid links are cosine similarity above {threshold}. {forced} dashed links fall
            <em className="not-italic text-dim"> below </em>
            that threshold and are drawn only so nothing floats unconnected.
          </p>
          <p className="text-muted text-[11px] leading-[17px]">
            Machine learning and engineering overlap because RAG and serving infrastructure
            genuinely do.
          </p>
        </div>
      )}
    </div>
  );
}
