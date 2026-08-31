import type { SceneOverlay, ScenePoint } from "../hazardTypes";

type Geometry = Pick<SceneOverlay, "point" | "shapes" | "semantic">;
export interface PhysicalTemplate { points: Record<string, ScenePoint>; overlays: Record<string, Geometry> }
const zone = (ids: string, point: ScenePoint, rx = 65, ry = rx, semantic: SceneOverlay["semantic"] = "zone") => Object.fromEntries(ids.split(" ").map(id => [id, { point, semantic, shapes: [{ type: "ellipse", cx: point[0], cy: point[1], rx, ry }] }])) as Record<string, Geometry>;
const path = (ids: string, point: ScenePoint, d: string) => Object.fromEntries(ids.split(" ").map(id => [id, { point, semantic: "path", shapes: [{ type: "path", d, arrow: true }] }])) as Record<string, Geometry>;
const control = (ids: string, point: ScenePoint, rx = 70, ry = rx) => zone(ids, point, rx, ry, "control");
const source = (ids: string, point: ScenePoint, rx = 70, ry = rx) => zone(ids, point, rx, ry, "source");

/** Physical coordinates are template data, never selected by hazard ID.
 * Illustrative extents carry no distance, boundary or regulatory claim. */
export const PHASE4_PHYSICAL_TEMPLATES: Record<string, PhysicalTemplate> = {
  "electrical-panel-worker": {
    points: { worker: [330, 420], panel: [640, 600], "arc-source": [575, 435], "exposed-part": [610, 380], "fire-source": [600, 560] },
    overlays: { "arc-source": { point: [575, 435], semantic: "source", shapes: [{ type: "burst", cx: 575, cy: 435, radius: 80 }] }, ...zone("thermal-zone", [465, 440], 110, 140), ...zone("light-zone", [410, 290], 90), ...path("blast-path", [575, 435], "M575 435 Q445 475 320 550"), ...source("exposed-live-parts", [610, 380], 65, 125), ...zone("approach-zone", [500, 580], 160, 200), ...source("ignition-point", [600, 560], 40), ...zone("smoke-zone", [630, 350], 100, 150), ...zone("fire-zone", [600, 560], 80, 130) },
  },
  "electrical-contact-worker": {
    points: { worker: [340, 540], "energized-part": [700, 350], "contact-point": [615, 350], "heat-source": [625, 365] },
    overlays: { ...source("contact-point contact-burn-zone", [615, 350], 45), ...source("energized-source", [710, 370], 70, 120), ...path("current-path", [615, 350], "M615 350 Q500 365 380 460 L320 680 L370 875"), ...zone("arc-heat-zone", [625, 365], 100, 115) },
  },
  "overhead-power-line": {
    points: { worker: [650, 205], "overhead-line": [540, 130], equipment: [760, 845] },
    overlays: { ...zone("power-line-zone", [540, 130], 290, 50), ...path("equipment-approach-path", [690, 290], "M690 290 Q675 200 665 130") },
  },
  "electrical-circuit": {
    points: { source: [185, 465], conductor: [490, 740], load: [845, 530], loads: [845, 530], breaker: [480, 510] },
    overlays: { ...source("undersized-conductor", [490, 740], 85, 35), ...zone("overheat-zone", [570, 740], 100, 65), ...path("load-path overcurrent-path", [185, 465], "M185 465 L340 465 L340 740 L560 740 L560 530 L820 530"), ...control("protective-device", [480, 510], 65, 90) },
  },
  "electrical-cord-grounding": {
    points: { worker: [350, 430], cord: [510, 835], plug: [80, 545], tool: [745, 450], "equipment-case": [725, 450], ground: [650, 460] },
    overlays: { ...source("damaged-insulation exposed-conductor", [510, 835], 75, 35), ...path("fault-path", [510, 835], "M510 835 Q425 730 465 535 L450 475"), ...path("ground-path", [650, 460], "M650 460 Q460 570 470 680 Q380 940 115 785 L80 545"), ...source("energized-case", [725, 450], 90, 80) },
  },
  "walking-surface-worker": {
    points: { worker: [450, 480], "surface-contamination": [450, 775], obstruction: [800, 675] },
    overlays: { ...zone("slip-zone", [450, 775], 145, 40), ...path("loss-of-balance-path", [470, 565], "M470 565 Q620 565 710 720"), ...source("trip-obstruction", [800, 675], 85, 40), ...path("fall-path", [560, 635], "M560 635 Q730 610 825 820") },
  },
  "floor-opening-worker": {
    points: { worker: [290, 370], opening: [630, 560], "lower-level": [660, 925] },
    overlays: { ...zone("opening-zone", [630, 560], 165, 100), ...path("fall-path", [400, 515], "M400 515 Q600 550 660 900"), ...control("cover-guardrail-zone", [460, 560], 170, 45) },
  },
  "roof-edge-worker": {
    points: { worker: [380, 360], edge: [520, 520], "lower-level": [535, 940], roof: [520, 360] },
    overlays: { ...zone("unprotected-edge edge-zone", [520, 520], 220, 50), ...path("fall-path", [495, 490], "M495 490 Q565 655 535 920"), ...zone("lower-level-zone", [535, 940], 160, 40), ...zone("opening-zone", [625, 190], 100, 65) },
  },
  "ladder-worker": {
    points: { worker: [510, 465], ladder: [500, 580], landing: [620, 120] },
    overlays: { ...path("ladder-angle", [425, 920], "M425 920 L620 120"), ...zone("base-slip-zone", [425, 920], 100, 35), ...zone("overreach-zone", [625, 345], 90, 100), ...path("fall-path", [570, 460], "M570 460 Q730 660 740 910") },
  },
  "stairway-worker": {
    points: { worker: [430, 365], stairs: [330, 715], handrail: [590, 340] },
    overlays: { ...source("stair-defect", [330, 715], 65, 35), ...control("handrail-zone", [590, 340], 50, 150), ...path("fall-path", [480, 465], "M480 465 Q360 650 250 790") },
  },
  "scaffold-worker": {
    points: { worker: [510, 225], platform: [610, 365], "lower-level": [775, 870], object: [585, 390], "worker-above": [510, 225], "worker-below": [890, 740] },
    overlays: { ...zone("unprotected-edge", [640, 365], 130, 40), ...path("fall-path", [620, 370], "M620 370 Q800 490 775 850"), ...zone("platform-failure-zone", [540, 385], 190, 35), ...control("access-zone", [200, 600], 55, 210), ...path("falling-object-path", [585, 390], "M585 390 Q660 580 650 870"), ...zone("drop-zone", [650, 870], 150, 45), ...control("barricade-zone", [800, 880], 160, 45) },
  },
  "aerial-lift-worker": {
    points: { worker: [760, 180], platform: [760, 305], base: [395, 830] },
    overlays: { ...zone("platform-edge", [820, 320], 110, 35), ...path("ejection-path", [805, 200], "M805 200 Q950 255 925 650"), ...zone("tip-zone", [630, 875], 210, 50) },
  },
  "rope-descent-worker": {
    points: { worker: [485, 565], anchorage: [415, 130], "rope-system": [435, 340] },
    overlays: { ...control("anchorage", [415, 130], 55), ...path("descent-line", [425, 160], "M425 160 L460 510"), ...zone("suspension-zone", [485, 565], 100, 130), ...path("fall-path", [475, 670], "M475 670 L475 940") },
  },
  "fall-arrest-system": {
    points: { worker: [450, 575], anchorage: [790, 35], structure: [830, 600], harness: [450, 430], "rescue-point": [710, 150] },
    overlays: { ...path("anchorage-offset", [790, 35], "M790 35 L455 35 L455 300"), ...path("swing-path", [490, 770], "M490 770 Q660 820 800 740"), ...zone("impact-zone", [830, 600], 50, 150), ...zone("suspended-worker", [450, 575], 90, 210, "worker"), ...path("rescue-path", [710, 150], "M710 150 Q615 330 470 455"), ...zone("time-critical-zone", [450, 430], 80, 100, "condition") },
  },
  "fall-arrest-clearance": {
    points: { worker: [350, 330], anchorage: [210, 60], "lower-level": [680, 970] },
    overlays: { ...path("free-fall", [440, 480], "M440 480 L440 670"), ...path("deceleration-distance", [525, 680], "M525 680 L525 830"), ...path("clearance-line", [715, 465], "M715 465 L715 945"), ...zone("lower-level", [680, 970], 220, 30) },
  },
  "machine-guarding": {
    points: { worker: [115, 540], machine: [715, 650], "danger-zone": [530, 490], "point-of-operation": [750, 580], guard: [340, 370], "nip-point": [530, 490], "moving-parts": [530, 490], shaft: [470, 680], "moving-part": [770, 320], "fixed-part": [750, 580], blade: [755, 555], material: [835, 590] },
    overlays: { ...source("missing-guard", [420, 500], 80, 140), ...control("guard-zone", [340, 370], 75, 125), ...zone("danger-zone nip-point", [530, 490], 70), ...path("access-path hand-entry-zone", [275, 495], "M275 495 L530 490"), ...source("point-of-operation cutting-point", [750, 580], 70), ...path("rotation-direction", [530, 490], "M505 435 C605 430 615 540 530 545"), ...path("draw-in-path", [425, 410], "M425 410 L530 490"), ...source("rotating-shaft", [470, 680], 100, 45), ...zone("entanglement-zone", [470, 680], 100, 80), ...path("wrap-path", [470, 680], "M390 650 C400 745 550 750 550 670"), ...path("reciprocating-path", [770, 320], "M770 320 L755 520"), ...zone("crush-zone", [750, 540], 80, 50), ...path("shear-path", [755, 525], "M755 525 L755 610") },
  },
  "grinder-saw-workstation": {
    points: { worker: [500, 290], tool: [200, 425], workpiece: [485, 485], grinder: [200, 425], wheel: [300, 420], saw: [830, 425] },
    overlays: { ...path("ejection-path fragment-path", [300, 420], "M300 420 Q400 310 500 205"), ...zone("impact-zone", [500, 290], 85, 90), ...control("shield-zone guard-zone", [300, 360], 65), ...source("wheel-zone", [300, 420], 60), ...zone("spark-zone", [330, 480], 100, 70), ...source("blade-zone", [830, 425], 70), ...path("kickback-path", [830, 425], "M830 425 Q665 330 550 260") },
  },
  "hand-tool-worker": {
    points: { worker: [350, 340], "hand-tool": [415, 445], workpiece: [420, 475], tool: [800, 455], attachment: [890, 420] },
    overlays: { ...source("tool-contact", [415, 445], 55), ...path("slip-path", [415, 445], "M415 445 Q500 485 610 570"), ...zone("flying-fragment-zone", [485, 360], 100, 110), ...zone("moving-tool-zone", [890, 420], 80, 55), ...control("trigger-control", [770, 480], 40), ...control("guard-zone", [885, 425], 60), ...source("energy-source", [770, 610], 50) },
  },
  "robot-cell": {
    points: { worker: [140, 590], robot: [605, 375], "cell-boundary": [260, 610] },
    overlays: { ...zone("robot-motion-envelope", [535, 465], 220, 190), ...zone("worker-entry-zone", [260, 610], 80, 150), ...control("safeguard-boundary", [260, 610], 55, 200) },
  },
  "conveyor-system": {
    points: { worker: [130, 545], conveyor: [530, 420], drive: [420, 625], material: [700, 270], "worker-below": [875, 625] },
    overlays: { ...source("nip-point", [420, 625], 60), ...path("belt-path", [890, 160], "M890 160 L350 625"), ...zone("entanglement-zone", [420, 625], 85), ...control("guard-zone", [490, 650], 65), ...path("falling-material-path", [700, 270], "M700 270 Q825 430 810 830"), ...zone("drop-zone", [810, 850], 130, 40), ...control("overhead-guard-zone", [760, 420], 100, 35) },
  },
  "material-handling-worker": {
    points: { worker: [320, 435], load: [445, 375], destination: [735, 585], cart: [735, 585], path: [770, 810] },
    overlays: { ...zone("load-zone", [445, 375], 100, 75), ...path("lift-path", [445, 375], "M445 375 Q555 330 640 435"), ...zone("posture-zone", [320, 435], 85, 130, "worker"), ...path("push-pull-force", [900, 420], "M900 420 L975 420"), ...path("travel-path", [770, 810], "M770 810 L940 810"), ...zone("pinch-zone", [805, 785], 100, 50) },
  },
  "forklift-warehouse": {
    points: { forklift: [550, 700], operator: [600, 500], pedestrian: [885, 640], load: [210, 230], "tip-point": [795, 870], intersection: [820, 850], worker: [885, 640], mast: [300, 600] },
    overlays: { ...path("travel-path", [550, 800], "M550 800 Q300 850 130 900"), ...zone("collision-zone", [830, 810], 110, 85), ...zone("blind-spot", [260, 460], 160, 140), ...zone("pedestrian-zone", [885, 640], 70, 180, "worker"), ...zone("high-load unstable-load", [210, 230], 120, 100), ...source("center-of-gravity", [475, 490], 45), ...path("tip-path", [650, 550], "M650 550 Q870 620 800 855"), ...zone("tip-zone exclusion-zone", [795, 870], 160, 45), ...zone("slope-edge", [750, 900], 170, 30), ...path("falling-load-path", [210, 230], "M210 230 Q70 420 120 830"), ...zone("drop-zone", [120, 850], 95, 45), ...zone("mast-crush-zone", [300, 600], 60, 180), ...path("carriage-path", [300, 400], "M300 400 L300 740"), ...path("hand-entry-zone", [420, 580], "M420 580 L300 600") },
  },
  "loading-dock": {
    points: { forklift: [205, 470], dock: [450, 630], trailer: [750, 440] },
    overlays: { ...zone("dock-gap", [475, 650], 45, 150), ...path("trailer-movement", [805, 710], "M805 710 L955 740"), ...path("forklift-path", [205, 470], "M205 470 L675 555"), ...control("restraint-point", [605, 710], 55) },
  },
  "pallet-jack": {
    points: { operator: [225, 400], "pallet-jack": [450, 710], load: [730, 525] },
    overlays: { ...zone("fork-zone", [760, 780], 95, 45), ...zone("pinch-zone", [450, 710], 65), ...path("travel-path", [430, 820], "M450 770 Q315 860 190 805"), ...zone("load-stability", [730, 525], 140, 150) },
  },
  "warehouse-storage": {
    points: { stack: [125, 510], worker: [330, 630], aisle: [485, 860], rack: [665, 385], load: [710, 200], forklift: [945, 550] },
    overlays: { ...zone("unstable-stack", [125, 510], 110, 210), ...path("collapse-path", [200, 420], "M200 420 Q360 575 460 820"), ...zone("exclusion-zone", [485, 860], 210, 45), ...source("rack-damage", [520, 700], 50, 100), ...zone("overload-zone", [710, 200], 160, 90) },
  },
  "crane-suspended-load": {
    points: { crane: [575, 120], load: [560, 685], worker: [145, 675], sling: [460, 475], hook: [520, 370] },
    overlays: { ...zone("suspended-load", [560, 685], 150, 110), ...path("swing-path", [560, 685], "M450 655 Q620 800 790 690"), ...zone("drop-zone exclusion-zone", [565, 875], 200, 55), ...source("rigging-leg", [445, 510], 40, 110), ...source("connection-point", [520, 370], 45), ...path("failure-path", [560, 685], "M565 730 L565 860") },
  },
  "forklift-battery-charging": {
    points: { forklift: [505, 600], battery: [560, 605], charger: [890, 405] },
    overlays: { ...source("battery", [560, 605], 100, 75), ...zone("charging-zone", [750, 640], 230, 150), ...zone("hydrogen-zone", [590, 505], 140, 95, "condition"), ...zone("electrolyte-zone", [595, 670], 100, 65), ...source("short-circuit-zone", [575, 570], 45) },
  },
};

export function phase4Geometry(template: string, id: string): Geometry {
  const geometry = PHASE4_PHYSICAL_TEMPLATES[template]?.overlays[id];
  if (!geometry) throw new Error(`Missing Phase 4 geometry: ${template}/${id}`);
  return geometry;
}
export function phase4Landmark(template: string, id: string): ScenePoint {
  const point = PHASE4_PHYSICAL_TEMPLATES[template]?.points[id];
  if (!point) throw new Error(`Missing Phase 4 landmark: ${template}/${id}`);
  return point;
}
