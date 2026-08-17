export type Vec3 = [number, number, number];

export type NodeType = 'project' | 'experience' | 'skill';
export type Cluster = 'ml' | 'eng' | 'data';

export interface CorpusNode {
  id: string;
  type: NodeType;
  title: string;
  cluster: Cluster;
  blurb: string;
  chunks: string[];
  tech: string[];
  metrics: string[];
  links: { repo?: string | null; demo?: string | null };
  /** From the bake. Never hand-placed. */
  pos: Vec3;
}

export interface Edge {
  a: number;
  b: number;
  /** Cosine similarity between the two endpoints. */
  w: number;
  /**
   * True when this link sits below `edgeThreshold` and exists only to give an
   * otherwise unconnected node a single strongest neighbour. Drawn dimmed and
   * dashed so the threshold keeps meaning what it says.
   */
  forced: boolean;
}

/**
 * The PCA basis, read from projection.bin. This is what lets a query vector be
 * placed at its true position rather than interpolated from what it retrieved:
 *
 *     pos = ((q - mean) @ componentsᵀ) * scale
 */
export interface Basis {
  mean: Float32Array;
  /** Row-major, 3 × dims. */
  comps: Float32Array;
  scale: number;
  dims: number;
}

export interface Layout {
  model: string;
  dims: number;
  edgeThreshold: number;
  sceneScale: number;
  projection: { file: string; layout: string; scale: number };
  nodes: CorpusNode[];
  edges: Edge[];
}

export interface Hit {
  id: string;
  score: number;
  /** Index into the node's `chunks`. */
  chunk: number;
}

export interface AnswerSegment {
  text: string;
  /** A sentence stitched from two chunks cites two nodes. */
  cites?: string[];
}
