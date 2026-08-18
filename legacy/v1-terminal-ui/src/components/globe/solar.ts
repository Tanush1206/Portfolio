// ─────────────────────────────────────────────
// SOLAR SYSTEM — the opening shot.
//
// Earth stays at the scene origin so every piece of globe maths, camera code
// and beacon placement works unchanged. The rest of the system is built
// around it: the Sun sits along SUN_DIR (the same vector that lights the
// Earth, so the shot is physically consistent), and the planets ride orbits
// centred on the Sun — including Earth's own orbit, which passes through the
// origin by construction.
//
// Distances are compressed. A true-scale solar system is 99.99% empty space
// and renders as a black screen with a dot in it.
// ─────────────────────────────────────────────

import * as THREE from 'three';
import { SUN_DIR } from './earth';

/** How far the Sun sits from Earth in scene units. */
export const SUN_DIST = 2100;
/** Camera radius the intro starts at — measured from the SUN, not Earth. */
export const INTRO_RADIUS = 9200;
/** Camera radius the globe view settles at. */
export const GLOBE_RADIUS = 21;

export const SUN_POS = SUN_DIR.clone().multiplyScalar(SUN_DIST);

/**
 * Orbit radii are compressed as AU^0.6. True scale puts Saturn ten times
 * further out than Earth, which both blows past any sane far plane and leaves
 * the inner system as an indistinguishable clump. This keeps the ordering and
 * the relative gaps legible while fitting the whole system in frame.
 */
const orbitRadiusFor = (au: number) => SUN_DIST * Math.pow(au, 0.6);

interface PlanetSpec {
  name: string;
  /** True orbital radius in AU; compressed by orbitRadiusFor for display. */
  au: number;
  radius: number;
  color: number;
  /** Starting angle on the orbit, radians. */
  phase: number;
  ring?: boolean;
}

// Real relative orbital radii; radii of the bodies themselves are heavily
// exaggerated or they'd be sub-pixel.
const PLANETS: PlanetSpec[] = [
  { name: 'Mercury', au: 0.39, radius: 11, color: 0x9c8d80, phase: 0.7 },
  { name: 'Venus',   au: 0.72, radius: 26, color: 0xd8b98a, phase: 2.4 },
  { name: 'Mars',    au: 1.52, radius: 16, color: 0xc1553a, phase: 4.1 },
  { name: 'Jupiter', au: 5.2,  radius: 92, color: 0xc8a06a, phase: 5.6 },
  { name: 'Saturn',  au: 9.58, radius: 78, color: 0xd7c193, phase: 1.2, ring: true },
];

export interface SolarSystem {
  group: THREE.Group;
  /** 1 = fully visible (intro), 0 = hidden (globe view). */
  setVisibility: (v: number) => void;
  update: (elapsed: number, camera: THREE.Camera) => void;
  sunSprite: THREE.Sprite;
}

function orbitPlaneBasis(): { u: THREE.Vector3; v: THREE.Vector3 } {
  // Build an orbital plane containing the Sun→Earth line, tilted a little so
  // the intro isn't a flat edge-on view.
  const u = SUN_DIR.clone().negate().normalize(); // Sun → Earth
  const tilt = new THREE.Vector3(0.12, 1, 0.06).normalize();
  const v = new THREE.Vector3().crossVectors(u, tilt).normalize();
  return { u, v };
}

function sunGlowTexture(): THREE.Texture {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0.0, 'rgba(255,255,246,1)');
  g.addColorStop(0.12, 'rgba(255,238,190,0.95)');
  g.addColorStop(0.32, 'rgba(255,186,88,0.45)');
  g.addColorStop(0.62, 'rgba(255,140,40,0.12)');
  g.addColorStop(1.0, 'rgba(255,120,20,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildSolarSystem(): SolarSystem {
  const group = new THREE.Group();
  const { u, v } = orbitPlaneBasis();

  // Position on an orbit of radius r at angle a, in the orbital plane, with
  // the Sun at the centre. At a = 0 this lands exactly on the scene origin
  // when r = SUN_DIST — which is where Earth is.
  const orbitPoint = (r: number, a: number, out = new THREE.Vector3()) =>
    out
      .copy(SUN_POS)
      .addScaledVector(u, r * Math.cos(a))
      .addScaledVector(v, r * Math.sin(a));

  const fadeMaterials: (THREE.Material & { opacity: number })[] = [];

  // ── Sun ──
  const sunCore = new THREE.Mesh(
    new THREE.SphereGeometry(95, 32, 24),
    new THREE.MeshBasicMaterial({ color: 0xfff4d6, transparent: true, opacity: 1 }),
  );
  sunCore.position.copy(SUN_POS);
  group.add(sunCore);
  fadeMaterials.push(sunCore.material as THREE.MeshBasicMaterial & { opacity: number });

  const sunSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: sunGlowTexture(),
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sunSprite.position.copy(SUN_POS);
  sunSprite.scale.setScalar(760);
  group.add(sunSprite);

  // ── orbits ──
  const orbitMats: (THREE.LineBasicMaterial & { opacity: number })[] = [];
  const addOrbit = (r: number, color: number, opacity: number) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i++) pts.push(orbitPoint(r, (i / 256) * Math.PI * 2));
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    }) as THREE.LineBasicMaterial & { opacity: number };
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    orbitMats.push(mat);
    return mat;
  };

  PLANETS.forEach((p) => addOrbit(orbitRadiusFor(p.au), 0x6a74a8, 0.34));
  // Earth's own orbit, picked out in the portfolio's indigo — the one piece of
  // palette allowed in the sky, because it marks our line.
  addOrbit(SUN_DIST, 0xc3c0ff, 0.55);

  // ── planets ──
  const bodies: { mesh: THREE.Mesh; spec: PlanetSpec }[] = [];
  PLANETS.forEach((spec) => {
    const mat = new THREE.MeshStandardMaterial({
      color: spec.color,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: 1,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(spec.radius, 24, 18), mat);
    mesh.position.copy(orbitPoint(orbitRadiusFor(spec.au), spec.phase));
    group.add(mesh);
    fadeMaterials.push(mat as THREE.MeshStandardMaterial & { opacity: number });
    bodies.push({ mesh, spec });

    if (spec.ring) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xcbb68d,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(spec.radius * 1.5, spec.radius * 2.4, 64), ringMat);
      ring.rotation.x = Math.PI / 2.6;
      mesh.add(ring);
      fadeMaterials.push(ringMat as THREE.MeshBasicMaterial & { opacity: number });
    }
  });

  // A faint marker ring at the origin so Earth is findable in the wide shot
  // before it's big enough to recognise.
  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(46, 52, 48),
    new THREE.MeshBasicMaterial({
      color: 0x4edea3,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  group.add(reticle);
  const reticleMat = reticle.material as THREE.MeshBasicMaterial & { opacity: number };

  // Sunlight for the planets (the Earth shader does its own lighting).
  const sunLight = new THREE.PointLight(0xfff0d0, 2.0, 0, 0);
  sunLight.position.copy(SUN_POS);
  group.add(sunLight);

  const setVisibility = (vis: number) => {
    const clamped = Math.max(0, Math.min(1, vis));
    group.visible = clamped > 0.002;
    fadeMaterials.forEach((m) => (m.opacity = clamped));
    orbitMats.forEach((m, i) => (m.opacity = (i === orbitMats.length - 1 ? 0.55 : 0.34) * clamped));
    // The reticle should disappear well before the planets do — once Earth is
    // recognisable it's just clutter.
    reticleMat.opacity = 0.7 * Math.max(0, (clamped - 0.55) / 0.45);
    sunLight.intensity = 2.0 * clamped;
    (sunSprite.material as THREE.SpriteMaterial).opacity = clamped;
  };

  const update = (elapsed: number, camera: THREE.Camera) => {
    if (!group.visible) return;
    bodies.forEach(({ mesh, spec }) => {
      // Kepler-ish: outer planets crawl. Sped up hugely for the shot.
      const rate = 0.02 / Math.pow(spec.au, 1.5);
      mesh.position.copy(orbitPoint(orbitRadiusFor(spec.au), spec.phase + elapsed * rate));
      mesh.rotation.y = elapsed * 0.05;
    });
    // The reticle sits at the origin, so lookAt has no valid direction —
    // billboard it against the camera instead. Scale with camera distance so
    // it stays a constant size on screen through the whole dolly.
    reticle.quaternion.copy(camera.quaternion);
    reticle.rotateZ(elapsed * 0.2);
    const d = camera.position.distanceTo(reticle.position);
    reticle.scale.setScalar(Math.max(0.15, d / 2600));
  };

  setVisibility(1);
  return { group, setVisibility, update, sunSprite };
}
