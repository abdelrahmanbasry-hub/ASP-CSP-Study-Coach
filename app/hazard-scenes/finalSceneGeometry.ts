import type { SceneOverlay, ScenePoint } from "../hazardTypes";
import type { PhysicalTemplate } from "./phase4SceneGeometry";

type Geometry = Pick<SceneOverlay, "point" | "shapes" | "semantic">;
const zone = (ids: string, point: ScenePoint, rx = 65, ry = rx, semantic: SceneOverlay["semantic"] = "zone") => Object.fromEntries(ids.split(" ").map(id => [id, { point, semantic, shapes: [{ type: "ellipse", cx: point[0], cy: point[1], rx, ry }] }])) as Record<string, Geometry>;
const path = (ids: string, point: ScenePoint, d: string) => Object.fromEntries(ids.split(" ").map(id => [id, { point, semantic: "path", shapes: [{ type: "path", d, arrow: true }] }])) as Record<string, Geometry>;
const control = (ids: string, point: ScenePoint, rx = 60, ry = rx) => zone(ids, point, rx, ry, "control");
const source = (ids: string, point: ScenePoint, rx = 65, ry = rx) => zone(ids, point, rx, ry, "source");

/** Explicit template/semantic coordinates, reviewed against base artwork. Never hazard-ID branching.
 * Conceptual conditions use illustrative regions; no regulatory distances or physical thresholds. */
export const FINAL_PHYSICAL_TEMPLATES: Record<string, PhysicalTemplate> = {
  "environmental-release-pathways": {
    points: { worker: [395, 430], "hazard-source": [240, 450], "control-point": [550, 385] },
    overlays: {
      ...source("air-source", [220, 250], 55, 110), ...path("plume", [270, 85], "M270 85 Q430 80 670 190"),
      ...source("spill-source chemical-source exposed-material", [240, 450], 95, 70), ...source("ust", [280, 695], 140, 75), ...source("leak-point", [415, 720], 45),
      ...zone("soil-zone excavation-zone", [500, 690], 230, 120), ...zone("soil-column", [500, 750], 65, 130), ...zone("water-table groundwater groundwater-plume", [535, 875], 275, 50),
      ...path("migration-path soil-water-path", [415, 720], "M415 720 Q470 780 535 875"), ...path("surface-release release-point", [240, 450], "M240 450 Q350 490 425 530"),
      ...source("storm-drain", [505, 530], 50), ...path("runoff-path drain-path drift-runoff", [330, 475], "M330 475 L505 530"),
      ...path("outfall", [505, 530], "M505 530 L780 580"), ...zone("surface-water receptor-zone", [820, 580], 125, 85),
      ...control("treatment control-device", [550, 385], 70, 70), ...source("wastewater-source", [565, 385], 50), ...path("rainfall", [490, 190], "M490 190 L490 420"),
      ...control("secondary-containment", [240, 500], 110, 35), ...control("site-boundary", [790, 440], 125, 35), ...path("application-path", [240, 450], "M240 450 Q480 360 690 435"),
    },
  },
  "facility-security-scene": {
    points: { worker: [135, 670], "hazard-source": [230, 680], "control-point": [250, 570] },
    overlays: {
      ...zone("worker", [135, 670], 50, 120, "worker"), ...zone("threat-source threat-zone", [230, 680], 85, 125),
      ...control("access-control credential-control", [250, 570], 40), ...control("entry-point controlled-entry", [255, 640], 70, 100),
      ...control("perimeter", [500, 480], 330, 45), ...control("alarm-communication", [330, 485], 65, 90), ...control("protected-space", [620, 480], 75, 110),
      ...path("intrusion-path", [220, 690], "M220 690 L255 600"), ...path("escape-route", [135, 670], "M135 670 Q465 810 620 580"),
      ...path("responder-entry", [150, 780], "M150 780 L450 620"), ...zone("response-zone", [500, 790], 150, 55),
      ...source("hazmat-storage", [800, 670], 115, 90), ...source("tamper-point", [745, 635], 40),
    },
  },
  "emergency-response-scene": {
    points: { worker: [775, 705], "hazard-source": [245, 730], "control-point": [390, 600] },
    overlays: {
      ...source("facility critical-system", [500, 450], 260, 170), ...source("utility-impact failure-point", [155, 540], 75, 95), ...control("backup-system", [165, 545], 70),
      ...source("suspicious-object", [245, 730], 45), ...zone("isolation-zone affected-area", [245, 730], 145, 95),
      ...source("weather-hazard", [90, 370], 55, 100), ...control("alarm threat-report", [420, 515], 35),
      ...control("assembly-area accountability", [775, 705], 100, 95), ...control("shelter-evacuation", [860, 450], 80, 115),
      ...path("evacuation-route exit-routes", [390, 600], "M390 600 Q540 810 765 735 M680 470 L800 650"),
    },
  },
  "ergonomic-worker-lift": {
    points: { worker: [400, 520], "hazard-source": [510, 550], "control-point": [760, 690] },
    overlays: { ...source("load load-resistance", [510, 550], 90, 65), ...zone("body-posture posture-angle", [400, 520], 60, 170, "worker"), ...zone("grip-zone", [465, 550], 55, 35, "worker"), ...zone("reach-zone", [590, 530], 140, 60), ...source("lift-origin", [280, 820], 100, 45), ...control("lift-destination", [760, 690], 100, 55), ...path("force-vector", [510, 550], "M510 550 L510 415") },
  },
  "ergonomic-workstation": {
    points: { worker: [350, 570], "hazard-source": [600, 490], "control-point": [280, 630] },
    overlays: {
      ...zone("neck-angle", [295, 255], 45, 55, "worker"), ...zone("spine-angle spine-zone static-body-zone body-posture neutral-posture", [285, 430], 50, 140, "worker"),
      ...zone("shoulder-elevation", [320, 365], 40, 45, "worker"), ...zone("joint-deviation hand-arm", [570, 490], 65, 40, "worker"),
      ...zone("keyboard-reach control-reach reach-zone", [650, 495], 90, 45), ...path("hand-path", [600, 490], "M600 490 L675 500"),
      ...path("overhead-reach", [490, 425], "M490 425 Q560 275 685 180"), ...zone("worker-envelope", [495, 515], 125, 265),
      ...control("chair-support support-point padding-control", [235, 500], 45, 85), ...control("adjustability", [280, 630], 45), ...source("vehicle-seat", [345, 630], 65, 45),
      ...source("contact-edge pressure-zone work-surface work-height task-height", [600, 530], 105, 30), ...source("display-height", [750, 340], 80, 75),
      ...zone("clearance-zone", [650, 700], 70, 125), ...source("surface-condition", [580, 850], 110, 30), ...path("vibration-path", [435, 655], "M435 655 L435 440"),
      ...path("work-cycle repetition-cycle", [600, 490], "M600 490 C690 420 735 570 620 555"),
      ...zone("duration-indicator task-rate fatigue-level performance-zone", [300, 400], 60, 100, "condition"),
      ...control("recovery-time rest-cycle", [280, 630], 65, 70),
    },
  },
  "noise-source-worker": {
    points: { worker: [810, 530], "hazard-source": [160, 480], "control-point": [520, 480] },
    overlays: {
      ...source("noise-source source source-a impulse-source", [160, 480], 125, 145), ...source("source-b vibrating-tool", [135, 710], 60), ...source("source-c", [235, 780], 70),
      ...zone("sound-field combined-field exposure-zone", [470, 480], 245, 160, "condition"),
      ...zone("worker", [810, 530], 70, 230, "worker"), ...zone("worker-ear-zone hearing-threshold", [820, 190], 35, 40, "worker"),
      ...control("hearing-protector fit-zone", [820, 190], 45), ...control("dose-meter audiogram noise-history control-program", [805, 315], 45, 60),
      ...zone("sound-level exposure-time time-pattern noise-bursts quiet-period residual-exposure", [805, 315], 70, 100, "condition"),
      ...path("peak-wave", [280, 480], "M230 435 Q460 120 820 190"), ...path("reflected-paths", [280, 480], "M230 435 L475 130 L820 190"), ...source("hard-surfaces", [510, 200], 110, 40),
      ...control("absorption-control barrier-control", [520, 480], 60, 210), ...control("isolation-control", [280, 795], 120, 30), ...path("distance-control", [350, 830], "M350 830 L730 830"), ...path("hand-arm-path", [135, 710], "M135 710 L780 425"),
    },
  },
  "thermal-worker-environment": {
    points: { worker: [500, 520], "hazard-source": [200, 450], "control-point": [250, 800] },
    overlays: {
      ...source("heat-source hot-humid-zone", [200, 450], 100, 175), ...source("cold-source cold-exposure", [800, 420], 95, 180),
      ...zone("heat-load extreme-heat-load worker-heat-load work-capacity workload fatigue-zone", [500, 530], 75, 165, "condition"),
      ...zone("worker-cold-load shivering", [500, 530], 80, 175, "condition"), ...zone("core-temperature thermoregulation-failure body-water", [500, 495], 55, 90, "condition"),
      ...zone("skin-zone sweat sweating sweat-loss humidity wetness", [480, 430], 70, 120, "condition"),
      ...zone("extremity freezing-zone", [555, 645], 35, 60, "worker"), ...zone("muscle-zone", [480, 665], 45, 90, "worker"),
      ...zone("standing-worker", [500, 520], 70, 265, "worker"), ...zone("circulation", [500, 610], 55, 130, "condition"),
      ...zone("heat-zone", [330, 445], 120, 145), ...zone("wind-exposure", [680, 485], 100, 190), ...path("wind-path", [800, 425], "M800 425 L560 485"),
      ...path("fluid-loss", [470, 410], "M470 410 Q350 515 390 645"), ...path("fluid-intake", [250, 765], "M250 765 Q370 700 485 555"),
      ...control("hydration cool-area rest-area cooling-control cooling-response", [250, 800], 100, 50),
      ...control("warm-shelter warming-control insulation-control drying-control", [800, 800], 100, 60), ...zone("emergency-zone", [500, 510], 100, 220),
    },
  },
  "radiation-source-shield-worker": {
    points: { worker: [830, 520], "hazard-source": [185, 670], "control-point": [540, 490] },
    overlays: {
      ...source("alpha-source beta-source gamma-source neutron-source xray-source uv-source infrared-source visible-source rf-source microwave-source antenna", [185, 670], 105, 160),
      ...zone("field field-zone penetrating-field near-field", [390, 515], 150, 140, "condition"), ...zone("short-range", [250, 515], 75, 100, "condition"),
      ...path("beam radiant-path", [285, 675], "M285 675 L780 460"), ...path("eye-path", [285, 675], "M285 675 L830 310"),
      ...path("skin-path internal-route", [285, 675], "M285 675 L815 535"),
      ...zone("worker", [830, 520], 65, 230, "worker"), ...zone("eye-zone glare-zone", [830, 310], 40, 45, "worker"), ...zone("eye-skin-zone", [820, 415], 55, 145, "worker"),
      ...control("shield shielding filter-control", [540, 490], 55, 210), ...control("containment", [185, 670], 130, 180),
      ...control("access-control controlled-area", [610, 785], 240, 40), ...path("distance", [260, 800], "M260 800 L820 800"),
    },
  },
  "laser-worker": {
    points: { worker: [780, 570], "hazard-source": [250, 575], "control-point": [555, 530] },
    overlays: { ...source("laser-source", [250, 575], 65, 55), ...path("direct-beam", [290, 575], "M290 575 L555 530"), ...path("reflection", [415, 550], "M415 550 L745 225"), ...zone("eye-zone", [745, 225], 40, 50, "worker"), ...control("beam-stop", [555, 530], 45, 60) },
  },
  "chemical-process-containment": {
    points: { worker: [900, 630], "hazard-source": [515, 495], "control-point": [745, 520] },
    overlays: {
      ...source("reactor vessel process-unit pressure-source", [515, 495], 130, 240),
      ...zone("reaction-zone pressure-zone temperature-zone pressure-rise temperature-rise reaction-rate hazardous-deviation temperature-pressure-trigger", [515, 495], 120, 160, "condition"),
      ...source("chemical-container liquid-container chemical-a oxidizer-source reactive-material peroxide-container pyrophoric-source gas-source cryogenic-container unknown-material", [165, 300], 65, 100),
      ...source("chemical-b fuel-source waste-container", [300, 300], 60, 100), ...zone("inerting-control cold-zone air-contact water-contact", [165, 245], 70, 65, "condition"),
      ...source("release-source release-point failure-point corrosion-zone degradation-zone material-of-construction", [470, 630], 60, 80),
      ...path("mixing-point process-introduction decomposition-path", [330, 540], "M330 540 L505 540"),
      ...path("gas-release plume airborne-plume vapor-cloud vapor-zone", [370, 325], "M370 325 Q500 170 680 210"),
      ...path("splash-path fire-path", [470, 630], "M470 630 Q700 500 880 590"), ...zone("spill-pool splash-zone", [600, 825], 130, 35),
      ...zone("worker-contact-zone exposure-zone worker-zone", [900, 630], 60, 190, "worker"),
      ...zone("ignition-zone ignition-source flash-zone heat-zone", [510, 420], 70, 90),
      ...control("containment containment-boundary containment-control separation-control segregation", [510, 840], 225, 35),
      ...control("cooling-control ventilation", [580, 385], 55, 130), ...control("relief-device relief-system", [370, 325], 40, 60),
      ...path("discharge-path", [370, 325], "M370 325 L370 225"), ...zone("blocked-relief", [370, 325], 45), ...zone("blocked-flow", [325, 505], 45),
      ...control("sensor interlock alarm process-variable", [745, 520], 60, 75),
      ...control("shutdown-control response-control backup-system", [745, 580], 65, 55), ...path("shutdown-path", [745, 580], "M745 580 L615 540"),
      ...zone("bypass missed-warning", [745, 520], 70, 90, "condition"), ...source("utility-source utility-loss", [700, 670], 70, 85),
      ...path("process-fluid", [360, 645], "M360 645 L500 590"), ...path("drain-path", [600, 825], "M600 825 L665 840"),
      ...control("change-request hazard-review authorization implementation readiness-check open-action startup-sequence", [745, 520], 70, 95),
    },
  },
  "chemical-storage": {
    points: { worker: [840, 640], "hazard-source": [535, 475], "control-point": [500, 785] },
    overlays: {
      ...source("storage-rack incompatible-storage storage-zone flammable-zone incompatible-zone", [535, 475], 180, 230),
      ...control("secondary-containment", [500, 785], 230, 40), ...control("labeling", [520, 450], 55),
      ...source("container-condition", [550, 670], 85, 75), ...source("waste-container waste-area", [220, 710], 70, 115),
      ...path("release-path", [550, 670], "M550 670 Q610 770 560 805"),
    },
  },
  "fire-process-area": {
    points: { worker: [860, 570], "hazard-source": [205, 650], "control-point": [370, 660] },
    overlays: {
      ...source("release-source", [280, 445], 55), ...zone("flammable-zone vapor-cloud", [205, 650], 170, 180, "condition"),
      ...source("ignition-source ignition-point", [530, 455], 50), ...zone("flame-zone blast-zone", [480, 580], 180, 210),
      ...zone("worker-zone", [860, 570], 70, 200, "worker"), ...control("bond-ground", [370, 660], 90, 45),
      ...zone("charge-build-up", [215, 555], 70, 65, "condition"), ...path("spark-discharge", [215, 555], "M215 555 L280 445"),
      ...source("self-heating-material", [710, 615], 65, 95), ...zone("heat-build-up", [710, 615], 90, 120, "condition"), ...control("separation-control", [645, 765], 50, 90),
    },
  },
  "combustible-dust-process": {
    points: { worker: [900, 680], "hazard-source": [680, 420], "control-point": [470, 640] },
    overlays: { ...zone("dust-cloud", [680, 420], 105, 195, "condition"), ...zone("dust-layer", [470, 850], 220, 35), ...source("ignition-source", [470, 640], 55), ...zone("explosion-zone", [680, 420], 155, 240) },
  },
  "hot-work-worker": {
    points: { worker: [300, 570], "hazard-source": [420, 485], "control-point": [850, 430] },
    overlays: {
      ...source("hot-work-source torch-arc hot-metal", [420, 485], 50), ...path("spark-path", [420, 485], "M420 485 Q610 480 730 520"),
      ...zone("combustible-zone", [730, 440], 70, 100), ...zone("fire-watch", [850, 430], 60, 175, "worker"),
    },
  },
  "fire-protection-system": {
    points: { worker: [660, 740], "hazard-source": [400, 690], "control-point": [840, 610] },
    overlays: {
      ...source("fire-source fire-zone", [400, 690], 150, 150), ...control("sprinkler-network", [500, 225], 270, 40),
      ...zone("closed-valve", [840, 610], 50), ...control("detectors", [480, 120], 40), ...zone("impaired-detector", [480, 120], 50),
      ...path("suppression-path", [350, 280], "M350 280 L390 585"), ...path("alarm-path", [480, 120], "M480 120 Q730 140 840 320"),
    },
  },
  "fire-extinguisher-use": {
    points: { worker: [320, 560], "hazard-source": [760, 780], "control-point": [400, 600] },
    overlays: { ...source("fire-class", [760, 780], 120, 50), ...control("extinguisher", [400, 600], 55, 85), ...path("approach-path", [370, 865], "M370 865 L650 805"), ...path("escape-route", [320, 840], "M320 840 Q190 740 120 630") },
  },
  "forklift-battery-charging": {
    points: { worker: [505, 490], "hazard-source": [560, 605], "control-point": [890, 405] },
    overlays: { ...source("battery", [560, 605], 100, 75), ...control("charger", [890, 405], 80, 140), ...zone("hydrogen-zone", [590, 505], 140, 95, "condition"), ...source("ignition-source", [575, 570], 45), ...path("ventilation", [590, 505], "M590 505 Q650 375 730 275") },
  },
  "excavation-trench": {
    points: { worker: [465, 650], "hazard-source": [705, 540], "control-point": [360, 555] },
    overlays: {
      ...zone("collapse-zone soil-face wall-stress", [705, 560], 85, 205), ...control("protective-system support-zone", [365, 555], 65, 230),
      ...source("surcharge-load surcharge-zone spoil-pile", [580, 255], 150, 55), ...source("utility-lines strike-point", [175, 730], 130, 35),
      ...zone("water-level", [510, 860], 135, 45, "condition"), ...path("inflow-path", [700, 720], "M700 720 Q650 820 535 855"), ...control("pump-zone", [520, 860]),
      ...zone("atmosphere-volume", [520, 540], 110, 200, "condition"), ...control("monitoring-point", [465, 595]), ...path("ventilation-path", [620, 330], "M620 330 Q540 450 520 620"),
      ...control("access-point", [605, 385]), ...zone("blocked-exit", [590, 745], 40, 75), ...path("egress-path", [590, 780], "M590 780 L620 320"),
      ...zone("equipment-edge-zone", [240, 295], 155, 40), ...path("excavator-path travel-path", [245, 275], "M245 275 L420 290"),
      ...source("adjacent-structure", [850, 260], 85, 50), ...path("soil-removal", [740, 560], "M740 560 Q640 510 590 600"),
    },
  },
  "confined-space-vessel": {
    points: { worker: [445, 680], "hazard-source": [445, 480], "control-point": [140, 565] },
    overlays: {
      ...zone("oxygen-deficient-atmosphere oxygen-enriched-atmosphere toxic-atmosphere flammable-atmosphere atmosphere-volume", [440, 520], 130, 195, "condition"),
      ...control("monitor", [330, 620], 35), ...control("ventilation", [870, 865], 80, 65), ...path("ventilation-path", [680, 245], "M680 245 Q575 250 580 440 L580 690"),
      ...zone("entrant", [445, 680], 55, 160, "worker"), ...zone("attendant entry-supervisor", [735, 245], 65, 140, "worker"),
      ...source("source-release ignition-source energy-source connected-line", [140, 575], 100, 40), ...control("isolation isolation-point", [140, 495], 50),
      ...zone("engulfment-material tapered-floor", [450, 845], 140, 45), ...zone("converging-walls entrapment-zone", [575, 765], 45, 135), ...source("moving-equipment", [540, 740], 50),
      ...path("inlet-path", [180, 575], "M180 575 L380 575"), ...path("egress-path", [330, 815], "M330 815 L345 320"), ...path("rescue-path", [440, 605], "M440 605 L440 60"), ...control("permit", [705, 345], 60),
    },
  },
  "loto-energy-machine": {
    points: { worker: [520, 485], "hazard-source": [535, 515], "control-point": [185, 250] },
    overlays: {
      ...source("electrical-source capacitor-battery", [155, 220], 80, 95), ...source("mechanical-source equipment moving-part", [525, 510], 165, 100),
      ...source("hydraulic-source accumulator stored-pressure", [855, 285], 90, 120), ...source("pneumatic-source air-line", [175, 740], 100, 60),
      ...source("thermal-source hot-cold-zone chemical-inventory process-source residual-sources stored-energy multiple-energy-sources energy-sources", [790, 545], 145, 130),
      ...control("isolation isolation-devices disconnect group-lock-box", [205, 280], 60, 75), ...control("valve line-valves drain-purge", [170, 490], 100, 50),
      ...control("verification verification-step", [525, 450], 65), ...zone("worker-zone worker-danger-zone", [525, 490], 100, 115, "worker"),
      ...control("restraint block-restraint", [585, 545], 60), ...zone("elevated-component", [865, 205], 65, 95), ...path("gravity-path", [865, 205], "M865 205 L865 505"),
      ...path("bleed-down", [175, 740], "M175 740 L175 870"), ...path("cooldown", [785, 490], "M785 490 Q705 380 650 330"), ...path("reaccumulation", [810, 540], "M810 540 Q880 470 865 345"),
    },
  },
  "pressure-vessel-hose": {
    points: { worker: [150, 540], "hazard-source": [465, 465], "control-point": [335, 410] },
    overlays: {
      ...source("pressure-source pressure-vessel vacuum-vessel pressure-rise", [475, 470], 100, 235), ...control("relief-device", [475, 125], 40, 80), ...control("isolation-point valve", [335, 410], 40),
      ...zone("rupture-zone implosion-zone heat-zone stored-pressure", [475, 480], 125, 220), ...path("rupture-path fragment-path", [490, 440], "M490 440 Q325 370 180 330"),
      ...path("external-pressure-arrows", [670, 410], "M670 410 L530 410"), ...source("pressurized-hose hydraulic-line hot-fluid-line", [445, 920], 190, 40),
      ...source("coupling-failure pinhole-leak", [720, 690], 45), ...path("whip-path", [700, 790], "M700 790 Q625 620 410 715 Q335 760 275 630"),
      ...zone("hand-zone", [235, 460], 70, 40, "worker"), ...zone("worker-face-zone", [150, 275], 65, 75, "worker"),
      ...path("injection-path", [310, 440], "M310 440 L235 460"), ...source("cylinder", [920, 575], 55, 215),
      ...path("release-path release-cloud", [920, 365], "M920 365 Q795 250 660 280"), ...zone("projectile-zone impact-zone", [685, 315], 125, 75),
      ...source("compressed-air-source tool-source", [300, 450], 55), ...path("air-jet flying-particles", [315, 445], "M315 445 L400 360"), ...path("actuator-motion", [575, 580], "M575 580 L575 660"),
    },
  },
};

// Arrows can describe protective actions as well as incident paths. Keep their
// semantic control treatment so the legend never calls ventilation or egress a hazard.
const protectivePaths = new Set(["inerting-control", "ventilation", "ventilation-path", "distance-control", "distance", "rescue-path", "egress-path", "evacuation-route", "exit-routes", "escape-route", "responder-entry", "fluid-intake", "neutral-posture"]);
export function finalGeometry(template: string, token: string): Geometry {
  const value = FINAL_PHYSICAL_TEMPLATES[template]?.overlays[token];
  if (!value) throw new Error(`Missing final scene geometry: ${template}/${token}`);
  return protectivePaths.has(token) ? { ...value, semantic: "control" } : value;
}
