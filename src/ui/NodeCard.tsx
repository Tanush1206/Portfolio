import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { screenPosOf } from '../scene/screen';
import { CLUSTER_HEX } from '../scene/palette';

/**
 * Hover tooltip. It follows the node in 3D by reading the module-level screen
 * buffer in its own rAF and writing `transform` directly — never through React
 * state, which would re-render this subtree every frame the camera moves.
 */
export function NodeTooltip() {
  const hoveredNode = useStore((s) => s.hoveredNode);
  const selectedNode = useStore((s) => s.selectedNode);
  const nodes = useStore((s) => s.nodes);
  const ref = useRef<HTMLDivElement>(null);

  // The detail panel already says everything the tooltip would, so showing both
  // just puts the same title on screen twice.
  const node = selectedNode ? null : nodes.find((n) => n.id === hoveredNode);

  useEffect(() => {
    if (!hoveredNode) return;
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      const p = screenPosOf(hoveredNode);
      if (el) {
        if (p) {
          el.style.transform = `translate3d(${p.x + 14}px, ${p.y - 10}px, 0)`;
          el.style.opacity = '1';
        } else {
          el.style.opacity = '0';
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hoveredNode]);

  if (!node) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-0 top-0 z-20 max-w-[280px] border border-muted/20 bg-panel px-[11px] py-[11px]"
      style={{ opacity: 0 }}
    >
      <div className="flex items-center gap-[7px]">
        <span
          className="inline-block h-[7px] w-[7px] shrink-0"
          style={{ background: CLUSTER_HEX[node.cluster] }}
        />
        <span className="font-mono text-[11px] leading-[11px] text-ivory">{node.title}</span>
      </div>
      <p className="mt-[11px] font-body text-sm text-muted">{node.blurb}</p>
    </div>
  );
}

/** Detail panel for the selected node. Selection and hover are separate state. */
export function NodeDetail() {
  const selectedNode = useStore((s) => s.selectedNode);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const actions = useStore((s) => s.actions);

  const idx = nodes.findIndex((n) => n.id === selectedNode);
  if (idx < 0) return null;
  const node = nodes[idx];

  const neighbours = edges
    .filter((e) => e.a === idx || e.b === idx)
    .map((e) => ({ node: nodes[e.a === idx ? e.b : e.a], w: e.w, forced: e.forced }))
    .sort((x, y) => y.w - x.w)
    .slice(0, 6);

  return (
    <aside className="pointer-events-auto absolute right-0 top-0 z-20 flex h-full w-[min(380px,86vw)] flex-col gap-[22px] overflow-y-auto border-l border-muted/20 bg-panel p-[22px]">
      <header className="flex items-start justify-between gap-[11px]">
        <div>
          <div className="font-mono text-[11px] uppercase leading-[11px] tracking-[0.14em] text-muted">
            {node.type}
          </div>
          <h2 className="mt-[11px] font-display text-lg text-ivory">{node.title}</h2>
        </div>
        <button
          onClick={() => actions.selectNode(null)}
          className="shrink-0 border border-muted/20 px-[7px] py-[4px] font-mono text-[11px] leading-[11px] text-muted transition-colors hover:text-ivory"
        >
          ESC
        </button>
      </header>

      <p className="font-body text-base text-ivory/80">{node.blurb}</p>

      <Section label="coordinates">
        <code className="font-mono text-[11px] leading-[17px] text-ivory">
          [{node.pos.map((c) => c.toFixed(3)).join(', ')}]
        </code>
        <p className="mt-[11px] font-body text-sm text-muted">
          Derived by PCA over the embedding of this node's text. Not hand-placed.
        </p>
      </Section>

      {node.metrics.length > 0 && (
        <Section label="metrics">
          <ul className="flex flex-col gap-[11px]">
            {node.metrics.map((m) => (
              <li key={m} className="font-body text-sm text-ivory/80">
                {m}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {node.tech.length > 0 && (
        <Section label="tech">
          <div className="flex flex-wrap gap-[7px]">
            {node.tech.map((t) => (
              <span
                key={t}
                className="border border-muted/20 px-[7px] py-[4px] font-mono text-[11px] leading-[11px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section label={`nearest in latent space (${neighbours.length})`}>
        <ul className="flex flex-col gap-[7px]">
          {neighbours.map((n) => (
            <li key={n.node.id}>
              <button
                onClick={() => actions.selectNode(n.node.id)}
                onMouseEnter={() => actions.hoverNode(n.node.id)}
                onMouseLeave={() => actions.hoverNode(null)}
                className="flex w-full items-center justify-between gap-[11px] border border-transparent px-[7px] py-[4px] text-left transition-colors hover:border-muted/20"
              >
                <span className="truncate font-body text-sm text-ivory/80">{n.node.title}</span>
                <span
                  className={`shrink-0 font-mono text-[11px] leading-[11px] ${
                    n.forced ? 'text-muted' : 'text-ivory'
                  }`}
                  title={n.forced ? 'below threshold — forced min-degree link' : undefined}
                >
                  {n.w.toFixed(3)}
                  {n.forced ? ' ·' : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {(node.links.repo || node.links.demo) && (
        <Section label="links">
          <div className="flex flex-wrap gap-[11px]">
            {node.links.repo && <ExtLink href={node.links.repo}>repo</ExtLink>}
            {node.links.demo && <ExtLink href={node.links.demo}>demo</ExtLink>}
          </div>
        </Section>
      )}
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-[11px] font-mono text-[11px] uppercase leading-[11px] tracking-[0.14em] text-muted">
        {label}
      </h3>
      {children}
    </section>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="border border-muted/20 px-[7px] py-[4px] font-mono text-[11px] leading-[11px] text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
    >
      {children} ↗
    </a>
  );
}
