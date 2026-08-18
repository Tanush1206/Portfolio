import { Color } from 'three';
import type { Cluster } from '../types';

/**
 * Scene colours mirror the custom properties in index.css. They are duplicated
 * rather than read from the DOM because three.js needs linear-space Color
 * objects allocated once, not a getComputedStyle call per frame — but the two
 * lists must be edited together.
 */
export const CLUSTER_HEX: Record<Cluster, string> = {
  ml: '#6EE7DC',
  eng: '#A78BFA',
  data: '#F0B429',
};

/**
 * RESERVED. --query belongs to the visitor's query and the things that point
 * at it: the query node, its retrieval beams, and the citation chips. It is not
 * a hover colour, not a focus ring, not an "active" state, and not an accent.
 * The moment it appears on anything else it stops reading as "this is you" and
 * the entire colour story stops working. If you are reaching for it for a UI
 * state, the answer is --ivory or --muted at a different alpha.
 */
export const QUERY_HEX = '#FF5E5B';

export const CLUSTER_COLOR: Record<Cluster, Color> = {
  ml: new Color(CLUSTER_HEX.ml),
  eng: new Color(CLUSTER_HEX.eng),
  data: new Color(CLUSTER_HEX.data),
};

export const QUERY_COLOR = new Color(QUERY_HEX);
export const MUTED = new Color('#7C8798');

/**
 * Skills are substrate, projects are objects.
 *
 * The desaturation is capped deliberately. Pushing skills further toward
 * --muted does separate them from projects, but it also collapses the three
 * cluster hues toward the same grey, and at full-cloud distance the legend then
 * corresponds to nothing. If projects still need more emphasis, the lever is
 * size or opacity — not more chroma loss.
 */
const SKILL_DESATURATION = 0.55;

export function nodeColor(cluster: Cluster, isSkill: boolean): Color {
  const base = CLUSTER_COLOR[cluster].clone();
  return isSkill ? base.lerp(MUTED, SKILL_DESATURATION) : base;
}
