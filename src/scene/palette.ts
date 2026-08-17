import { Color } from 'three';
import type { Cluster } from '../types';

/**
 * Scene colours mirror the CSS custom properties in index.css. They are
 * duplicated rather than read from the DOM because three.js needs linear-space
 * Color objects allocated once, not a getComputedStyle call per frame — but the
 * two must be edited together.
 */
export const CLUSTER_HEX: Record<Cluster, string> = {
  ml: '#8b9dff',
  eng: '#4edea3',
  data: '#ffb454',
};

export const QUERY_HEX = '#ff4d8d';

export const CLUSTER_COLOR: Record<Cluster, Color> = {
  ml: new Color(CLUSTER_HEX.ml),
  eng: new Color(CLUSTER_HEX.eng),
  data: new Color(CLUSTER_HEX.data),
};

/**
 * Skills are substrate, projects are objects. Desaturating skill hues toward
 * --muted is the lever that keeps 34 skills from swamping 8 projects; pushing
 * project scale up further instead just makes the cloud lopsided.
 */
export const MUTED = new Color('#5c6773');

export function nodeColor(cluster: Cluster, isSkill: boolean): Color {
  const base = CLUSTER_COLOR[cluster].clone();
  return isSkill ? base.lerp(MUTED, 0.55) : base;
}
