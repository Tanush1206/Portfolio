import { create } from 'zustand';
import { loadCorpus } from '../engine/corpus';
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
