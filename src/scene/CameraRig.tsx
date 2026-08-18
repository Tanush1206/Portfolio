import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera, Vector3 } from 'three';
import { useStore } from '../store/useStore';
import { rig } from './screen';

const MIN_RADIUS = 6;
const MAX_RADIUS = 90;
/** Stay off the poles — at exactly 0 or π the orbit basis degenerates. */
const MIN_POLAR = 0.18;
const MAX_POLAR = Math.PI - 0.18;

const DAMP_ORBIT = 6;
const DAMP_TARGET = 3.2;
const IDLE_DRIFT = 0.018;

/**
 * Hand-written damped orbit rig. Not OrbitControls — the spec rules it out, and
 * this needs behaviour OrbitControls does not have: it eases toward a target
 * the store nominates, and it keeps drifting when nobody is touching it so the
 * cloud reads as a volume rather than a still image.
 *
 * Camera intent is one-way. The store holds `camTarget`; the rig reads it and
 * owns all the easing internally, and never writes back.
 */
export function CameraRig() {
  const { camera, gl } = useThree();
  const camTarget = useStore((s) => s.camTarget);
  const focusId = useStore((s) => s.focusId);
  const nodes = useStore((s) => s.nodes);

  /**
   * Framing is derived from the cloud, not guessed. The bake decides how far
   * the outermost node sits from the origin, so a hardcoded radius clips the
   * corpus the moment the corpus changes. Fit its bounding sphere to the
   * vertical FOV, then back off for the HUD panels along the bottom edge.
   */
  const restRadius = useMemo(() => {
    if (!nodes.length) return 46;
    let far = 0;
    for (const n of nodes) far = Math.max(far, Math.hypot(n.pos[0], n.pos[1], n.pos[2]));
    const fov = ((camera as PerspectiveCamera).fov * Math.PI) / 180;
    return (far / Math.sin(fov / 2)) * 1.18;
  }, [nodes, camera]);

  // Everything here is mutated per-frame and must never trigger a render.
  const want = useRef({ az: 0.7, pol: 1.15, rad: 46 });
  const have = useRef({ az: 0.7, pol: 1.15, rad: 62 });
  const target = useRef(new Vector3());
  const desired = useRef(new Vector3());
  const dragging = useRef(false);
  const idle = useRef(0);

  useEffect(() => {
    desired.current.set(camTarget[0], camTarget[1], camTarget[2]);
    // Move in when something specific is being looked at; pull back to take in
    // the whole cloud when the selection clears. Closing all the way in fills
    // the frame with one sphere and loses the context that made it worth
    // looking at, so the focus distance stays a fraction of the rest framing
    // rather than a fixed small number.
    want.current.rad = focusId ? Math.max(14, restRadius * 0.4) : restRadius;
  }, [camTarget, focusId, restRadius]);

  useEffect(() => {
    const el = gl.domElement;
    let lastX = 0;
    let lastY = 0;

    const down = (e: PointerEvent) => {
      dragging.current = true;
      idle.current = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      want.current.az -= dx * 0.005;
      want.current.pol = clamp(want.current.pol - dy * 0.005, MIN_POLAR, MAX_POLAR);
      idle.current = 0;
    };
    const up = (e: PointerEvent) => {
      dragging.current = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      want.current.rad = clamp(want.current.rad * (1 + e.deltaY * 0.0012), MIN_RADIUS, MAX_RADIUS);
      idle.current = 0;
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
    };
  }, [gl]);

  useFrame((_, dt) => {
    // Clamp dt so a backgrounded tab doesn't resume with one enormous step that
    // snaps the camera across the scene.
    const d = Math.min(dt, 0.1);

    if (!dragging.current) {
      idle.current += d;
      if (idle.current > 2.5) want.current.az += IDLE_DRIFT * d;
    }

    const kOrbit = 1 - Math.exp(-DAMP_ORBIT * d);
    have.current.az += (want.current.az - have.current.az) * kOrbit;
    have.current.pol += (want.current.pol - have.current.pol) * kOrbit;
    have.current.rad += (want.current.rad - have.current.rad) * kOrbit;

    target.current.lerp(desired.current, 1 - Math.exp(-DAMP_TARGET * d));

    // Published for the citation lines. The idle drift never stops, so
    // "settled" has to mean "not travelling anywhere", not "not moving" —
    // measure the remaining distance to the target, not the per-frame delta.
    rig.settled =
      !dragging.current &&
      Math.abs(want.current.rad - have.current.rad) < 0.35 &&
      target.current.distanceToSquared(desired.current) < 0.09;

    const { az, pol, rad } = have.current;
    const sp = Math.sin(pol);
    camera.position.set(
      target.current.x + rad * sp * Math.sin(az),
      target.current.y + rad * Math.cos(pol),
      target.current.z + rad * sp * Math.cos(az),
    );
    camera.lookAt(target.current);
  });

  return null;
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
