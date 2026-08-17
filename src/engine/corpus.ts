import type { Basis, Layout } from '../types';

const BASE = import.meta.env.BASE_URL ?? '/';

export interface CorpusBundle {
  layout: Layout;
  vectors: Float32Array;
  basis: Basis;
}

/**
 * Three artifacts, fetched in parallel, all produced by `scripts/bake.py`:
 *
 *   layout.json      nodes with baked positions, the edge list, the PCA scale
 *   vectors.bin      N × dims float32, L2-normalised
 *   projection.bin   float32: mean[dims] then components[3][dims]
 *
 * The basis is binary rather than inlined in the JSON so the browser reproduces
 * the bake bit-for-bit; rounding a 3×384 matrix to text nudges every query.
 */
export async function loadCorpus(): Promise<CorpusBundle> {
  const [layoutRes, vecRes, projRes] = await Promise.all([
    fetch(`${BASE}data/layout.json`),
    fetch(`${BASE}data/vectors.bin`),
    fetch(`${BASE}data/projection.bin`),
  ]);

  for (const [name, res] of [
    ['layout.json', layoutRes],
    ['vectors.bin', vecRes],
    ['projection.bin', projRes],
  ] as const) {
    if (!res.ok) throw new Error(`${name}: ${res.status} ${res.statusText}`);
  }

  const layout = (await layoutRes.json()) as Layout;
  const vectors = new Float32Array(await vecRes.arrayBuffer());
  const proj = new Float32Array(await projRes.arrayBuffer());

  const { dims, nodes } = layout;

  // Guard the two ways these files can silently disagree: a re-bake that
  // changed the corpus without regenerating the binaries, or a partial deploy.
  // Either would leave every position subtly wrong with nothing on screen
  // saying so, which is the one failure mode worth being loud about.
  if (vectors.length !== nodes.length * dims) {
    throw new Error(
      `vectors.bin holds ${vectors.length} floats, expected ${nodes.length}×${dims}. Re-run scripts/bake.py.`,
    );
  }
  if (proj.length !== dims * 4) {
    throw new Error(
      `projection.bin holds ${proj.length} floats, expected ${dims}×4. Re-run scripts/bake.py.`,
    );
  }

  const basis: Basis = {
    mean: proj.subarray(0, dims),
    comps: proj.subarray(dims),
    scale: layout.projection.scale,
    dims,
  };

  return { layout, vectors, basis };
}
