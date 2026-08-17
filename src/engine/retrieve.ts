import type { CorpusNode, Hit } from '../types';
import { scoreAll } from './project';

/** Below this a "hit" is noise dressed up as a result. */
export const HIT_FLOOR = 0.22;
export const TOP_K = 5;

/**
 * Top-k by cosine, with the best-matching chunk identified per node.
 *
 * The chunk index matters downstream: a citation points at a specific sentence,
 * not at a whole project. The node vector was baked over title + blurb + chunks
 * + tech, so the node tells you *which* entry is relevant while the chunk scan
 * tells you *what to quote* — and that second question needs its own comparison.
 */
export function retrieve(
  queryVec: Float32Array,
  vectors: Float32Array,
  nodes: CorpusNode[],
  dims: number,
  k = TOP_K,
): Hit[] {
  const scores = scoreAll(queryVec, vectors, nodes.length, dims);

  return Array.from(scores)
    .map((score, i) => ({ i, score }))
    .filter((x) => x.score >= HIT_FLOOR)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ i, score }) => ({
      id: nodes[i].id,
      score,
      chunk: 0,
    }));
}

/**
 * Which sentence of a hit to quote.
 *
 * Chunks are not embedded at bake time — only the node is — so this cannot be a
 * vector comparison without shipping a second, much larger binary. Term overlap
 * against the query is a deliberate downgrade: it is honest about being lexical,
 * it costs nothing, and picking the wrong sentence from the right node is a far
 * smaller error than picking the wrong node.
 */
export function bestChunk(query: string, node: CorpusNode): number {
  const terms = new Set(
    query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2),
  );
  if (!terms.size || !node.chunks.length) return 0;

  let best = 0;
  let bestScore = -1;

  node.chunks.forEach((chunk, i) => {
    const words = chunk.toLowerCase().split(/[^a-z0-9]+/);
    let hits = 0;
    for (const w of words) if (terms.has(w)) hits++;
    // Normalise by length so a long chunk doesn't win on volume alone.
    const score = hits / Math.sqrt(words.length || 1);
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });

  return best;
}
