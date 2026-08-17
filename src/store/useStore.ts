import { create } from 'zustand';
import { loadCorpus } from '../engine/corpus';
import { projectVector } from '../engine/project';
import { bestChunk, retrieve } from '../engine/retrieve';
import { compose } from '../engine/compose';
import type { AnswerSegment, Basis, CorpusNode, Edge, Hit, Vec3 } from '../types';

/**
 * Model loading and query lifecycle are separate state machines on purpose.
 *
 * The model loads lazily while the query bar stays usable, so a visitor will
 * type before it is ready. That state is "model at 60% AND a query is queued",
 * which a single enum cannot hold — with one enum you either block the input or
 * drop the submission. `queryStatus: 'queued'` is what lets the query be
 * accepted, shown pending, and run the moment `modelStatus` reaches 'ready'.
 */
export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';
export type QueryStatus = 'idle' | 'queued' | 'embedding' | 'retrieving' | 'answering';

interface State {
  // ── corpus: immutable once loaded ──
  nodes: CorpusNode[];
  edges: Edge[];
  vectors: Float32Array | null;
  basis: Basis | null;
  edgeThreshold: number;
  corpusReady: boolean;

  // ── model ──
  modelStatus: ModelStatus;
  modelProgress: number;
  error: string | null;

  // ── query ──
  query: string;
  queryStatus: QueryStatus;
  queryVec: Float32Array | null;
  /** From the PCA basis. Never interpolated from what it retrieved. */
  queryPos: Vec3 | null;
  embedMs: number | null;

  // ── retrieval ──
  hits: Hit[];
  activeHit: string | null;

  // ── answer ──
  segments: AnswerSegment[];
  hoveredCite: string | null;

  // ── interaction ──
  hoveredNode: string | null;
  selectedNode: string | null;

  // ── camera intent: the rig reads this and never writes back ──
  focusId: string | null;
  camTarget: Vec3;

  actions: {
    loadCorpus: () => Promise<void>;
    setQuery: (q: string) => void;
    submit: () => void;
    setModelProgress: (v: number) => void;
    setModelStatus: (s: ModelStatus, error?: string) => void;
    /** Called with the query's embedding: projects it, then retrieves. */
    applyEmbedding: (vec: Float32Array, ms: number) => void;
    hoverNode: (id: string | null) => void;
    selectNode: (id: string | null) => void;
    hoverCite: (id: string | null) => void;
    setActiveHit: (id: string | null) => void;
    focus: (id: string | null) => void;
    reset: () => void;
  };
}

const ORIGIN: Vec3 = [0, 0, 0];

export const useStore = create<State>((set, get) => ({
  nodes: [],
  edges: [],
  vectors: null,
  basis: null,
  edgeThreshold: 0.42,
  corpusReady: false,

  modelStatus: 'idle',
  modelProgress: 0,
  error: null,

  query: '',
  queryStatus: 'idle',
  queryVec: null,
  queryPos: null,
  embedMs: null,

  hits: [],
  activeHit: null,

  segments: [],
  hoveredCite: null,

  hoveredNode: null,
  selectedNode: null,

  focusId: null,
  camTarget: ORIGIN,

  actions: {
    async loadCorpus() {
      if (get().corpusReady) return;
      try {
        const { layout, vectors, basis } = await loadCorpus();
        set({
          nodes: layout.nodes,
          edges: layout.edges,
          edgeThreshold: layout.edgeThreshold,
          vectors,
          basis,
          corpusReady: true,
        });
      } catch (e) {
        set({ error: e instanceof Error ? e.message : String(e) });
      }
    },

    setQuery: (query) => set({ query }),

    /**
     * Accept the query regardless of whether the model is ready. Phase 2 drains
     * 'queued' the moment `modelStatus` reaches 'ready'; until the embedder
     * exists, queued is simply where a submission waits. Never block the input.
     */
    submit: () => {
      const { query, modelStatus } = get();
      if (!query.trim()) return;
      set({ queryStatus: modelStatus === 'ready' ? 'embedding' : 'queued' });
    },

    setModelProgress: (modelProgress) => set({ modelProgress }),

    setModelStatus: (modelStatus, error) => {
      set({ modelStatus, ...(error ? { error } : {}) });
      // A query submitted while the model was still downloading is waiting on
      // exactly this transition. Promote it rather than making the visitor
      // press enter a second time on text they already typed.
      if (modelStatus === 'ready' && get().queryStatus === 'queued') {
        set({ queryStatus: 'embedding' });
      }
    },

    applyEmbedding: (vec, ms) => {
      const { basis, vectors, nodes, query } = get();
      if (!basis || !vectors) return;

      set({ queryStatus: 'retrieving', queryVec: vec, embedMs: ms });

      // The query earns its position the same way every node did — projected
      // through the baked PCA basis, never interpolated from what it retrieved.
      const queryPos = projectVector(vec, basis);

      const hits = retrieve(vec, vectors, nodes, basis.dims).map((h) => {
        const node = nodes.find((n) => n.id === h.id)!;
        return { ...h, chunk: bestChunk(query, node) };
      });

      set({
        queryPos,
        hits,
        segments: compose(hits, nodes),
        queryStatus: 'answering',
        // Look at the retrieved region rather than the query point itself: the
        // query often lands in empty space, and framing empty space is a worse
        // answer than framing what it found.
        camTarget: hits.length ? centroidOf(hits, nodes) : queryPos,
        focusId: null,
        selectedNode: null,
      });
    },

    hoverNode: (hoveredNode) => set({ hoveredNode }),

    selectNode: (id) => {
      const node = id ? get().nodes.find((n) => n.id === id) : null;
      set({
        selectedNode: id,
        focusId: id,
        camTarget: node ? node.pos : ORIGIN,
      });
    },

    hoverCite: (hoveredCite) => set({ hoveredCite }),

    setActiveHit: (activeHit) => set({ activeHit }),

    focus: (id) => {
      const node = id ? get().nodes.find((n) => n.id === id) : null;
      set({ focusId: id, camTarget: node ? node.pos : ORIGIN });
    },

    reset: () =>
      set({
        query: '',
        queryStatus: 'idle',
        queryVec: null,
        queryPos: null,
        embedMs: null,
        hits: [],
        activeHit: null,
        segments: [],
        hoveredCite: null,
        selectedNode: null,
        focusId: null,
        camTarget: ORIGIN,
      }),
  },
}));

export const useActions = () => useStore((s) => s.actions);

/** Score-weighted centroid of the hits, so the strongest match pulls hardest. */
function centroidOf(hits: Hit[], nodes: CorpusNode[]): Vec3 {
  const out: Vec3 = [0, 0, 0];
  let wsum = 0;
  for (const h of hits) {
    const n = nodes.find((x) => x.id === h.id);
    if (!n) continue;
    const w = Math.max(h.score, 0.01);
    out[0] += n.pos[0] * w;
    out[1] += n.pos[1] * w;
    out[2] += n.pos[2] * w;
    wsum += w;
  }
  if (!wsum) return [0, 0, 0];
  return [out[0] / wsum, out[1] / wsum, out[2] / wsum];
}
