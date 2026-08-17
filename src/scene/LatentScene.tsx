import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { FogExp2 } from 'three';
import { Ambient } from './Ambient';
import { CameraRig } from './CameraRig';
import { EdgeLines } from './EdgeLines';
import { NodeCloud } from './NodeCloud';
import { QueryNode, RetrievalBeams } from './QueryNode';

/**
 * The canvas is transparent and the backdrop is a CSS radial gradient on the
 * wrapper. That is one fewer draw call than a shader backdrop, it stays crisp
 * at any resolution, and it keeps the "no skybox" rule honest.
 *
 * Fog is the depth cue instead. Its colour has to track the gradient's centre,
 * or distant nodes fade toward the wrong value.
 */
const FOG_COLOR = 0x0a0e14;

export function LatentScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 400, position: [0, 8, 46] }}
      onCreated={({ scene }) => {
        scene.fog = new FogExp2(FOG_COLOR, 0.0125);
      }}
    >
      <CameraRig />
      <Ambient />
      <EdgeLines />
      <NodeCloud />
      <RetrievalBeams />
      <QueryNode />

      <EffectComposer>
        {/* Threshold sits above the desaturated skill hues and below the
            full-chroma project hues, so only projects glow at rest. Intensity
            is deliberately restrained: at close range a strong bloom turns each
            project into a halo big enough to wash out the panels behind it. */}
        <Bloom intensity={0.9} luminanceThreshold={0.5} luminanceSmoothing={0.3} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
