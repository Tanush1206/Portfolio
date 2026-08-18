// ─────────────────────────────────────────────
// AIRCRAFT — a modelled airliner, still zero downloaded assets.
//
// The v1 prototype's plane was a cylinder with box wings. This one is turned
// properly: the fuselage is a LatheGeometry from a real profile curve (pointed
// radome, constant barrel, upswept tail cone), the wings and tail come from
// extruded planform shapes with sweep and taper, and the nacelles have flared
// intake lips. Cabin windows and the cheatline are painted into a canvas
// texture mapped along the lathe.
//
// Nose points along +Z, which is what the flight code orients to.
// ─────────────────────────────────────────────

import * as THREE from 'three';

export interface Aircraft {
  group: THREE.Group;
  navRed: THREE.MeshBasicMaterial;
  navGreen: THREE.MeshBasicMaterial;
  strobe: THREE.MeshBasicMaterial;
  beaconLow: THREE.MeshBasicMaterial;
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/**
 * Fuselage skin. LatheGeometry maps u around the circumference and v along
 * the axis, so a cabin window row — constant circumferential position,
 * running the length of the body — is a vertical stripe in texture space.
 */
function fuselageTexture(): THREE.Texture {
  const W = 1024;
  const H = 512;
  const canvas = makeCanvas(W, H);
  const x = canvas.getContext('2d')!;

  // Bare-metal white with a soft vertical shade so the barrel reads as round.
  const shade = x.createLinearGradient(0, 0, W, 0);
  shade.addColorStop(0.0, '#cfd2dd');
  shade.addColorStop(0.25, '#fbfbff');
  shade.addColorStop(0.5, '#dfe1ea');
  shade.addColorStop(0.75, '#fbfbff');
  shade.addColorStop(1.0, '#cfd2dd');
  x.fillStyle = shade;
  x.fillRect(0, 0, W, H);

  // v ∈ [0,1] runs nose→tail; the rear third gets the indigo tail band.
  const tailStart = H * 0.66;
  const tail = x.createLinearGradient(0, tailStart, 0, H);
  tail.addColorStop(0, 'rgba(79,70,229,0)');
  tail.addColorStop(0.45, 'rgba(79,70,229,0.92)');
  tail.addColorStop(1, 'rgba(61,54,196,1)');
  x.fillStyle = tail;
  x.fillRect(0, tailStart, W, H - tailStart);

  // Two window rows and a mint cheatline, one per side (u ≈ 0.25 / 0.75).
  [0.25, 0.75].forEach((u) => {
    const cx = u * W;

    x.fillStyle = 'rgba(78,222,163,0.9)';
    x.fillRect(cx - 26, H * 0.1, 5, H * 0.56);

    x.fillStyle = '#1b2030';
    for (let v = 0.12; v < 0.63; v += 0.026) {
      x.fillRect(cx - 7, v * H, 14, 9);
    }

    // Flight-deck glazing, nearer the nose.
    x.fillStyle = '#141a28';
    x.beginPath();
    x.ellipse(cx, H * 0.075, 13, 17, 0, 0, Math.PI * 2);
    x.fill();

    // Door outlines fore and aft.
    x.strokeStyle = 'rgba(120,124,140,0.55)';
    x.lineWidth = 2;
    [0.1, 0.6].forEach((v) => x.strokeRect(cx - 12, v * H, 24, 30));
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Extrude a planform into a thin lifting surface.
 * Shape coords: x spanwise, y chordwise (+y toward the nose).
 */
function liftingSurface(points: [number, number][], thickness: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.3,
    bevelSize: thickness * 0.45,
    bevelSegments: 2,
  });
  // Extrusion runs along +Z; rotate so it becomes vertical thickness and the
  // chord lies fore-aft.
  geo.rotateX(Math.PI / 2);
  geo.translate(0, thickness / 2, 0);
  return geo;
}

/** Turbofan nacelle: flared intake lip, cowl, tapered exhaust. */
function nacelle(): THREE.BufferGeometry {
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(0.0, -0.075),
    new THREE.Vector2(0.028, -0.075),
    new THREE.Vector2(0.036, -0.062),
    new THREE.Vector2(0.04, -0.04),
    new THREE.Vector2(0.041, 0.0),
    new THREE.Vector2(0.039, 0.035),
    new THREE.Vector2(0.032, 0.062),
    new THREE.Vector2(0.026, 0.075),
    new THREE.Vector2(0.0, 0.077),
  ];
  const geo = new THREE.LatheGeometry(profile, 22);
  geo.rotateX(Math.PI / 2); // lathe axis Y → Z
  return geo;
}

export function buildAircraft(): Aircraft {
  const group = new THREE.Group();

  const skin = new THREE.MeshStandardMaterial({
    map: fuselageTexture(),
    roughness: 0.3,
    metalness: 0.55,
  });
  const bare = new THREE.MeshStandardMaterial({ color: 0xeef0f7, roughness: 0.3, metalness: 0.5 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.32, metalness: 0.45 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a1c26, roughness: 0.5, metalness: 0.65 });

  // ── fuselage: radome → barrel → upswept tail cone ──
  const L = 0.62;
  const R = 0.058;
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(0.0, L * 0.5),
    new THREE.Vector2(R * 0.3, L * 0.472),
    new THREE.Vector2(R * 0.62, L * 0.44),
    new THREE.Vector2(R * 0.85, L * 0.4),
    new THREE.Vector2(R * 0.97, L * 0.34),
    new THREE.Vector2(R, L * 0.26),
    new THREE.Vector2(R, -L * 0.1),
    new THREE.Vector2(R * 0.97, -L * 0.24),
    new THREE.Vector2(R * 0.85, -L * 0.34),
    new THREE.Vector2(R * 0.6, -L * 0.43),
    new THREE.Vector2(R * 0.3, -L * 0.48),
    new THREE.Vector2(R * 0.08, -L * 0.5),
  ];
  const fuselage = new THREE.LatheGeometry(profile, 32);
  fuselage.rotateX(-Math.PI / 2); // +Y axis → +Z, nose forward
  group.add(new THREE.Mesh(fuselage, skin));

  // ── main wings ──
  const wingPlan: [number, number][] = [
    [0.045, 0.15],
    [0.5, -0.09],
    [0.5, -0.155],
    [0.045, -0.16],
  ];
  [-1, 1].forEach((side) => {
    const wing = new THREE.Mesh(liftingSurface(wingPlan, 0.019), bare);
    wing.scale.x = side;
    wing.position.set(0, -0.016, -0.02);
    wing.rotation.z = side * 0.05; // dihedral
    group.add(wing);

    // upturned winglet
    const wl = new THREE.Mesh(liftingSurface([[0, 0.03], [0.075, -0.02], [0.075, -0.055], [0, -0.05]], 0.014), trim);
    wl.rotation.z = side * (Math.PI / 2 - 0.22);
    wl.scale.x = side;
    wl.position.set(side * 0.5, -0.006, -0.115);
    group.add(wl);

    // engine + pylon
    const eng = new THREE.Mesh(nacelle(), bare);
    eng.position.set(side * 0.2, -0.055, 0.03);
    group.add(eng);

    const fan = new THREE.Mesh(new THREE.CircleGeometry(0.033, 20), dark);
    fan.position.set(side * 0.2, -0.055, -0.043);
    fan.rotation.y = Math.PI;
    group.add(fan);

    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.05, 0.07), bare);
    pylon.position.set(side * 0.2, -0.032, 0.012);
    group.add(pylon);

    // horizontal stabiliser
    const hs = new THREE.Mesh(liftingSurface([[0.03, 0.055], [0.17, -0.025], [0.17, -0.06], [0.03, -0.062]], 0.013), bare);
    hs.scale.x = side;
    hs.position.set(0, 0.012, -0.44);
    group.add(hs);
  });

  // ── vertical fin, swept, carrying the TT marking ──
  const finCanvas = makeCanvas(128, 128);
  const fx = finCanvas.getContext('2d')!;
  fx.fillStyle = '#4f46e5';
  fx.fillRect(0, 0, 128, 128);
  fx.fillStyle = '#eceaff';
  fx.font = '700 62px "Space Grotesk", system-ui, sans-serif';
  fx.textAlign = 'center';
  fx.textBaseline = 'middle';
  fx.fillText('TT', 64, 70);
  const finTex = new THREE.CanvasTexture(finCanvas);
  finTex.colorSpace = THREE.SRGBColorSpace;

  const fin = new THREE.Mesh(
    liftingSurface([[0, 0.05], [0.155, -0.055], [0.155, -0.1], [0, -0.075]], 0.014),
    new THREE.MeshStandardMaterial({ map: finTex, roughness: 0.34, metalness: 0.42 }),
  );
  fin.rotation.z = Math.PI / 2; // stand it upright
  fin.position.set(0, 0.045, -0.43);
  group.add(fin);

  // ── lights ──
  const lamp = (color: number, x: number, y: number, z: number, r = 0.019) => {
    const mat = new THREE.MeshBasicMaterial({ color });
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), mat);
    m.position.set(x, y, z);
    group.add(m);
    return mat;
  };
  const navRed = lamp(0xff3b30, -0.5, -0.012, -0.115);
  const navGreen = lamp(0x2fdd6b, 0.5, -0.012, -0.115);
  const strobe = lamp(0xffffff, 0, 0.2, -0.44, 0.016);
  const beaconLow = lamp(0xff5f2e, 0, -0.062, -0.02, 0.014);

  group.visible = false;
  return { group, navRed, navGreen, strobe, beaconLow };
}
