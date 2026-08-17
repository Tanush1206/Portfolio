import { useStore } from '../store/useStore';

/**
 * Instrument readout. In Phase 1 it reports corpus load only — the embedding
 * model and retrieval timings land in Phase 2, and it says so rather than
 * showing a plausible-looking zero.
 */
export function Telemetry() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const modelStatus = useStore((s) => s.modelStatus);
  const queryStatus = useStore((s) => s.queryStatus);
  const embedMs = useStore((s) => s.embedMs);

  const forced = edges.filter((e) => e.forced).length;

  return (
    <div className="border-line bg-panel pointer-events-auto absolute right-0 top-0 z-20 m-[22px] border px-[11px] py-[11px]">
      <dl className="grid grid-cols-[auto_auto] gap-x-[22px] gap-y-[7px] text-[11px] leading-[11px]">
        <Row k="nodes" v={nodes.length ? String(nodes.length) : '—'} />
        <Row k="links" v={edges.length ? `${edges.length - forced} + ${forced} forced` : '—'} />
        <Row k="model" v={modelStatus === 'idle' ? 'phase 2' : modelStatus} />
        <Row k="query" v={queryStatus} />
        <Row k="embed" v={embedMs === null ? '—' : `${embedMs.toFixed(0)} ms`} />
      </dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-muted uppercase tracking-[0.14em]">{k}</dt>
      <dd className="text-dim text-right">{v}</dd>
    </>
  );
}
