import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, LineSegments, Mesh } from 'three';
import { useStore } from '../store/useStore';
import { QUERY_COLOR } from './palette';

/**
 * The visitor's question, as a point in the same space as everything else.
 *
 * Its position comes from `projectVector` — the baked PCA basis applied to the
 * freshly embedded query — and never from averaging what it retrieved. That
 * distinction is the entire claim the legend makes, so it is worth restating
 * here: if this were interpolated, the node would always sit reassuringly in
 * the middle of its own results and would prove nothing.
 */
export function QueryNode() {
  const queryPos = useStore((s) => s.queryPos);
  const ref = useRef<Mesh>(null);
  const grow = useRef(0);

  useEffect(() => {
    grow.current = 0;
  }, [queryPos]);

  useFrame((state, dt) => {
    if (!ref.current || !queryPos) return;
    const d = Math.min(dt, 0.1);
    grow.current += (1 - grow.current) * (1 - Math.exp(-5 * d));

    // A slow breath so it reads as live rather than placed.
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.06;
    const s = grow.current * 0.5 * pulse;
    ref.current.scale.setScalar(s);
    ref.current.position.set(queryPos[0], queryPos[1], queryPos[2]);
  });

  if (!queryPos) return null;

  return (
    <mesh ref={ref} scale={0}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial color={QUERY_COLOR} toneMapped={false} wireframe />
    </mesh>
  );
}

/** Query → hit links. Drawn only while an answer is on screen. */
export function RetrievalBeams() {
  const queryPos = useStore((s) => s.queryPos);
  const hits = useStore((s) => s.hits);
  const nodes = useStore((s) => s.nodes);
  const ref = useRef<LineSegments>(null);
  const reveal = useRef(0);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    if (!queryPos || !hits.length) return g;

    const pos: number[] = [];
    for (const h of hits) {
      const n = nodes.find((x) => x.id === h.id);
      if (!n) continue;
      pos.push(queryPos[0], queryPos[1], queryPos[2], n.pos[0], n.pos[1], n.pos[2]);
    }
    g.setAttribute('position', new Float32BufferAttribute(pos, 3));
    return g;
  }, [queryPos, hits, nodes]);

  useEffect(() => {
    reveal.current = 0;
  }, [geometry]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const d = Math.min(dt, 0.1);
    reveal.current += (1 - reveal.current) * (1 - Math.exp(-4 * d));
    const mat = ref.current.material as { opacity: number };
    mat.opacity = reveal.current * 0.55;
  });

  if (!queryPos || !hits.length) return null;

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial
        color={QUERY_COLOR}
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </lineSegments>
  );
}
