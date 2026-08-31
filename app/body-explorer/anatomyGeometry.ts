import type { BodySystemId, HazardTarget } from "../bodySystems";

// Presentation only: colors and coordinates never determine hazard relationships.
export const ANATOMY_REGIONS: Record<BodySystemId, { tone: string; accent: string; anchor: readonly [number, number] }> = {
  brain: { tone: "#9cabb6", accent: "#74509b", anchor: [163, 57] },
  eyes: { tone: "#9baba9", accent: "#397a98", anchor: [176, 84] },
  ears: { tone: "#d1a990", accent: "#b9863a", anchor: [195, 82] },
  "upper-respiratory": { tone: "#c69e96", accent: "#168774", anchor: [160, 126] },
  respiratory: { tone: "#baaaa3", accent: "#168774", anchor: [153, 150] },
  lungs: { tone: "#c29c9a", accent: "#008d78", anchor: [185, 203] },
  heart: { tone: "#b66d65", accent: "#b64f59", anchor: [173, 224] },
  blood: { tone: "#be8f92", accent: "#7544a0", anchor: [247, 282] },
  "bone-marrow": { tone: "#c3a4ae", accent: "#7544a0", anchor: [160, 205] },
  liver: { tone: "#ad6c5e", accent: "#a86342", anchor: [137, 262] },
  kidneys: { tone: "#9c7b9f", accent: "#855aa1", anchor: [199, 300] },
  digestive: { tone: "#d19482", accent: "#b16d48", anchor: [169, 335] },
  skin: { tone: "#d9b49b", accent: "#b87859", anchor: [75, 276] },
  musculoskeletal: { tone: "#d7c3a5", accent: "#9d824b", anchor: [136, 420] },
  reproductive: { tone: "#bc8b96", accent: "#926088", anchor: [160, 381] },
  immune: { tone: "#9ca98d", accent: "#658d73", anchor: [207, 176] },
  systemic: { tone: "#b6b9a6", accent: "#648879", anchor: [261, 333] },
};

export type ConnectorPoint = { x: number; y: number };
export function orderedCalloutTargets(targets: readonly HazardTarget[]) {
  // Keep cards in anatomical order so a secondary target cannot cross primary connectors.
  return [...targets].sort((a, b) => ANATOMY_REGIONS[a.systemId].anchor[1] - ANATOMY_REGIONS[b.systemId].anchor[1]);
}

export function connectorPath(start: ConnectorPoint, end: ConnectorPoint) {
  const bend = Math.max(28, Math.abs(end.x - start.x) * .5);
  return `M${start.x} ${start.y}C${start.x + bend} ${start.y} ${end.x - bend} ${end.y} ${end.x} ${end.y}`;
}
