// ─────────────────────────────────────────────
// GEO MATH — real spherical formulas.
//
// The globe's distances and headings are genuine, not decorative: leg length
// is the great-circle distance on a 6371 km sphere, ETE is that distance at a
// real cruise speed, and heading is the initial-bearing formula recomputed
// from the aircraft's live position. DEL→CAI comes out at 4,403 km, which is
// what an atlas says.
// ─────────────────────────────────────────────

import * as THREE from 'three';

export const R_GLOBE = 10;
export const R_EARTH_KM = 6371;
export const CRUISE_KMH = 880;
export const CRUISE_FT = 38000;

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

export interface LatLon {
  lat: number;
  lon: number;
}

/** Lat/lon to scene coordinates. lon 0 lies on +X, +lat on +Y. */
export function latLonToVec3(lat: number, lon: number, r = R_GLOBE): THREE.Vector3 {
  const p = lat * D2R;
  const l = lon * D2R;
  return new THREE.Vector3(
    r * Math.cos(p) * Math.cos(l),
    r * Math.sin(p),
    -r * Math.cos(p) * Math.sin(l),
  );
}

/** Inverse of latLonToVec3 — used to read the aircraft's position back. */
export function vec3ToLatLon(v: THREE.Vector3): LatLon {
  const r = v.length();
  return {
    lat: Math.asin(v.y / r) * R2D,
    lon: Math.atan2(-v.z, v.x) * R2D,
  };
}

/** Angle subtended at the centre of the sphere, in radians. */
export function centralAngle(a: LatLon, b: LatLon): number {
  const p1 = a.lat * D2R;
  const p2 = b.lat * D2R;
  const dl = (b.lon - a.lon) * D2R;
  return Math.acos(
    Math.min(1, Math.max(-1, Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(dl))),
  );
}

export const distanceKm = (a: LatLon, b: LatLon) => R_EARTH_KM * centralAngle(a, b);

/** Initial great-circle bearing, degrees true. */
export function bearing(a: LatLon, b: LatLon): number {
  const p1 = a.lat * D2R;
  const p2 = b.lat * D2R;
  const dl = (b.lon - a.lon) * D2R;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (Math.atan2(y, x) * R2D + 360) % 360;
}

/** Great-circle interpolation between two surface unit vectors. */
export function slerpSurface(
  uA: THREE.Vector3,
  uB: THREE.Vector3,
  omega: number,
  t: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  if (omega < 1e-6) return out.copy(uA);
  const s = Math.sin(omega);
  const w1 = Math.sin((1 - t) * omega) / s;
  const w2 = Math.sin(t * omega) / s;
  return out
    .set(uA.x * w1 + uB.x * w2, uA.y * w1 + uB.y * w2, uA.z * w1 + uB.z * w2)
    .normalize();
}

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Climb to 18% of the leg, cruise, descend from 82%. */
export const altProfile = (t: number) => smoothstep(0, 0.18, t) * (1 - smoothstep(0.82, 1, t));

/**
 * Arc apex height. Domestic Indian legs are short — DEL→JAI is 231 km — so
 * without a floor the arc would be a flat scratch across the surface.
 */
export const arcHeight = (omega: number) => 0.34 + omega * 0.86;

/** Shortest-path angle interpolation, so the camera never takes the long way. */
export function wrapTo(a: number, target: number): number {
  let d = (target - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d;
}

export function formatETE(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}

// ── value noise, shared by the terrain mottle and the cloud layer ──

const nhash = (x: number, y: number, z: number) => {
  let h = x * 374761393 + y * 668265263 + z * 1274126177;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
};

const nfade = (t: number) => t * t * (3 - 2 * t);

export function valueNoise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = nfade(x - xi);
  const yf = nfade(y - yi);
  const zf = nfade(z - zi);
  let v = 0;
  for (let dz = 0; dz <= 1; dz++) {
    for (let dy = 0; dy <= 1; dy++) {
      for (let dx = 0; dx <= 1; dx++) {
        v +=
          (dx ? xf : 1 - xf) *
          (dy ? yf : 1 - yf) *
          (dz ? zf : 1 - zf) *
          nhash(xi + dx, yi + dy, zi + dz);
      }
    }
  }
  return v;
}

export function fbm(x: number, y: number, z: number, octaves = 4): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise3(x * freq, y * freq, z * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}
