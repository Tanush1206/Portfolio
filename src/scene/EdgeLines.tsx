import { useLayoutEffect, useMemo, useRef } from 'react';
import { BufferGeometry, Color, Float32BufferAttribute, LineSegments } from 'three';
import { useStore } from '../store/useStore';
import { CLUSTER_COLOR } from './palette';

/**
 * Two line sets, because they mean different things.
 *
 * Solid links are real: cosine above the 0.42 threshold. Dashed links are
 * forced — they sit below threshold and exist only so that the nine nodes
 * nothing is strongly about don't float unconnected. Drawing them differently
 * is what lets the legend state the threshold honestly instead of quietly
 * relaxing it to make the picture tidier.
 */
/**
 * Matches the node dim factor in NodeCloud. A retrieval that darkens the nodes
 * but leaves their links at full brightness reads as "retrieval didn't work" —
 * the lobe still glows via its edges while its nodes go dark.
 */
const DIM = 0.22;

export function EdgeLines() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const hits = useStore((s) => s.hits);

  const { solid, dashed } = useMemo(() => {
    const hitIds = new Set(hits.map((h) => h.id));
    const dimming = hitIds.size > 0;

    const build = (subset: typeof edges) => {
      const pos: number[] = [];
      const col: number[] = [];
      const c = new Color();

      for (const e of subset) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        if (!a || !b) continue;
        pos.push(...a.pos, ...b.pos);

        // Weight drives brightness, so a strong link reads as one without
        // needing a second material.
        const t = Math.min(1, Math.max(0, (e.w - 0.3) / 0.45));
        const base = 0.25 + t * 0.75;

        // An edge survives only if it touches something retrieved. Dimming
        // per-endpoint instead would leave half-lit links pointing out of the
        // result into the dark, which looks like a rendering fault.
        const lit = !dimming || hitIds.has(a.id) || hitIds.has(b.id);
        const k = lit ? base : base * DIM;

        c.copy(CLUSTER_COLOR[a.cluster]).multiplyScalar(k);
        col.push(c.r, c.g, c.b);
        c.copy(CLUSTER_COLOR[b.cluster]).multiplyScalar(k);
        col.push(c.r, c.g, c.b);
      }

      const g = new BufferGeometry();
      g.setAttribute('position', new Float32BufferAttribute(pos, 3));
      g.setAttribute('color', new Float32BufferAttribute(col, 3));
      return g;
    };

    return {
      solid: build(edges.filter((e) => !e.forced)),
      dashed: build(edges.filter((e) => e.forced)),
    };
  }, [nodes, edges, hits]);

  // LineDashedMaterial needs per-vertex distance along each segment, and it
  // renders solid — silently — without this. It lives on the Line object rather
  // than the geometry, so it has to run after the ref is attached.
  const dashedRef = useRef<LineSegments>(null);
  useLayoutEffect(() => {
    dashedRef.current?.computeLineDistances();
  }, [dashed]);

  if (!nodes.length) return null;

  return (
    <group>
      <lineSegments geometry={solid}>
        <lineBasicMaterial vertexColors transparent opacity={0.34} depthWrite={false} />
      </lineSegments>
      <lineSegments ref={dashedRef} geometry={dashed}>
        <lineDashedMaterial
          vertexColors
          dashSize={0.28}
          gapSize={0.34}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
