import type { Basis, Vec3 } from '../types';

/**
 * Out-of-sample PCA projection — the whole reason the layout is PCA.
 *
 * The bake asserts that running this exact arithmetic over the corpus
 * reproduces the baked coordinates to within 1e-3 scene units before it writes
 * anything, so a query placed here lands in the same space the nodes did.
 */
export function projectVector(v: Float32Array, basis: Basis): Vec3 {
  const { mean, comps, scale, dims } = basis;
  const out: Vec3 = [0, 0, 0];

  for (let c = 0; c < 3; c++) {
    const row = c * dims;
    let acc = 0;
    for (let i = 0; i < dims; i++) acc += (v[i] - mean[i]) * comps[row + i];
    out[c] = acc * scale;
  }
  return out;
}

/**
 * Cosine similarity against every corpus vector at once. Both sides are
 * L2-normalised at bake time, so cosine is a plain dot product — cheaper, and
 * it removes a whole class of bug.
 */
export function scoreAll(q: Float32Array, vectors: Float32Array, n: number, dims: number): Float32Array {
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const off = i * dims;
    let acc = 0;
    for (let d = 0; d < dims; d++) acc += q[d] * vectors[off + d];
    out[i] = acc;
  }
  return out;
}
