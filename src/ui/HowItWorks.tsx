import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store/useStore';

/**
 * The panel that turns the visual into evidence.
 *
 * Every figure quoted here is read from the bake's own output, so a re-bake
 * updates the copy rather than leaving a confident stale number on screen.
 * The two limitations — pure cosine matching topic rather than intent, and how
 * little variance three components hold — are stated outright. Being precise
 * about what the projection cannot do is the part that reads as understanding.
 */
export function HowItWorks() {
  const [open, setOpen] = useState(false);
  const nodes = useStore((s) => s.nodes);
  const stats = useStore((s) => s.stats);
  const dims = useStore((s) => s.basis?.dims ?? 384);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const variance = stats
    ? `${(stats.explainedVariance.reduce((a, b) => a + b, 0) * 100).toFixed(1)}%`
    : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="pointer-events-auto mt-[11px] border border-muted/20 px-[7px] py-[4px] font-mono text-[11px] uppercase leading-[11px] tracking-[0.14em] text-muted transition-colors hover:border-ivory hover:text-ivory"
      >
        how this works
      </button>

      {/*
        Portalled to <body> rather than rendered in place. The trigger lives
        inside the header, which is `absolute z-20` and therefore its own
        stacking context — a z-40 child of it still cannot paint above a z-20
        sibling of the header. The overlay has to leave that subtree entirely.
      */}
      {open &&
        createPortal(
          <div
            className="pointer-events-auto fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-void/90 p-[22px]"
            onClick={() => setOpen(false)}
          >
          <article
            className="my-[44px] w-[min(680px,100%)] border border-muted/20 bg-panel p-[33px]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-[22px]">
              <h2 className="font-display text-lg text-ivory">How this works</h2>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 border border-muted/20 px-[7px] py-[4px] font-mono text-[11px] leading-[11px] text-muted transition-colors hover:text-ivory"
              >
                ESC
              </button>
            </header>

            <p className="mt-[22px] font-body text-base text-ivory/80">
              This page is a retrieval system with its index drawn to scale. There is no server
              and no API key — the only thing that ever leaves your browser is the request for
              the model weights themselves.
            </p>

            <ol className="mt-[33px] flex flex-col gap-[22px]">
              <Step
                n="01"
                title="Bake, offline"
                body={`Each of the ${nodes.length || 45} entries is embedded once with all-MiniLM-L6-v2 into ${dims} dimensions, then reduced to three by PCA. Those coordinates are committed as a file. Nothing in the cloud is hand-placed — every position is where the embedding put it.`}
              />
              <Step
                n="02"
                title="Your question, embedded here"
                body="The same model runs in a Web Worker in your browser. Weights are fetched once from Hugging Face and cached; your question is never transmitted."
              />
              <Step
                n="03"
                title="Projected through the same basis"
                body="The query is projected using the PCA mean and components exported by the bake, so it earns a real position rather than being placed among whatever it happened to match. The build fails if that projection stops reproducing the baked coordinates."
              />
              <Step
                n="04"
                title="Retrieved by dot product"
                body="Every vector is unit length, so cosine similarity is a plain dot product across the whole corpus. What survives a relative floor is what you see cited."
              />
            </ol>

            <Caveat title="Scores are pure cosine — no reranking, no type weighting.">
              That is why a query about intent — "what have you built" — can surface skill nodes
              above the project itself. Dense retrieval matches topic, not intent. Weighting
              projects upward would read better and measure less, so it isn't done.
            </Caveat>

            <Caveat title="The three axes are a lossy view, on purpose.">
              Positions are PCA projections of real embeddings, holding{' '}
              {variance ?? 'about 27%'} of the variance. The lobes are meaningful and near
              neighbours are trustworthy — {stats ? (stats.retentionMean * 100).toFixed(0) : '54'}
              % of each node's five nearest neighbours in {dims} dimensions are still among its
              five nearest here — but distances between far-apart nodes are not.
            </Caveat>

            <p className="mt-[33px] font-body text-sm text-muted">
              Drag to orbit, scroll to zoom, click any node. Press{' '}
              <span className="font-mono text-[11px] text-ivory/80">/</span> to focus the
              question box.
            </p>
            </article>
          </div>,
          document.body,
        )}
    </>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-[22px]">
      <span className="shrink-0 font-mono text-[11px] leading-[26px] text-muted">{n}</span>
      <div>
        <h3 className="font-mono text-[11px] uppercase leading-[11px] tracking-[0.14em] text-ivory">
          {title}
        </h3>
        <p className="mt-[11px] font-body text-base text-ivory/80">{body}</p>
      </div>
    </li>
  );
}

function Caveat({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-[33px] border-l border-muted/40 pl-[22px]">
      <h3 className="font-body text-base text-ivory">{title}</h3>
      <p className="mt-[11px] font-body text-sm text-muted">{children}</p>
    </section>
  );
}
