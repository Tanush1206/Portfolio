import type { AnswerSegment, CorpusNode, Hit } from '../types';

/** Above this, two chunks are saying the same thing in different words. */
const DUPLICATE_AT = 0.55;

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 3),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

/**
 * Assemble an extractive answer from what was retrieved.
 *
 * Nothing here is generated: every sentence after the lead is a chunk lifted
 * verbatim from the corpus, and the lead only states what retrieval did.
 *
 * Deduplication happens **before** composing, not after. Two projects can
 * describe the same technique in near-identical words, and stitching first
 * produces an answer that repeats itself with two different citations hanging
 * off it — which reads as a bug in the retrieval rather than as two genuinely
 * related pieces of work. Merging first turns that into one sentence carrying
 * both citations, which is what it actually is.
 */
export function compose(hits: Hit[], nodes: CorpusNode[]): AnswerSegment[] {
  if (!hits.length) {
    return [
      {
        text: 'Nothing in the corpus is close enough to that to answer honestly. Try asking about retrieval, data analysis, or something shipped to users.',
      },
    ];
  }

  const byId = new Map(nodes.map((n) => [n.id, n]));

  // One candidate sentence per hit, in score order.
  const candidates = hits
    .map((h) => {
      const node = byId.get(h.id);
      if (!node) return null;
      const text = node.chunks[h.chunk] ?? node.blurb;
      return text ? { text, cites: [h.id], toks: tokens(text), score: h.score } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const merged: typeof candidates = [];
  for (const c of candidates) {
    const twin = merged.find((m) => jaccard(m.toks, c.toks) >= DUPLICATE_AT);
    if (twin) {
      // Keep the higher-scoring phrasing, and let the sentence cite both.
      if (!twin.cites.includes(c.cites[0])) twin.cites.push(c.cites[0]);
    } else {
      merged.push({ ...c, cites: [...c.cites] });
    }
  }

  const names = merged
    .flatMap((m) => m.cites)
    .map((id) => byId.get(id)?.title)
    .filter(Boolean);

  const lead =
    names.length === 1
      ? `One thing in the corpus matches: ${names[0]}.`
      : `${names.length} things match, closest first.`;

  return [{ text: lead }, ...merged.map(({ text, cites }) => ({ text, cites }))];
}
