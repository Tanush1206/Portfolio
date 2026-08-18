interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

function connection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

/**
 * Should the embedding model wait until someone actually asks something?
 *
 * A first visit costs roughly 9 MB once the runtime and the weights are in —
 * fine on a desktop connection, not fine on mobile data. The cloud itself is
 * ~340 KB and fully explorable without any of it, so on a constrained device
 * the model is held back until the visitor submits a query. Someone who only
 * looks around never pays for a model they never used.
 *
 * Deliberately not a user-agent sniff: `saveData` and `effectiveType` are the
 * browser telling us directly, and a coarse pointer on a small viewport is the
 * shape of the device rather than a guess at its name.
 */
export function shouldDeferModel(): boolean {
  if (typeof navigator === 'undefined') return false;

  const c = connection();
  if (c?.saveData) return true;
  if (c?.effectiveType && ['slow-2g', '2g', '3g'].includes(c.effectiveType)) return true;

  const coarse =
    typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  return coarse && window.innerWidth < 900;
}

/** Roughly what a first query costs to download, compressed. Cached after once. */
export const MODEL_DOWNLOAD_MB = 9;

/**
 * Small screens get a lower pixel-ratio ceiling and a thinner drift field. Both
 * are pure fill-rate on a tile-based mobile GPU, and neither carries meaning.
 */
export function isSmallScreen(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 900;
}
