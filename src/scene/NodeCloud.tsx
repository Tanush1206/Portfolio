import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Color, InstancedMesh, Matrix4, Vector3 } from 'three';
import { useStore } from '../store/useStore';
import { nodeColor } from './palette';
import { allocateScreen, screen } from './screen';
import type { CorpusNode } from '../types';

/**
 * Radius per node type. Projects are the objects; skills are the substrate they
 * sit in. This scale gap plus emissive-at-rest is what stops 34 skills from
 * reading as a list with 8 projects buried in it.
 */
const RADIUS: Record<CorpusNode['type'], number> = {
  project: 0.42,
  experience: 0.30,
  skill: 0.17,
};

const HOVER_GROWTH = 0.5;
const SELECT_GROWTH = 0.85;
/** Retrieved nodes swell, so a hit is visible even off to the side of frame. */
const HIT_GROWTH = 0.55;

export function NodeCloud() {
  const nodes = useStore((s) => s.nodes);
  const hoveredNode = useStore((s) => s.hoveredNode);
  const selectedNode = useStore((s) => s.selectedNode);
  const hits = useStore((s) => s.hits);
  // Hovering a citation chip is hovering its node — the chip and the point are
  // the same object stated twice, so they highlight together.
  const hoveredCite = useStore((s) => s.hoveredCite);
  const actions = useStore((s) => s.actions);
  const { camera, size } = useThree();

  const heroRef = useRef<InstancedMesh>(null);
  const subRef = useRef<InstancedMesh>(null);

  /**
   * Two meshes, split by material rather than by convenience: projects are
   * emissive at rest and bloom picks them up, everything else stays matte and
   * below the bloom threshold. Per-instance emissive is not expressible with a
   * shared material, so the split is what makes the hierarchy real.
   */
  const { heroes, substrate } = useMemo(() => {
    const heroes: number[] = [];
    const substrate: number[] = [];
    nodes.forEach((n, i) => (n.type === 'project' ? heroes : substrate).push(i));
    return { heroes, substrate };
  }, [nodes]);

  // Eased per-node scale multiplier. Kept in a plain array because it changes
  // every frame and must never touch React.
  const grow = useRef(new Float32Array(0));

  useEffect(() => {
    grow.current = new Float32Array(nodes.length);
    allocateScreen(nodes.map((n) => n.id));
  }, [nodes]);

  /**
   * Colours change only when the corpus or the retrieval result changes, so
   * they are written on those transitions rather than per frame.
   *
   * When there are hits, everything that was not retrieved is pushed down
   * toward the background. Dimming the rest is what makes retrieval legible —
   * brightening the hits alone just makes the whole cloud lighter.
   */
  useEffect(() => {
    const hitIds = new Set(hits.map((h) => h.id));
    const dimming = hitIds.size > 0;

    const write = (mesh: InstancedMesh | null, idx: number[]) => {
      if (!mesh) return;
      const c = new Color();
      idx.forEach((nodeIdx, slot) => {
        const n = nodes[nodeIdx];
        c.copy(nodeColor(n.cluster, n.type === 'skill'));
        if (dimming && !hitIds.has(n.id)) c.multiplyScalar(0.22);
        mesh.setColorAt(slot, c);
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };
    write(heroRef.current, heroes);
    write(subRef.current, substrate);
  }, [nodes, heroes, substrate, hits]);

  const m4 = useMemo(() => new Matrix4(), []);
  const v3 = useMemo(() => new Vector3(), []);

  const hitIds = useMemo(() => new Set(hits.map((h) => h.id)), [hits]);

  useFrame((_, dt) => {
    if (!nodes.length) return;
    const d = Math.min(dt, 0.1);
    const k = 1 - Math.exp(-9 * d);

    const apply = (mesh: InstancedMesh | null, idx: number[]) => {
      if (!mesh) return;
      idx.forEach((nodeIdx, slot) => {
        const n = nodes[nodeIdx];
        const want =
          n.id === selectedNode
            ? SELECT_GROWTH
            : n.id === hoveredNode || n.id === hoveredCite
              ? HOVER_GROWTH
              : hitIds.has(n.id)
                ? HIT_GROWTH
                : 0;
        grow.current[nodeIdx] += (want - grow.current[nodeIdx]) * k;
        const r = RADIUS[n.type] * (1 + grow.current[nodeIdx]);
        m4.makeScale(r, r, r);
        m4.setPosition(n.pos[0], n.pos[1], n.pos[2]);
        mesh.setMatrixAt(slot, m4);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    apply(heroRef.current, heroes);
    apply(subRef.current, substrate);

    // Publish screen positions for the DOM overlays. Written to a module-level
    // buffer, never to the store — see scene/screen.ts.
    const hw = size.width / 2;
    const hh = size.height / 2;
    for (let i = 0; i < nodes.length; i++) {
      v3.set(nodes[i].pos[0], nodes[i].pos[1], nodes[i].pos[2]).project(camera);
      const inside = v3.z < 1 && v3.x >= -1.15 && v3.x <= 1.15 && v3.y >= -1.15 && v3.y <= 1.15;
      screen.visible[i] = inside ? 1 : 0;
      screen.xy[i * 2] = (v3.x + 1) * hw;
      screen.xy[i * 2 + 1] = (1 - v3.y) * hh;
    }
    screen.frame++;
  });

  const onMove = (idx: number[]) => (e: ThreeEvent<PointerEvent>) => {
    // Suppress hover mid-drag, or orbiting the camera constantly repaints the
    // detail card as nodes sweep under the cursor.
    if (e.nativeEvent.buttons > 0) return;
    e.stopPropagation();
    const slot = e.instanceId;
    if (slot === undefined) return;
    actions.hoverNode(nodes[idx[slot]].id);
  };

  const onClick = (idx: number[]) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const slot = e.instanceId;
    if (slot === undefined) return;
    const id = nodes[idx[slot]].id;
    actions.selectNode(useStore.getState().selectedNode === id ? null : id);
  };

  if (!nodes.length) return null;

  return (
    <group>
      <instancedMesh
        ref={heroRef}
        args={[undefined, undefined, heroes.length]}
        onPointerMove={onMove(heroes)}
        onPointerOut={() => actions.hoverNode(null)}
        onClick={onClick(heroes)}
      >
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <instancedMesh
        ref={subRef}
        args={[undefined, undefined, substrate.length]}
        onPointerMove={onMove(substrate)}
        onPointerOut={() => actions.hoverNode(null)}
        onClick={onClick(substrate)}
      >
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
}
