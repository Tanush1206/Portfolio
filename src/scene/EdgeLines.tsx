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
export function EdgeLines() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const { solid, dashed } = useMemo(() => {
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
        c.copy(CLUSTER_COLOR[a.cluster]).multiplyScalar(0.25 + t * 0.75);
        col.push(c.r, c.g, c.b);
        c.copy(CLUSTER_COLOR[b.cluster]).multiplyScalar(0.25 + t * 0.75);
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
  }, [nodes, edges]);

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
