// ─────────────────────────────────────────────
// EARTH — a real planet, built at runtime.
//
// The only asset this needs is public/data/land-110m.json (54 KB raw, ~21 KB
// gzipped) — real coastline topology. Everything painted on top of it is
// generated in-browser: ocean depth, terrain bands by latitude, polar ice,
// city lights, clouds.
//
// THEME RULE: the planet is Earth, in Earth's colours. The portfolio palette
// belongs to the instrument layer — beacons, routes, HUD — never to the
// terrain. Painting the globe indigo makes it read as an alien sphere and
// leaves the mint route lines with nothing to contrast against.
// ─────────────────────────────────────────────

import * as THREE from 'three';
import { R_GLOBE, fbm, smoothstep, latLonToVec3 } from './geo';

const TEX_W = 2048;
const TEX_H = 1024;

const lonToX = (lon: number) => ((lon + 180) / 360) * TEX_W;
const latToY = (lat: number) => ((90 - lat) / 180) * TEX_H;

// ── TopoJSON ──

interface Topology {
  transform: { scale: [number, number]; translate: [number, number] };
  arcs: [number, number][][];
  objects: { land: { geometries: { arcs: number[][][] }[] } };
}

type Ring = [number, number][];

/**
 * Decode TopoJSON: arcs are delta-encoded quantised integers sharing one
 * transform, and a negative arc index means "traverse this shared arc
 * backwards".
 */
export function decodeLandRings(topo: Topology): Ring[] {
  const [sx, sy] = topo.transform.scale;
  const [tx, ty] = topo.transform.translate;

  const arcs: Ring[] = topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * sx + tx, y * sy + ty] as [number, number];
    });
  });

  const rings: Ring[] = [];
  topo.objects.land.geometries.forEach((geom) => {
    geom.arcs.forEach((poly) =>
      poly.forEach((ring) => {
        const pts: Ring = [];
        ring.forEach((idx) => {
          const reversed = idx < 0;
          const arc = arcs[reversed ? ~idx : idx];
          const seq = reversed ? arc.slice().reverse() : arc;
          // Skip the shared join point so segments don't duplicate.
          for (let i = pts.length ? 1 : 0; i < seq.length; i++) pts.push(seq[i]);
        });
        if (pts.length > 2) rings.push(pts);
      }),
    );
  });
  return rings;
}

/**
 * Build a fillable path. Rings crossing the antimeridian get split into
 * separate subpaths — otherwise Chukotka drags a band right across the map.
 */
function ringsToPath(rings: Ring[]): Path2D {
  const path = new Path2D();
  rings.forEach((pts) => {
    let started = false;
    let prevLon: number | null = null;
    for (const [lon, lat] of pts) {
      const x = lonToX(lon);
      const y = latToY(lat);
      if (!started || (prevLon !== null && Math.abs(lon - prevLon) > 180)) {
        path.moveTo(x, y);
        started = true;
      } else {
        path.lineTo(x, y);
      }
      prevLon = lon;
    }
    path.closePath();
  });
  return path;
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export interface EarthTextures {
  day: THREE.Texture;
  night: THREE.Texture;
  clouds: THREE.Texture;
}

/** Metros that get an extra-bright cluster on the night side. */
const METROS: [number, number, number][] = [
  [77.21, 28.61, 17], // Delhi
  [77.59, 12.97, 15], // Bengaluru
  [75.79, 26.91, 10], // Jaipur / Pilani
  [31.24, 30.04, 13], // Cairo
  [72.87, 19.07, 15],
  [78.48, 17.38, 12],
  [80.27, 13.08, 12],
  [88.36, 22.57, 12],
  [73.86, 18.52, 10],
  [72.57, 23.02, 9],
];

export function buildEarthTextures(rings: Ring[], maxAnisotropy: number): EarthTextures {
  const land = ringsToPath(rings);

  // ── land mask, reused to keep city lights off the water ──
  const maskCanvas = makeCanvas(TEX_W, TEX_H);
  const mk = maskCanvas.getContext('2d')!;
  mk.fillStyle = '#000';
  mk.fillRect(0, 0, TEX_W, TEX_H);
  mk.fillStyle = '#fff';
  mk.fill(land);
  // This dataset clips Antarctica at −85.6°; close the cap so there's no gap.
  mk.fillRect(0, latToY(-83), TEX_W, TEX_H - latToY(-83));
  const maskData = mk.getImageData(0, 0, TEX_W, TEX_H).data;
  const isLand = (x: number, y: number) => maskData[((y | 0) * TEX_W + (x | 0)) * 4] > 127;

  // ── DAY ──
  const dayCanvas = makeCanvas(TEX_W, TEX_H);
  const d = dayCanvas.getContext('2d')!;

  const ocean = d.createLinearGradient(0, 0, 0, TEX_H);
  ocean.addColorStop(0.0, '#061020');
  ocean.addColorStop(0.22, '#09182e');
  ocean.addColorStop(0.5, '#0d2742');
  ocean.addColorStop(0.78, '#09182e');
  ocean.addColorStop(1.0, '#061020');
  d.fillStyle = ocean;
  d.fillRect(0, 0, TEX_W, TEX_H);

  // Continental shelf: stroke the coast wide and soft before filling land.
  d.strokeStyle = 'rgba(44,92,136,0.20)';
  d.lineWidth = 5;
  d.stroke(land);
  d.strokeStyle = 'rgba(58,112,158,0.16)';
  d.lineWidth = 2;
  d.stroke(land);

  d.fillStyle = '#2a3d2b';
  d.fill(land);

  // Terrain bands, clipped to land so the ocean stays untouched.
  d.save();
  d.clip(land);
  const band = (latA: number, latB: number, rgb: string, alpha: number) => {
    const yA = latToY(latB);
    const yB = latToY(latA);
    const g = d.createLinearGradient(0, yA, 0, yB);
    g.addColorStop(0, `rgba(${rgb},0)`);
    g.addColorStop(0.5, `rgba(${rgb},${alpha})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    d.fillStyle = g;
    d.fillRect(0, yA, TEX_W, yB - yA);
  };
  band(8, -8, '34,62,38', 0.46); // equatorial forest
  band(34, 14, '116,99,68', 0.5); // Sahara / Arabia / Thar
  band(-14, -34, '112,94,64', 0.4); // Kalahari / outback
  band(66, 44, '44,58,46', 0.46); // boreal
  band(-46, -66, '48,64,52', 0.34);
  band(90, 68, '192,206,220', 0.78); // arctic
  band(-70, -90, '204,216,230', 0.84); // antarctic

  // Mottle so the land isn't a flat wash.
  const img = d.getImageData(0, 0, TEX_W, TEX_H);
  const px = img.data;
  for (let y = 0; y < TEX_H; y++) {
    for (let x = 0; x < TEX_W; x++) {
      const i = (y * TEX_W + x) * 4;
      if (maskData[i] < 128) continue;
      const n = (fbm(x * 0.028, y * 0.028, 3.1, 3) - 0.5) * 30;
      px[i] = Math.max(0, Math.min(255, px[i] + n));
      px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + n));
      px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + n * 0.8));
    }
  }
  d.putImageData(img, 0, 0);
  d.restore();

  d.strokeStyle = 'rgba(148,182,210,0.17)';
  d.lineWidth = 0.9;
  d.stroke(land);

  const day = new THREE.CanvasTexture(dayCanvas);
  day.colorSpace = THREE.SRGBColorSpace;
  day.anisotropy = maxAnisotropy;

  // ── NIGHT: city lights, land only, India weighted ──
  const nightCanvas = makeCanvas(TEX_W, TEX_H);
  const n = nightCanvas.getContext('2d')!;
  n.fillStyle = '#000';
  n.fillRect(0, 0, TEX_W, TEX_H);
  n.globalCompositeOperation = 'lighter';

  const glow = (x: number, y: number, r: number, a: number) => {
    const g = n.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,224,160,${a})`);
    g.addColorStop(0.4, `rgba(255,186,96,${a * 0.45})`);
    g.addColorStop(1, 'rgba(255,170,70,0)');
    n.fillStyle = g;
    n.beginPath();
    n.arc(x, y, r, 0, 7);
    n.fill();
  };

  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * TEX_W;
    const y = Math.random() * TEX_H;
    if (!isLand(x, y)) continue;
    const lat = 90 - (y / TEX_H) * 180;
    if (Math.abs(lat) > 70) continue;
    const density = 0.3 + 0.42 * Math.exp(-Math.pow((Math.abs(lat) - 34) / 26, 2));
    if (Math.random() > density) continue;
    glow(x, y, 1.6 + Math.random() * 2.6, 0.24 + Math.random() * 0.3);
  }

  // The subcontinent is the subject of this map, so it gets extra density.
  for (let i = 0; i < 14000; i++) {
    const x = lonToX(68 + Math.random() * 24);
    const y = latToY(7 + Math.random() * 29);
    if (!isLand(x, y)) continue;
    glow(x, y, 1.5 + Math.random() * 2.4, 0.3 + Math.random() * 0.34);
  }

  METROS.forEach(([lon, lat, r]) => {
    const x = lonToX(lon);
    const y = latToY(lat);
    glow(x, y, r * 2.1, 0.3);
    glow(x, y, r * 0.85, 0.62);
    glow(x, y, r * 0.32, 0.9);
  });

  n.globalCompositeOperation = 'source-over';
  const night = new THREE.CanvasTexture(nightCanvas);
  night.colorSpace = THREE.SRGBColorSpace;

  // ── CLOUDS ──
  const CW = 1024;
  const CH = 512;
  const cloudCanvas = makeCanvas(CW, CH);
  const c = cloudCanvas.getContext('2d')!;
  const cimg = c.createImageData(CW, CH);
  const cpx = cimg.data;
  for (let y = 0; y < CH; y++) {
    const lat = 90 - (y / CH) * 180;
    // Latitudinal weather belts rather than uniform mush.
    const belt = 0.5 + 0.5 * Math.cos((lat / 90) * Math.PI * 2.4);
    for (let x = 0; x < CW; x++) {
      const v = fbm(x * 0.016, y * 0.03, 7.7, 5);
      const a = smoothstep(0.52, 0.78, v * (0.72 + belt * 0.5));
      const i = (y * CW + x) * 4;
      cpx[i] = cpx[i + 1] = cpx[i + 2] = 255;
      cpx[i + 3] = a * 215;
    }
  }
  c.putImageData(cimg, 0, 0);
  const clouds = new THREE.CanvasTexture(cloudCanvas);
  clouds.colorSpace = THREE.SRGBColorSpace;
  clouds.wrapS = THREE.RepeatWrapping;

  return { day, night, clouds };
}

// ── meshes ──

export interface EarthGroup {
  group: THREE.Group;
  cloudUniforms: { uOff: { value: number } };
  setOpacity: (v: number) => void;
}

/** Sun direction — fixed so India sits in daylight. */
export const SUN_DIR = latLonToVec3(12, 95, 1).normalize();

export function buildEarth(tex: EarthTextures): EarthGroup {
  const group = new THREE.Group();

  const surfaceMat = new THREE.ShaderMaterial({
    uniforms: {
      dayMap: { value: tex.day },
      nightMap: { value: tex.night },
      sunDir: { value: SUN_DIR.clone() },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vN; varying vec3 vView;
      void main() {
        vUv = uv;
        vN = normalize(mat3(modelMatrix) * normal);
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vView = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D dayMap; uniform sampler2D nightMap;
      uniform vec3 sunDir; uniform float uOpacity;
      varying vec2 vUv; varying vec3 vN; varying vec3 vView;
      void main() {
        float l = dot(normalize(vN), normalize(sunDir));
        // Wide terminator, so dusk is a band rather than a hard line.
        float dayAmt = smoothstep(-0.22, 0.30, l);
        vec3 day = texture2D(dayMap, vUv).rgb;
        vec3 night = texture2D(nightMap, vUv).rgb;
        float lam = max(0.0, l) * 0.92 + 0.08;
        vec3 col = mix(night * 1.25, day * lam, dayAmt);
        // Warm scatter right at the terminator.
        float dusk = exp(-pow((l - 0.02) * 9.0, 2.0));
        col += vec3(0.26, 0.12, 0.04) * dusk * 0.32;
        // Cool atmospheric fringe toward the limb.
        float rim = pow(1.0 - max(0.0, dot(normalize(vN), normalize(vView))), 3.0);
        col += vec3(0.13, 0.28, 0.52) * rim * (0.25 + dayAmt * 0.6);
        gl_FragColor = vec4(col, uOpacity);
      }`,
    transparent: true,
  });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(R_GLOBE, 128, 96), surfaceMat));

  const cloudUniforms = {
    map: { value: tex.clouds },
    sunDir: { value: SUN_DIR.clone() },
    uOff: { value: 0 },
    uOpacity: { value: 1 },
  };
  group.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(R_GLOBE * 1.013, 96, 64),
      new THREE.ShaderMaterial({
        uniforms: cloudUniforms,
        vertexShader: /* glsl */ `
          varying vec2 vUv; varying vec3 vN;
          void main() {
            vUv = uv; vN = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform sampler2D map; uniform vec3 sunDir;
          uniform float uOff; uniform float uOpacity;
          varying vec2 vUv; varying vec3 vN;
          void main() {
            float a = texture2D(map, vec2(vUv.x + uOff, vUv.y)).a;
            float l = dot(normalize(vN), normalize(sunDir));
            float lit = smoothstep(-0.18, 0.32, l);
            gl_FragColor = vec4(vec3(0.30 + lit * 0.72), a * (0.10 + lit * 0.42) * uOpacity);
          }`,
        transparent: true,
        depthWrite: false,
      }),
    ),
  );

  const haloUniforms = { sunDir: { value: SUN_DIR.clone() }, uOpacity: { value: 1 } };
  group.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(R_GLOBE * 1.075, 64, 48),
      new THREE.ShaderMaterial({
        uniforms: haloUniforms,
        vertexShader: /* glsl */ `
          varying float vI; varying vec3 vN;
          void main() {
            vN = normalize(mat3(modelMatrix) * normal);
            vec3 wn = normalize(normalMatrix * normal);
            vec4 wp = modelViewMatrix * vec4(position, 1.0);
            vI = pow(1.0 - abs(dot(wn, normalize(-wp.xyz))), 2.6);
            gl_Position = projectionMatrix * wp;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 sunDir; uniform float uOpacity;
          varying float vI; varying vec3 vN;
          void main() {
            float lit = smoothstep(-0.5, 0.4, dot(normalize(vN), normalize(sunDir)));
            gl_FragColor = vec4(vec3(0.30, 0.58, 1.0), vI * (0.14 + lit * 0.62) * uOpacity);
          }`,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    ),
  );

  // Graticule — cool white and very faint, so it reads as an overlay on blue
  // water. Indigo lines here just turn the ocean muddy.
  const pts: number[] = [];
  const rr = R_GLOBE * 1.0015;
  const push = (a: THREE.Vector3, b: THREE.Vector3) => pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let lat = -60; lat <= 60; lat += 30) {
    for (let lon = -180; lon < 180; lon += 5) {
      push(latLonToVec3(lat, lon, rr), latLonToVec3(lat, lon + 5, rr));
    }
  }
  for (let lon = -180; lon < 180; lon += 30) {
    for (let lat = -84; lat < 84; lat += 5) {
      push(latLonToVec3(lat, lon, rr), latLonToVec3(lat + 5, lon, rr));
    }
  }
  const gg = new THREE.BufferGeometry();
  gg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const gratMat = new THREE.LineBasicMaterial({
    color: 0xbfe0ff,
    transparent: true,
    opacity: 0.085,
    depthWrite: false,
  });
  group.add(new THREE.LineSegments(gg, gratMat));

  const setOpacity = (v: number) => {
    surfaceMat.uniforms.uOpacity.value = v;
    cloudUniforms.uOpacity.value = v;
    haloUniforms.uOpacity.value = v;
    gratMat.opacity = 0.085 * v;
  };

  return { group, cloudUniforms, setOpacity };
}
