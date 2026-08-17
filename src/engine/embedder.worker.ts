/// <reference lib="webworker" />
import { env, pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';

/**
 * The embedding model, off the main thread.
 *
 * MODEL PARITY IS NON-NEGOTIABLE. The bake used
 * `sentence-transformers/all-MiniLM-L6-v2`; this uses `Xenova/all-MiniLM-L6-v2`,
 * which is the same weights and the same tokeniser converted to ONNX. If these
 * ever diverge, the query lands in the wrong region of the cloud and every
 * retrieval is confidently wrong with nothing on screen saying so.
 *
 * Weights are cached by transformers.js in the Cache API / IndexedDB, never
 * localStorage — the model is ~23 MB and localStorage is a ~5 MB synchronous
 * string store.
 */

// Remote only. There are no model files in /public; allowLocalModels left on
// makes the browser try a same-origin fetch first and log a 404 per file.
env.allowLocalModels = false;

/**
 * Serve the onnxruntime runtime from this origin, not from a CDN.
 *
 * vite.config.ts aliases onnxruntime-web to its CPU-only build — nothing here
 * needs WebGPU, and a MiniLM query embeds in ~10 ms warm on CPU, so the jsep
 * build is 10 MB of wasm that never executes. Left alone, that build resolves
 * its runtime files relative to the script and falls back to a CDN, quietly
 * reintroducing a third-party dependency at runtime.
 *
 * Both files are vendored into `public/ort/`. They cannot be imported from
 * node_modules with `?url` instead — onnxruntime-web's `exports` map does not
 * expose `./dist/*`, so Vite refuses the deep import outright.
 *
 * See the `serve-ort-raw` plugin in vite.config.ts for why the dev server needs
 * help with these two specific files.
 */
env.backends.onnx.wasm!.wasmPaths = {
  wasm: '/ort/ort-wasm-simd-threaded.wasm',
  mjs: '/ort/ort-wasm-simd-threaded.mjs',
};

// One worker, one inference thread. Cross-origin isolation headers would be
// required for real wasm threads, and without them onnxruntime spawns a worker
// pool that immediately falls back to single-threaded anyway — noisily.
env.backends.onnx.wasm!.numThreads = 1;

const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

export type Incoming = { type: 'load' } | { type: 'embed'; id: number; text: string };

export type Outgoing =
  | { type: 'progress'; value: number }
  | { type: 'ready' }
  | { type: 'error'; message: string }
  | { type: 'embedding'; id: number; vector: Float32Array; ms: number };

let extractor: FeatureExtractionPipeline | null = null;
let loading: Promise<void> | null = null;

/**
 * `pipeline` is overloaded across every task the library supports, and asking
 * TypeScript to resolve that union blows past its complexity limit (TS2590).
 * Narrowing to the one signature actually used costs nothing — the task string
 * and the return type are both pinned here.
 */
const featureExtraction = pipeline as unknown as (
  task: 'feature-extraction',
  model: string,
  options: Record<string, unknown>,
) => Promise<FeatureExtractionPipeline>;

const post = (m: Outgoing, transfer?: Transferable[]) =>
  (self as unknown as Worker).postMessage(m, transfer ?? []);

async function load(): Promise<void> {
  if (extractor) return;
  if (loading) return loading;

  loading = (async () => {
    // Progress arrives per-file and each file reports its own 0–100, so the
    // raw events sawtooth. Track bytes across all files instead, which is what
    // the visitor actually experiences as a download.
    const seen = new Map<string, { loaded: number; total: number }>();

    extractor = await featureExtraction('feature-extraction', MODEL_ID, {
      dtype: 'q8',
      progress_callback: (p: unknown) => {
        const e = p as { file?: string; loaded?: number; total?: number; status?: string };
        if (!e.file || typeof e.total !== 'number' || !e.total) return;
        seen.set(e.file, { loaded: e.loaded ?? 0, total: e.total });
        let loaded = 0;
        let total = 0;
        for (const v of seen.values()) {
          loaded += v.loaded;
          total += v.total;
        }
        if (total > 0) post({ type: 'progress', value: Math.min(1, loaded / total) });
      },
    });
    post({ type: 'progress', value: 1 });
  })();

  return loading;
}

self.onmessage = async (e: MessageEvent<Incoming>) => {
  try {
    if (e.data.type === 'load') {
      await load();
      post({ type: 'ready' });
      return;
    }

    if (e.data.type === 'embed') {
      await load();
      const t0 = performance.now();

      // Mean pooling + L2 normalisation, matching what
      // sentence-transformers does by default for this model. `normalize: true`
      // here is what makes the dot product in retrieve.ts an actual cosine —
      // without it every score is scaled by an arbitrary magnitude.
      const out = await extractor!(e.data.text, { pooling: 'mean', normalize: true });
      const vector = Float32Array.from(out.data as Float32Array);
      const ms = performance.now() - t0;

      post({ type: 'embedding', id: e.data.id, vector, ms }, [vector.buffer]);
    }
  } catch (err) {
    post({ type: 'error', message: err instanceof Error ? err.message : String(err) });
  }
};
