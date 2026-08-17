import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { projectVector } from './project';
import type { Incoming, Outgoing } from './embedder.worker';
import type { CorpusNode } from '../types';

/**
 * The exact string the bake embedded for a node. Must stay in lockstep with
 * `embedding_text()` in scripts/bake.py — the parity check below is what
 * catches it if it drifts.
 */
export function embeddingText(node: CorpusNode): string {
  return [node.title, node.blurb, ...node.chunks, ...node.tech].filter(Boolean).join('. ');
}

/**
 * Owns the embedding worker.
 *
 * The model is fetched lazily and the query bar stays live throughout, so a
 * query submitted at 40% is held as 'queued' and promoted the moment the model
 * reports ready — the store's `setModelStatus` does that promotion, and the
 * effect below watches for 'embedding' and dispatches.
 */
export function useEmbedder() {
  const corpusReady = useStore((s) => s.corpusReady);
  const queryStatus = useStore((s) => s.queryStatus);
  const query = useStore((s) => s.query);
  const actions = useStore((s) => s.actions);

  const workerRef = useRef<Worker | null>(null);
  const seq = useRef(0);
  const parityDone = useRef(false);

  /**
   * Bumped every time a worker is created. StrictMode mounts effects twice in
   * dev: the first worker is created, torn down, and replaced. Anything that
   * posted to the first one never gets a reply, so work that should happen
   * once per *worker* has to key off this rather than off mount.
   */
  const [workerGen, setWorkerGen] = useState(0);

  useEffect(() => {
    // Vite resolves this at build time; no bundler config, no CDN, and the
    // worker is a real module worker rather than a blob shim.
    const worker = new Worker(new URL('./embedder.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<Outgoing>) => {
      const msg = e.data;
      if (msg.type === 'progress') actions.setModelProgress(msg.value);
      else if (msg.type === 'ready') actions.setModelStatus('ready');
      else if (msg.type === 'error') actions.setModelStatus('error', msg.message);
      else if (msg.type === 'embedding') {
        if (msg.id === -1) {
          verifyParity(msg.vector);
          return;
        }
        // Ignore a stale reply from a query the visitor has since replaced.
        if (msg.id !== seq.current) return;
        actions.applyEmbedding(msg.vector, msg.ms);
      }
    };

    actions.setModelStatus('loading');
    worker.postMessage({ type: 'load' } satisfies Incoming);
    parityDone.current = false;
    setWorkerGen((g) => g + 1);

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [actions]);

  // Dispatch whenever the store says a query is ready to be embedded.
  useEffect(() => {
    if (queryStatus !== 'embedding' || !workerRef.current) return;
    seq.current += 1;
    workerRef.current.postMessage({
      type: 'embed',
      id: seq.current,
      text: query,
    } satisfies Incoming);
  }, [queryStatus, query]);

  /**
   * Prove the TypeScript projection agrees with NumPy, in dev, once.
   *
   * The bake asserts its own replay, but that only proves the exported basis
   * reproduces the bake *inside Python*. It says nothing about whether
   * `projectVector` here reads `comps` the same way — a transposed matmul or a
   * row/column mix-up produces plausible-looking coordinates in the right
   * ballpark rather than a crash, and the cloud would look completely normal
   * while every query landed somewhere subtly wrong.
   *
   * So: embed a corpus node's exact bake text in the browser and check it lands
   * on its own baked coordinate.
   */
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!corpusReady || parityDone.current || !workerRef.current || !workerGen) return;
    const node = useStore.getState().nodes[0];
    if (!node) return;
    parityDone.current = true;
    workerRef.current.postMessage({
      type: 'embed',
      id: -1,
      text: embeddingText(node),
    } satisfies Incoming);
  }, [corpusReady, workerGen]);
}

function verifyParity(vector: Float32Array) {
  const { nodes, basis } = useStore.getState();
  const node = nodes[0];
  if (!node || !basis) return;

  const norm = Math.hypot(...Array.from(vector));
  const got = projectVector(vector, basis);
  const want = node.pos;
  const drift = Math.hypot(got[0] - want[0], got[1] - want[1], got[2] - want[2]);

  const label = `[parity] ${node.title}`;
  const detail = {
    baked: want.map((v) => +v.toFixed(4)),
    browser: got.map((v) => +v.toFixed(4)),
    drift: +drift.toFixed(4),
    queryNorm: +norm.toFixed(6),
  };

  // The tolerance is loose on purpose: the bake runs fp32 PyTorch and the
  // browser runs an int8-quantised ONNX graph, so the vectors are close but not
  // identical. A transposed matmul misses by scene units, not by hundredths.
  if (drift > 0.5) {
    console.error(`${label} FAILED — projection disagrees with the bake`, detail);
  } else if (Math.abs(norm - 1) > 1e-3) {
    console.error(`${label} FAILED — browser embedding is not unit length, so the dot product in retrieve.ts is not cosine`, detail);
  } else {
    console.info(`${label} ok`, detail);
  }
}
