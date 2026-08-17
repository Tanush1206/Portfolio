import { useStore } from '../store/useStore';

/**
 * Instrument readout. Every number here is measured, never estimated — if a
 * value is not known yet it shows an em dash rather than a plausible zero.
 */
export function Telemetry() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const modelStatus = useStore((s) => s.modelStatus);
  const modelProgress = useStore((s) => s.modelProgress);
  const queryStatus = useStore((s) => s.queryStatus);
  const embedMs = useStore((s) => s.embedMs);

  const forced = edges.filter((e) => e.forced).length;

  return (
    <div className="pointer-events-auto absolute right-0 top-0 z-20 m-[22px] border border-muted/20 bg-panel px-[11px] py-[11px] font-mono">
      <dl className="grid grid-cols-[auto_auto] gap-x-[22px] gap-y-[7px] text-[11px] leading-[11px]">
        <Row k="nodes" v={nodes.length ? String(nodes.length) : '—'} />
        <Row k="links" v={edges.length ? `${edges.length - forced} + ${forced} forced` : '—'} />
        <Row
          k="model"
          v={modelStatus === 'loading' ? `${Math.round(modelProgress * 100)}%` : modelStatus}
        />
        <Row k="query" v={queryStatus} />
        <Row k="embed" v={embedMs === null ? '—' : `${embedMs.toFixed(0)} ms`} />
      </dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="uppercase tracking-[0.14em] text-muted">{k}</dt>
      <dd className="text-right text-ivory/80">{v}</dd>
    </>
  );
}
