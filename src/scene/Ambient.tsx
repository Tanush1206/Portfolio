import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points } from 'three';

const COUNT = 700;
const SPAN = 46;

/**
 * Ambient drift particles. Not a starfield and not a grid — the spec rules out
 * skybox, grid and floor, and a grid plane in particular is the single most
 * recognisable three.js default. These sit in the same volume as the cloud and
 * drift slowly, so the space reads as occupied and parallax gives depth without
 * ever suggesting a ground plane or a horizon.
 */
export function Ambient() {
  const ref = useRef<Points>(null);

  const { geometry, drift } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const drift = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Rejection-sample into a sphere. A cube would put visible corners in the
      // periphery once the camera swings past 45°.
      let x = 0;
      let y = 0;
      let z = 0;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
      } while (x * x + y * y + z * z > 1);

      pos[i * 3] = x * SPAN;
      pos[i * 3 + 1] = y * SPAN * 0.7;
      pos[i * 3 + 2] = z * SPAN;
      drift[i] = 0.12 + Math.random() * 0.3;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(pos, 3));
    return { geometry, drift };
  }, []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    const attr = geometry.getAttribute('position') as Float32BufferAttribute;
    const arr = attr.array as Float32Array;
    const lim = SPAN * 0.7;

    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += drift[i] * d;
      if (arr[i * 3 + 1] > lim) arr[i * 3 + 1] = -lim;
    }
    attr.needsUpdate = true;

    if (ref.current) ref.current.rotation.y += 0.006 * d;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.075}
        sizeAttenuation
        color="#5c7089"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
