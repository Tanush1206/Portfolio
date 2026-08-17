// ─────────────────────────────────────────────
// FLIGHT SCENE — the whole three.js layer, framework-agnostic.
//
// Kept out of React on purpose: none of this belongs in render state. The
// React component owns a container div and a callback; this owns the loop.
//
// Phases:
//   solar    wide shot — Sun, orbits, planets, Earth as a marked dot
//   approach camera dollies from 1750 to 21 units while the system fades
//   globe    flight network live, beacons clickable
// ─────────────────────────────────────────────

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import { stations, routeLinks, stationByCode, HOME_CODE, type Station } from '../../data/stations';
import {
  R_GLOBE,
  R_EARTH_KM,
  CRUISE_KMH,
  CRUISE_FT,
  latLonToVec3,
  vec3ToLatLon,
  centralAngle,
  bearing,
  slerpSurface,
  altProfile,
  arcHeight,
  easeInOutCubic,
  wrapTo,
} from './geo';
import { buildEarthTextures, buildEarth, decodeLandRings, SUN_DIR, type EarthGroup } from './earth';
import { buildAircraft, type Aircraft } from './aircraft';
import { buildSolarSystem, GLOBE_RADIUS, INTRO_RADIUS, SUN_POS, type SolarSystem } from './solar';

export type Phase = 'boot' | 'solar' | 'approach' | 'globe';
export type FlightPhase = 'stand' | 'climb' | 'cruise' | 'descent';

export interface Telemetry {
  phase: Phase;
  flightPhase: FlightPhase;
  callsign: string;
  fromCode: string;
  fromCity: string;
  toCode: string | null;
  toCity: string | null;
  distanceKm: number;
  eteMinutes: number;
  progress: number;
  heading: number;
  altitudeFt: number;
  groundSpeedKt: number;
  legCount: number;
  currentCode: string;
}

export interface LabelPos {
  code: string;
  x: number;
  y: number;
  opacity: number;
  state: 'idle' | 'here' | 'dest';
}

export interface SceneCallbacks {
  onTelemetry: (t: Telemetry) => void;
  onLabels: (l: LabelPos[]) => void;
  onArrive: (station: Station) => void;
  onSelectCurrent: (station: Station) => void;
  onProgress: (pct: number, note: string) => void;
  onPhase: (p: Phase) => void;
}

interface MarkerRefs {
  station: Station;
  unit: THREE.Vector3;
  pos: THREE.Vector3;
  lamp: THREE.Mesh;
  ring: THREE.Mesh;
  pulse: THREE.Mesh;
  phase: number;
}

interface Leg {
  from: Station;
  to: Station;
  omega: number;
  km: number;
  duration: number;
  apex: number;
  t: number;
  pos: THREE.Vector3;
  prev: THREE.Vector3;
  heading: number;
  bank: number;
}

const APPROACH_SECONDS = 5.4;

export class FlightScene {
  private container: HTMLElement;
  private cb: SceneCallbacks;

  private renderer!: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private composer!: EffectComposer;
  private clock = new THREE.Clock();

  private earth?: EarthGroup;
  private solar?: SolarSystem;
  private aircraft?: Aircraft;
  private markers: MarkerRefs[] = [];
  /** Cached scene vectors per station code, so stations.ts stays pure data. */
  private geo = new Map<string, { pos: THREE.Vector3; unit: THREE.Vector3 }>();
  private activeGeo?: THREE.BufferGeometry;
  private trailGeo?: THREE.BufferGeometry;
  private trailPos!: Float32Array;
  private trailCol!: Float32Array;
  private trailCount = 0;

  private phase: Phase = 'boot';
  private approachT = 0;
  private current: Station = stationByCode[HOME_CODE];
  private leg: Leg | null = null;
  private legCount = 0;
  private flightNo = 0;
  private disposed = false;
  private rafId = 0;
  private panelOpen = false;

  // The orbit centre interpolates from the Sun (wide shot) to Earth at the
  // origin (globe view). Orbiting Earth from 9,200 units away would put the
  // Sun and every planet outside the frustum — the wide shot has to be
  // Sun-centred to read as a solar system at all.
  private cam = {
    az: 0, pol: 1, rad: INTRO_RADIUS,
    tAz: 0, tPol: 1, tRad: INTRO_RADIUS,
    centre: SUN_POS.clone(),
    manual: false, base: 0,
  };
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private moved = 0;
  private ndc = new THREE.Vector2(-10, -10);
  private raycaster = new THREE.Raycaster();

  private readonly TRAIL = 200;

  constructor(container: HTMLElement, cb: SceneCallbacks) {
    this.container = container;
    this.cb = cb;
  }

  // ── lifecycle ──

  async init(): Promise<void> {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(44, Math.max(1, w) / Math.max(1, h), 0.1, 30000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.scene.background = new THREE.Color(0x02040a);
    this.container.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.26, 0.72, 0.62));
    this.composer.addPass(new OutputPass());

    this.cb.onProgress(10, 'fetching coastline topology');
    const res = await fetch(`${import.meta.env.BASE_URL ?? '/'}data/land-110m.json`);
    if (!res.ok) throw new Error(`coastline fetch failed: HTTP ${res.status}`);
    const topo = await res.json();
    if (this.disposed) return;

    const rings = decodeLandRings(topo);
    this.cb.onProgress(28, 'painting surface');
    await frame();

    const tex = buildEarthTextures(rings, this.renderer.capabilities.getMaxAnisotropy());
    if (this.disposed) return;
    this.cb.onProgress(62, 'seeding city lights');
    await frame();

    this.buildStars();
    this.earth = buildEarth(tex);
    this.scene.add(this.earth.group);

    this.solar = buildSolarSystem();
    this.scene.add(this.solar.group);

    this.aircraft = buildAircraft();
    this.scene.add(this.aircraft.group);

    this.buildMarkers();
    this.buildNetwork();
    this.buildActiveLine();
    this.buildTrail();
    this.cb.onProgress(88, 'plotting route network');
    await frame();

    // Ambient so the aircraft's standard material isn't black in shadow.
    this.scene.add(new THREE.AmbientLight(0x8892b8, 1.1));
    const key = new THREE.DirectionalLight(0xfff2dd, 2.4);
    key.position.copy(SUN_DIR).multiplyScalar(50);
    this.scene.add(key);

    this.attachInput();

    // Frame the wide shot looking down on the ecliptic, centred on the Sun.
    this.cam.centre.copy(SUN_POS);
    this.cam.tAz = Math.atan2(-SUN_POS.x, -SUN_POS.z);
    this.cam.base = this.cam.tAz;
    this.cam.tRad = INTRO_RADIUS;
    this.cam.tPol = 0.42;
    this.cam.az = this.cam.tAz;
    this.cam.pol = this.cam.tPol;
    this.cam.rad = this.cam.tRad;
    this.applyCamera();

    this.setPhase('solar');
    this.cb.onProgress(100, 'clearance granted');
    this.loop();
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.detachInput();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.composer?.dispose();
    this.renderer?.dispose();
    if (this.renderer?.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }

  resize(): void {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    if (!w || !h || !this.camera) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }

  // ── public controls ──

  /** Skip the wide shot and dive straight to the globe. */
  beginApproach(): void {
    if (this.phase !== 'solar') return;
    this.setPhase('approach');
    this.approachT = 0;
  }

  skipToGlobe(): void {
    if (this.phase === 'globe') return;
    this.approachT = 1;
    this.solar?.setVisibility(0);
    this.cam.centre.set(0, 0, 0);
    this.cam.tRad = GLOBE_RADIUS;
    this.cam.rad = GLOBE_RADIUS;
    this.aimAt(this.posOf(this.current), GLOBE_RADIUS);
    this.cam.az = this.cam.tAz;
    this.cam.pol = this.cam.tPol;
    this.applyCamera();
    this.setPhase('globe');
  }

  depart(code: string): void {
    if (this.phase !== 'globe' || this.leg) return;
    const to = stationByCode[code];
    if (!to || to === this.current) return;
    const from = this.current;
    const omega = centralAngle(from, to);
    const km = R_EARTH_KM * omega;
    // √km scaling so a 231 km hop and a 4,403 km haul both read well.
    const duration = Math.min(9, Math.max(3.2, 1.6 + Math.sqrt(km) / 15));

    this.flightNo = (this.flightNo % 899) + 101;
    this.legCount += 1;
    this.leg = {
      from,
      to,
      omega,
      km,
      duration,
      apex: arcHeight(omega),
      t: 0,
      pos: new THREE.Vector3(),
      prev: new THREE.Vector3(),
      heading: bearing(from, to),
      bank: 0,
    };
    this.buildActiveLeg(from, to, omega);
    this.resetTrail();
    if (this.aircraft) this.aircraft.group.visible = true;
    this.cam.manual = false;
  }

  focusCurrent(): void {
    this.aimAt(this.posOf(this.current), 15.5);
    this.cam.manual = false;
  }

  setPanelOpen(open: boolean): void {
    this.panelOpen = open;
  }

  // ── construction ──

  private setPhase(p: Phase): void {
    this.phase = p;
    this.cb.onPhase(p);
  }

  private buildStars(): void {
    const N = 3600;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const white = new THREE.Color(0xffffff);
    const blue = new THREE.Color(0xbcd2ff);
    const warm = new THREE.Color(0xffd9b0);
    for (let i = 0; i < N; i++) {
      // Beyond the outermost compressed orbit (~8,000) so stars never
      // interleave with Saturn, but inside the 30,000 far plane.
      const r = 12000 + Math.random() * 9000;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      const c = Math.random() < 0.1 ? warm : Math.random() < 0.3 ? blue : white;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.scene.add(
      new THREE.Points(
        g,
        new THREE.PointsMaterial({
          size: 22,
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
  }

  private buildMarkers(): void {
    stations.forEach((st, i) => {
      const unit = latLonToVec3(st.lat, st.lon, 1);
      const pos = unit.clone().multiplyScalar(R_GLOBE);
      this.geo.set(st.code, { pos, unit });

      const group = new THREE.Group();

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.21, 30),
        new THREE.MeshBasicMaterial({
          color: 0xc3c0ff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        }),
      );
      ring.position.copy(unit).multiplyScalar(R_GLOBE * 1.014);
      ring.lookAt(0, 0, 0);
      group.add(ring);

      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.011, 0.011, 0.5, 6),
        new THREE.MeshBasicMaterial({ color: 0xc3c0ff, transparent: true, opacity: 0.42, depthWrite: false }),
      );
      mast.position.copy(unit).multiplyScalar(R_GLOBE + 0.25);
      mast.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), unit);
      group.add(mast);

      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 14, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      lamp.position.copy(unit).multiplyScalar(R_GLOBE + 0.52);
      group.add(lamp);

      const pulse = new THREE.Mesh(
        new THREE.RingGeometry(0.21, 0.245, 32),
        new THREE.MeshBasicMaterial({
          color: 0x4edea3,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      pulse.position.copy(unit).multiplyScalar(R_GLOBE * 1.015);
      pulse.lookAt(0, 0, 0);
      group.add(pulse);

      this.scene.add(group);
      this.markers.push({ station: st, unit, pos, lamp, ring, pulse, phase: i * 0.85 });
    });
  }

  private buildNetwork(): void {
    const pts: number[] = [];
    const tmp = new THREE.Vector3();
    routeLinks.forEach(([a, b]) => {
      const A = stationByCode[a];
      const B = stationByCode[b];
      if (!A || !B) return;
      const uA = this.unitOf(A);
      const uB = this.unitOf(B);
      const om = centralAngle(A, B);
      const apex = arcHeight(om) * 0.55;
      let prev: THREE.Vector3 | null = null;
      for (let i = 0; i <= 44; i++) {
        const t = i / 44;
        slerpSurface(uA, uB, om, t, tmp);
        const p = tmp.clone().multiplyScalar(R_GLOBE * 1.006 + Math.sin(Math.PI * t) * apex);
        if (prev) pts.push(prev.x, prev.y, prev.z, p.x, p.y, p.z);
        prev = p;
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    this.scene.add(
      new THREE.LineSegments(
        g,
        new THREE.LineBasicMaterial({
          color: 0xc3c0ff,
          transparent: true,
          opacity: 0.26,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
  }

  private readonly ASEG = 128;

  private buildActiveLine(): void {
    this.activeGeo = new THREE.BufferGeometry();
    this.activeGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array((this.ASEG + 1) * 3), 3),
    );
    this.activeGeo.setDrawRange(0, 0);
    this.scene.add(
      new THREE.Line(
        this.activeGeo,
        new THREE.LineBasicMaterial({
          color: 0x4edea3,
          transparent: true,
          opacity: 0.62,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
  }

  private buildActiveLeg(A: Station, B: Station, om: number): void {
    if (!this.activeGeo) return;
    const uA = this.unitOf(A);
    const uB = this.unitOf(B);
    const arr = this.activeGeo.attributes.position.array as Float32Array;
    const tmp = new THREE.Vector3();
    const apex = arcHeight(om);
    for (let i = 0; i <= this.ASEG; i++) {
      const t = i / this.ASEG;
      slerpSurface(uA, uB, om, t, tmp);
      const r = R_GLOBE * 1.008 + altProfile(t) * apex;
      arr[i * 3] = tmp.x * r;
      arr[i * 3 + 1] = tmp.y * r;
      arr[i * 3 + 2] = tmp.z * r;
    }
    this.activeGeo.attributes.position.needsUpdate = true;
    this.activeGeo.setDrawRange(0, this.ASEG + 1);
  }

  private buildTrail(): void {
    this.trailPos = new Float32Array(this.TRAIL * 3);
    this.trailCol = new Float32Array(this.TRAIL * 3);
    this.trailGeo = new THREE.BufferGeometry();
    this.trailGeo.setAttribute('position', new THREE.BufferAttribute(this.trailPos, 3));
    this.trailGeo.setAttribute('color', new THREE.BufferAttribute(this.trailCol, 3));
    this.trailGeo.setDrawRange(0, 0);
    this.scene.add(
      new THREE.Line(
        this.trailGeo,
        new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
  }

  private resetTrail(): void {
    this.trailCount = 0;
    this.trailGeo?.setDrawRange(0, 0);
  }

  private pushTrail(p: THREE.Vector3): void {
    if (!this.trailGeo) return;
    if (this.trailCount < this.TRAIL) {
      const i = this.trailCount * 3;
      this.trailPos[i] = p.x;
      this.trailPos[i + 1] = p.y;
      this.trailPos[i + 2] = p.z;
      this.trailCount += 1;
    } else {
      this.trailPos.copyWithin(0, 3);
      const i = (this.TRAIL - 1) * 3;
      this.trailPos[i] = p.x;
      this.trailPos[i + 1] = p.y;
      this.trailPos[i + 2] = p.z;
    }
    for (let i = 0; i < this.trailCount; i++) {
      const f = Math.pow(i / Math.max(1, this.trailCount - 1), 2) * 0.95;
      this.trailCol[i * 3] = 0.55 * f;
      this.trailCol[i * 3 + 1] = 0.9 * f;
      this.trailCol[i * 3 + 2] = 0.76 * f;
    }
    this.trailGeo.attributes.position.needsUpdate = true;
    this.trailGeo.attributes.color.needsUpdate = true;
    this.trailGeo.setDrawRange(0, this.trailCount);
  }

  private posOf(st: Station): THREE.Vector3 {
    return this.geo.get(st.code)!.pos;
  }

  private unitOf(st: Station): THREE.Vector3 {
    return this.geo.get(st.code)!.unit;
  }

  // ── camera ──

  private applyCamera(): void {
    const sp = Math.sin(this.cam.pol);
    const cp = Math.cos(this.cam.pol);
    this.camera.position.set(
      this.cam.centre.x + this.cam.rad * sp * Math.sin(this.cam.az),
      this.cam.centre.y + this.cam.rad * cp,
      this.cam.centre.z + this.cam.rad * sp * Math.cos(this.cam.az),
    );
    this.camera.lookAt(this.cam.centre);
  }

  private aimAt(v: THREE.Vector3, radius?: number): void {
    const u = v.clone().normalize();
    this.cam.tPol = Math.acos(Math.min(1, Math.max(-1, u.y)));
    this.cam.tAz = Math.atan2(u.x, u.z);
    this.cam.base = this.cam.tAz;
    if (radius !== undefined) this.cam.tRad = radius;
  }

  // ── input ──

  private onPointerDown = (e: PointerEvent) => {
    this.dragging = true;
    this.moved = 0;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.renderer.domElement.setPointerCapture(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent) => {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    if (!this.dragging || this.phase !== 'globe') return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.moved += Math.abs(dx) + Math.abs(dy);
    if (this.moved > 4) this.cam.manual = true;
    this.cam.tAz -= dx * 0.005;
    this.cam.tPol = Math.min(Math.PI - 0.12, Math.max(0.12, this.cam.tPol - dy * 0.005));
    this.cam.az = this.cam.tAz;
    this.cam.pol = this.cam.tPol;
    this.cam.base = this.cam.tAz;
  };

  private onPointerUp = (e: PointerEvent) => {
    this.dragging = false;
    try {
      this.renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      /* capture may already be gone */
    }
    if (this.moved < 5) this.handleClick(e);
  };

  private onWheel = (e: WheelEvent) => {
    if (this.phase !== 'globe') return;
    e.preventDefault();
    this.cam.tRad = Math.min(64, Math.max(12.6, this.cam.tRad + Math.sign(e.deltaY) * 1.8));
  };

  private attachInput(): void {
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    el.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private detachInput(): void {
    const el = this.renderer?.domElement;
    if (!el) return;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('wheel', this.onWheel);
  }

  private handleClick(e: PointerEvent): void {
    if (this.phase === 'solar') {
      this.beginApproach();
      return;
    }
    if (this.phase !== 'globe' || this.leg) return;
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hit = this.raycaster.intersectObjects(
      this.markers.map((m) => m.lamp),
      false,
    )[0];
    if (!hit) return;
    const m = this.markers.find((mm) => mm.lamp === hit.object);
    if (!m) return;
    if (m.station === this.current) {
      this.focusCurrent();
      this.cb.onSelectCurrent(m.station);
    } else {
      this.depart(m.station.code);
    }
  }

  // ── loop ──

  private tmpU = new THREE.Vector3();
  private bR = new THREE.Vector3();
  private bU = new THREE.Vector3();
  private bF = new THREE.Vector3();
  private mB = new THREE.Matrix4();
  private qB = new THREE.Quaternion();
  private qBank = new THREE.Quaternion();
  private readonly Z_AXIS = new THREE.Vector3(0, 0, 1);
  private projV = new THREE.Vector3();
  private strobeT = 0;

  private loop = (): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.getElapsedTime();

    if (this.earth) this.earth.cloudUniforms.uOff.value = t * 0.0022;
    this.solar?.update(t, this.camera);

    if (this.phase === 'solar') {
      // Slow parallax so the wide shot is alive but stable.
      this.cam.tAz = this.cam.base + Math.sin(t * 0.05) * 0.14;
      this.cam.tPol = 0.42 + Math.sin(t * 0.037) * 0.05;
      this.cam.centre.copy(SUN_POS);
    } else if (this.phase === 'approach') {
      this.approachT = Math.min(1, this.approachT + dt / APPROACH_SECONDS);
      const e = easeInOutCubic(this.approachT);
      // Interpolate in log space — linear would spend the whole shot far away
      // and then slam into the planet at the end.
      const logR =
        Math.log(INTRO_RADIUS) + (Math.log(GLOBE_RADIUS) - Math.log(INTRO_RADIUS)) * e;
      this.cam.tRad = Math.exp(logR);
      this.cam.rad = this.cam.tRad;
      // Fade the system out over the first two thirds of the dive.
      this.solar?.setVisibility(1 - Math.min(1, this.approachT / 0.66));
      // Slide the orbit centre off the Sun and onto Earth, so the shot ends
      // framed on the home station.
      this.cam.centre.copy(SUN_POS).multiplyScalar(1 - e);
      const home = this.unitOf(this.current);
      const homeAz = Math.atan2(home.x, home.z);
      const homePol = Math.acos(home.y);
      this.cam.tAz = this.cam.base + wrapTo(0, homeAz - this.cam.base) * e;
      this.cam.tPol = 0.42 + (homePol - 0.42) * e;
      this.cam.base = this.cam.tAz;
      if (this.approachT >= 1) {
        this.solar?.setVisibility(0);
        this.cam.centre.set(0, 0, 0);
        this.setPhase('globe');
      }
    } else if (this.phase === 'globe' && !this.leg && !this.cam.manual && !this.panelOpen) {
      // Idle sway. A full spin would wander off to the mid-Pacific, and this
      // map is about India.
      this.cam.tAz = this.cam.base + Math.sin(t * 0.09) * 0.3;
    }

    if (this.leg) this.stepFlight(dt);

    this.cam.az = wrapTo(this.cam.az, this.cam.tAz);
    this.cam.az += (this.cam.tAz - this.cam.az) * Math.min(1, dt * 2.4);
    this.cam.pol += (this.cam.tPol - this.cam.pol) * Math.min(1, dt * 3);
    this.cam.rad += (this.cam.tRad - this.cam.rad) * Math.min(1, dt * 2.6);
    this.applyCamera();

    this.updateMarkers(t);
    this.updateLights(dt, t);
    this.emitTelemetry();

    this.composer.render();
  };

  private stepFlight(dt: number): void {
    const f = this.leg!;
    const ac = this.aircraft!;
    f.prev.copy(f.pos);
    f.t = Math.min(1, f.t + dt / f.duration);

    slerpSurface(this.unitOf(f.from), this.unitOf(f.to), f.omega, f.t, this.tmpU);
    const prof = altProfile(f.t);
    f.pos.copy(this.tmpU).multiplyScalar(R_GLOBE * 1.008 + prof * f.apex);
    ac.group.position.copy(f.pos);

    if (f.t > 0.0005) {
      this.bF.copy(f.pos).sub(f.prev);
      if (this.bF.lengthSq() < 1e-12) this.bF.copy(this.unitOf(f.to)).sub(this.unitOf(f.from));
      this.bF.normalize();
      this.bU.copy(this.tmpU);
      this.bR.copy(this.bU).cross(this.bF).normalize();
      this.bU.copy(this.bF).cross(this.bR).normalize();
      this.mB.makeBasis(this.bR, this.bU, this.bF);
      this.qB.setFromRotationMatrix(this.mB);
      const target = Math.sin(f.t * Math.PI) * 0.3 * (f.omega > 0.2 ? 1 : 0.5);
      f.bank += (target - f.bank) * Math.min(1, dt * 3.2);
      this.qBank.setFromAxisAngle(this.Z_AXIS, f.bank);
      ac.group.quaternion.copy(this.qB).multiply(this.qBank);
    }

    const ll = vec3ToLatLon(f.pos);
    f.heading = bearing(ll, f.to);
    ac.group.scale.setScalar(0.85 + prof * 0.32);

    if (f.t > 0.004) this.pushTrail(f.pos);
    if (!this.cam.manual) this.aimAt(f.pos, 14.5 + Math.sin(Math.PI * f.t) * 4.2 + f.omega * 3.2);

    if (f.t >= 1) {
      this.current = f.to;
      this.leg = null;
      ac.group.visible = false;
      this.activeGeo?.setDrawRange(0, 0);
      this.aimAt(this.posOf(this.current), 15.5);
      this.cb.onArrive(this.current);
    }
  }

  private updateMarkers(t: number): void {
    const camDir = this.camera.position.clone().normalize();
    const labels: LabelPos[] = [];
    const showLabels = this.phase === 'globe';

    this.markers.forEach((m) => {
      const here = m.station === this.current;
      const dest = !!this.leg && m.station === this.leg.to;
      const hot = here || dest;

      const cyc = (t * 0.5 + m.phase) % 1;
      m.pulse.scale.setScalar(1 + cyc * 2.2);
      const pulseMat = m.pulse.material as THREE.MeshBasicMaterial;
      pulseMat.opacity = (hot ? 0.6 : 0.14) * (1 - cyc) * (showLabels ? 1 : 0);
      pulseMat.color.set(dest ? 0x4edea3 : here ? 0xffbd2e : 0xc3c0ff);

      const lampMat = m.lamp.material as THREE.MeshBasicMaterial;
      lampMat.color.set(dest ? 0x4edea3 : here ? 0xffbd2e : 0xffffff);
      m.lamp.scale.setScalar(1 + Math.sin(t * 2.4 + m.phase) * (hot ? 0.24 : 0.1));
      (m.ring.material as THREE.MeshBasicMaterial).opacity =
        (hot ? 0.95 : 0.5) * (showLabels ? 1 : 0);

      if (!showLabels) return;
      const facing = m.unit.dot(camDir);
      this.projV.copy(m.lamp.position).project(this.camera);
      const onScreen =
        this.projV.z < 1 && Math.abs(this.projV.x) < 1.05 && Math.abs(this.projV.y) < 1.05;
      if (facing > 0.1 && onScreen) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        labels.push({
          code: m.station.code,
          x: (this.projV.x * 0.5 + 0.5) * rect.width,
          y: (-this.projV.y * 0.5 + 0.5) * rect.height,
          opacity: Math.min(1, (facing - 0.1) * 5),
          state: dest ? 'dest' : here ? 'here' : 'idle',
        });
      }
    });

    this.cb.onLabels(labels);
  }

  private updateLights(dt: number, t: number): void {
    const ac = this.aircraft;
    if (!ac || !ac.group.visible) return;
    this.strobeT += dt;
    ac.strobe.color.setScalar(this.strobeT % 1.1 < 0.07 ? 1 : 0.05);
    const nb = 0.55 + Math.sin(t * 5) * 0.45;
    ac.navRed.color.setRGB(nb, 0.09, 0.07);
    ac.navGreen.color.setRGB(0.09, nb, 0.3);
    ac.beaconLow.color.setScalar(Math.sin(t * 4) > 0.4 ? 1 : 0.12);
  }

  private emitTelemetry(): void {
    const f = this.leg;
    const prof = f ? altProfile(f.t) : 0;
    const flightPhase: FlightPhase = !f
      ? 'stand'
      : f.t < 0.18
        ? 'climb'
        : f.t < 0.82
          ? 'cruise'
          : 'descent';

    this.cb.onTelemetry({
      phase: this.phase,
      flightPhase,
      callsign: this.flightNo ? `TT—${String(this.flightNo).padStart(3, '0')}` : 'TT—000',
      fromCode: f ? f.from.code : this.current.code,
      fromCity: f ? f.from.city : this.current.city,
      toCode: f ? f.to.code : null,
      toCity: f ? f.to.city : null,
      distanceKm: f ? f.km : 0,
      eteMinutes: f ? (f.km / CRUISE_KMH) * 60 : 0,
      progress: f ? f.t : 0,
      heading: f ? f.heading : 0,
      altitudeFt: Math.round(prof * CRUISE_FT),
      groundSpeedKt: Math.round(prof * 475 + (prof > 0.02 ? 140 : 0)),
      legCount: this.legCount,
      currentCode: this.current.code,
    });
  }
}

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
