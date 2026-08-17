import { useStore } from '../store/useStore';

/**
 * The answer, assembled from retrieved chunks.
 *
 * Every sentence below the lead is lifted verbatim from the corpus and carries
 * the citation chips that say where it came from. Those chips are what
 * CitationLines draws to — they carry `data-cite` so the overlay can find them
 * without the two components sharing state.
 */
export function AnswerPanel() {
  const segments = useStore((s) => s.segments);
  const hits = useStore((s) => s.hits);
  const nodes = useStore((s) => s.nodes);
  const hoveredCite = useStore((s) => s.hoveredCite);
  const actions = useStore((s) => s.actions);

  if (!segments.length) return null;

  const titleOf = (id: string) => nodes.find((n) => n.id === id)?.title ?? id;
  const scoreOf = (id: string) => hits.find((h) => h.id === id)?.score;

  return (
    // Bottom stop clears the collapsed legend and its margin; the legend folds
    // itself away on the first answer so the two never stack.
    <aside className="pointer-events-auto absolute left-0 top-0 z-20 m-[22px] mt-[176px] flex max-h-[calc(100%-300px)] w-[min(420px,86vw)] flex-col gap-[22px] overflow-y-auto border border-muted/20 bg-panel p-[22px]">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase leading-[11px] tracking-[0.14em] text-muted">
          answer
        </h2>
        <button
          onClick={() => actions.reset()}
          className="border border-muted/20 px-[7px] py-[4px] font-mono text-[11px] leading-[11px] text-muted transition-colors hover:text-ivory"
        >
          clear
        </button>
      </div>

      {segments.map((seg, i) => (
        <p key={i} className="font-body text-base text-ivory/80">
          {seg.text}
          {seg.cites?.length ? (
            <span className="ml-[7px] inline-flex flex-wrap gap-[7px] align-middle">
              {seg.cites.map((id) => (
                <button
                  key={id}
                  data-cite={id}
                  data-seg={i}
                  onMouseEnter={() => actions.hoverCite(id)}
                  onMouseLeave={() => actions.hoverCite(null)}
                  onClick={() => actions.selectNode(id)}
                  className={`border px-[7px] py-[2px] font-mono text-[11px] leading-[11px] transition-colors ${
                    hoveredCite === id
                      ? 'border-query bg-query/15 text-query'
                      : 'border-query/40 text-query/80'
                  }`}
                  title={titleOf(id)}
                >
                  {titleOf(id)}
                  {scoreOf(id) !== undefined && (
                    <span className="ml-[7px] text-query/60">{scoreOf(id)!.toFixed(3)}</span>
                  )}
                </button>
              ))}
            </span>
          ) : null}
        </p>
      ))}

      {/* Only claim this when there is something quoted. On the no-match path
          the sentence above is the one piece of prose the app writes itself,
          and a footer insisting everything is quoted would be false. */}
      {hits.length > 0 && (
        <p className="font-body text-sm text-muted">
          Extractive — every sentence above is quoted from the corpus, not generated. Scores are
          cosine similarity against your question.
        </p>
      )}
    </aside>
  );
}
