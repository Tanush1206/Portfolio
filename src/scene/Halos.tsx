import { useMemo } from 'react';
import { AdditiveBlending, CanvasTexture, Color } from 'three';
import { useStore } from '../store/useStore';
import { CLUSTER_COLOR } from './palette';
import type { Cluster } from '../types';

/**
 * Soft glows behind each lobe, so the three regions read as regions before you
 * have looked at the legend.
 *
 * Centre and radius are derived from the baked coordinates — the mean of the
 * cluster's nodes and the distance covering most of them — not positioned by
 * hand. Reposition the corpus and these follow.
 */
function haloTexture(): CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;

  // Squared falloff rather than the browser's linear default: a linear gradient
  // leaves a visible disc edge that immediately reads as a sprite.
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    grad.addColorStop(t, `rgba(255,255,255,${(1 - t) ** 2})`);
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return new CanvasTexture(c);
}

export function Halos() {
  const nodes = useStore((s) => s.nodes);
  const hits = useStore((s) => s.hits);

  const texture = useMemo(haloTexture, []);

  const lobes = useMemo(() => {
    const out: { cluster: Cluster; pos: [number, number, number]; r: number; color: Color }[] = [];
    for (const cluster of ['ml', 'eng', 'data'] as Cluster[]) {
      const members = nodes.filter((n) => n.cluster === cluster);
      if (members.length < 3) continue;

      const c: [number, number, number] = [0, 0, 0];
      for (const n of members) {
        c[0] += n.pos[0] / members.length;
        c[1] += n.pos[1] / members.length;
        c[2] += n.pos[2] / members.length;
      }

      // 80th percentile, not the max: one outlier should not inflate the halo
      // until it swallows the neighbouring lobe.
      const d = members
        .map((n) => Math.hypot(n.pos[0] - c[0], n.pos[1] - c[1], n.pos[2] - c[2]))
        .sort((a, b) => a - b);
      const r = d[Math.floor(d.length * 0.8)] * 2.6;

      out.push({ cluster, pos: c, r, color: CLUSTER_COLOR[cluster] });
    }
    return out;
  }, [nodes]);

  // While an answer is on screen the halos would fight the dimming — the point
  // of that state is that only the retrieved region is lit.
  if (hits.length) return null;

  return (
    <group>
      {lobes.map((l) => (
        <sprite key={l.cluster} position={l.pos} scale={[l.r, l.r, 1]}>
          <spriteMaterial
            map={texture}
            color={l.color}
            transparent
            opacity={0.07}
            depthWrite={false}
            depthTest={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  );
}
