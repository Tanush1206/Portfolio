/**
 * Node screen positions, deliberately outside zustand.
 *
 * Citation lines need every node's projected 2D position each frame. Pushing a
 * 45-entry map through the store at 60 Hz would re-render the whole UI tree
 * continuously, so the scene writes here and consumers read it in their own
 * rAF, setting attributes imperatively. Readers can be one frame stale — 16 ms,
 * invisible, and not worth engineering around.
 */
export const screen = {
  /** Interleaved x,y in CSS pixels. */
  xy: new Float32Array(0),
  /** 1 when the node is in front of the camera and inside the frustum. */
  visible: new Uint8Array(0),
  index: new Map<string, number>(),
  /** Bumped every write, so a reader can skip work when nothing moved. */
  frame: 0,
};

export function allocateScreen(ids: string[]): void {
  screen.xy = new Float32Array(ids.length * 2);
  screen.visible = new Uint8Array(ids.length);
  screen.index = new Map(ids.map((id, i) => [id, i]));
  screen.frame = 0;
}

/** Returns null when the node is off-screen or behind the camera. */
export function screenPosOf(id: string): { x: number; y: number } | null {
  const i = screen.index.get(id);
  if (i === undefined || !screen.visible[i]) return null;
  return { x: screen.xy[i * 2], y: screen.xy[i * 2 + 1] };
}
