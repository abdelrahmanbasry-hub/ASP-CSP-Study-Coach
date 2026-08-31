import "./helpers/register-tsx.mjs";
import assert from "node:assert/strict";
import { after, afterEach, test } from "node:test";
import { readFileSync, statSync } from "node:fs";
import { Window } from "happy-dom";
import { HAZARD_REFERENCE_RECORDS, HAZARD_LIBRARY_BY_ID, validateHazardLibrary } from "../app/hazardLibraryData.ts";
import { filterHazards } from "../app/hazardExplorer.ts";
import { emptyStudySystemState } from "../app/studySystemState.ts";
const { SCENE_TEMPLATES } = await import("../app/hazard-scenes/sceneTemplates.ts");
const { WorkerHazardScene } = await import("../app/hazard-scenes/WorkerHazardScene.tsx");
const { EquipmentHazardScene } = await import("../app/hazard-scenes/EquipmentHazardScene.tsx");
const { ProcessHazardDiagram } = await import("../app/hazard-scenes/ProcessHazardDiagram.tsx");
const { ConceptVisualization } = await import("../app/hazard-scenes/ConceptVisualization.tsx");
const { HazardVisualization } = await import("../app/hazard-library/HazardVisualization.tsx");
const { HazardsLibrary } = await import("../app/hazard-library/HazardsLibrary.tsx");
const engines = { "worker-scene": WorkerHazardScene, "equipment-scene": EquipmentHazardScene, "process-diagram": ProcessHazardDiagram, "concept-diagram": ConceptVisualization };
const window = new Window({ url: "http://localhost/" });
const globals = ["window", "document", "HTMLElement", "SVGElement", "Node", "Event", "MouseEvent", "KeyboardEvent"];
const previous = new Map(globals.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
for (const key of globals) Object.defineProperty(globalThis, key, { value: key === "window" ? window : window[key], configurable: true, writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act, createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
let root, container;
async function render(component, props) {
  if (!root) { container = document.createElement("div"); document.body.append(container); root = createRoot(container); }
  await act(() => root.render(createElement(component, props)));
}
const click = async (selector) => { const element = typeof selector === "string" ? container.querySelector(selector) : selector; assert.ok(element, selector); await act(() => element.click()); };
const marker = (id) => container.querySelector(`[data-overlay-id="${id}"]`);
const shape = (id) => container.querySelector(`[data-overlay-shape="${id}"]`);
afterEach(async () => { if (root) await act(() => root.unmount()); root = null; container?.remove(); });
after(() => { window.happyDOM.abort(); for (const key of globals) { const descriptor = previous.get(key); if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } delete globalThis.IS_REACT_ACT_ENVIRONMENT; });

for (const record of HAZARD_REFERENCE_RECORDS) test(`${record.name.en}: engine renders semantic points, anchored connectors and selectable details`, async () => {
  const config = record.visualization;
  const changes = [];
  await render(engines[config.kind], { config, name: record.name, language: "both", onSelectOverlay: (id) => changes.push(id) });
  assert.equal(container.querySelector(".hazard-scene").dataset.template, config.template);
  assert.equal(container.querySelectorAll("[data-overlay-id]").length, config.overlays.length);
  assert.equal(container.querySelectorAll("[data-callout-id]").length, config.overlays.length);
  const img = container.querySelector(".scene-stage img");
  assert.equal(img.getAttribute("src"), SCENE_TEMPLATES[config.template].asset);
  assert.equal(img.getAttribute("width"), "1200");
  assert.equal(img.getAttribute("loading"), "lazy");
  for (const overlay of config.overlays) {
    const point = marker(overlay.id);
    assert.equal(point.tagName, "BUTTON");
    assert.ok(point.getAttribute("aria-label").includes(overlay.label.en));
    if (overlay.marker) assert.equal(container.querySelector(`[data-connector="${overlay.id}"] path`).getAttribute("d"), `M${overlay.point[0]} ${overlay.point[1]} L${overlay.marker[0]} ${overlay.marker[1]}`);
    await click(point);
    assert.equal(point.getAttribute("aria-pressed"), "true");
    assert.equal(container.querySelector(`[data-callout-id="${overlay.id}"]`).getAttribute("aria-pressed"), "true");
    assert.equal(shape(overlay.id).dataset.selected, "true");
    assert.ok(container.querySelector(".scene-selection-summary").textContent.includes(overlay.description.ar));
    assert.equal(changes.at(-1), overlay.id);
    await click(`[data-callout-id="${overlay.id}"]`);
    assert.equal(point.getAttribute("aria-pressed"), "false");
    assert.equal(changes.at(-1), null);
  }
});

test("router chooses configuration, resets on a different record and preserves BodySystemExplorer", async () => {
  const props = { language: "en", selectedSystem: null, onSelectSystem: () => {}, onClearSystem: () => {} };
  for (const record of HAZARD_REFERENCE_RECORDS) {
    await render(HazardVisualization, { ...props, record });
    assert.equal(container.querySelector("[data-visualization-engine]").dataset.visualizationEngine, record.visualization.kind);
    assert.equal(container.querySelectorAll('.scene-marker[aria-pressed="true"]').length, 0);
    await click(".scene-marker");
    assert.equal(container.querySelectorAll('.scene-marker[aria-pressed="true"]').length, 1);
  }
  await render(HazardVisualization, { ...props, record: HAZARD_LIBRARY_BY_ID["tox-benzene"] });
  assert.ok(container.querySelector(".human-body-svg"));
  assert.equal(container.querySelector(".hazard-scene"), null);
});

test("templates can be reused by a new record without hazard-ID branches", async () => {
  const base = HAZARD_REFERENCE_RECORDS[1];
  const record = { ...base, id: "fixture-reuse", name: { en: "Configured worker scene", ar: "مشهد عامل مهيأ" }, visualization: { ...base.visualization, overlays: [{ ...base.visualization.overlays[0], id: "fixture-edge", role: "secondary" }] } };
  await render(HazardVisualization, { record, language: "en", selectedSystem: null, onSelectSystem: () => {}, onClearSystem: () => {} });
  assert.equal(container.querySelectorAll(".scene-marker").length, 1);
  assert.equal(marker("fixture-edge").dataset.role, "secondary");
  assert.equal(container.querySelector(".scene-heading h3").textContent, "Configured worker scene");
});

test("scene modes separate paths from scene context and show effects without losing selection", async () => {
  const record = HAZARD_REFERENCE_RECORDS[1];
  await render(WorkerHazardScene, { config: record.visualization, name: record.name, language: "en", consequences: record.consequences });
  assert.equal(shape("fall-path").classList.contains("is-visible"), false);
  await click([...container.querySelectorAll(".scene-modes button")][1]);
  assert.equal(shape("fall-path").classList.contains("is-visible"), true);
  await click(marker("fall-path"));
  await click([...container.querySelectorAll(".scene-modes button")][2]);
  assert.ok(container.querySelector(".scene-effects").textContent.includes(record.consequences[0].en));
  assert.equal(marker("fall-path").getAttribute("aria-pressed"), "true");
});

test("generic details receives the selected callout, then clears it when changing hazards", async () => {
  const state = emptyStudySystemState(), opens = [];
  await render(HazardsLibrary, { initialItemId: "ref-unexpected-startup", system: state, onSystem: () => {}, onOpen: (...args) => opens.push(args) });
  await click('[data-callout-id="isolation-device"]');
  assert.equal(container.querySelector(".hazard-detail-card [data-selected-callout]").dataset.selectedCallout, "isolation-device");
  assert.ok(container.querySelector(".hazard-detail-card").textContent.includes("Energy-isolating devices"));
  await click('[aria-label="Related OSHA standards"]');
  assert.deepEqual(opens[0][2], { standardIds: ["1910-147"] });
  await click('[aria-label="Related Practice"]');
  assert.deepEqual(opens[1][2], { practiceTags: ["loto", "unexpected-startup", "hazardous-energy"], practiceQuestionIds: [] });
  await click('[data-category-id="electrical"]');
  assert.equal(container.querySelector("[data-selected-callout]"), null);
  assert.equal(container.querySelectorAll('.scene-marker[aria-pressed="true"]').length, 0);
});

test("all engines localize English/Arabic/Both without mirroring physical coordinates", async () => {
  for (const record of HAZARD_REFERENCE_RECORDS) for (const language of ["en", "ar", "both"]) {
    await render(HazardVisualization, { record, language, selectedSystem: null, onSelectSystem: () => {}, onClearSystem: () => {} });
    assert.equal(container.querySelector(".scene-stage").getAttribute("dir"), "ltr");
    assert.equal(container.querySelector(".scene-callouts").getAttribute("dir"), language === "ar" ? "rtl" : "ltr");
    assert.equal(!!container.querySelector('[lang="en"]'), language !== "ar");
    assert.equal(!!container.querySelector('[lang="ar"]'), language !== "en");
    for (const element of container.querySelectorAll('[lang="ar"]')) assert.equal(element.getAttribute("dir"), "rtl");
  }
});

test("arrow/Home/End navigation works for markers and external cards with native keyboard buttons", async () => {
  const record = HAZARD_REFERENCE_RECORDS[0];
  await render(WorkerHazardScene, { config: record.visualization, name: record.name, language: "en" });
  const points = [...container.querySelectorAll(".scene-marker")];
  const key = async (element, key) => act(() => { element.focus(); element.dispatchEvent(new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })); });
  await key(points[0], "ArrowRight"); assert.equal(document.activeElement, points[1]);
  await key(points[1], "End"); assert.equal(document.activeElement, points.at(-1));
  await key(points.at(-1), "Home"); assert.equal(document.activeElement, points[0]);
  await key(points[0], "Enter"); assert.equal(points[0].getAttribute("aria-pressed"), "true");
  await key(points[0], " "); assert.equal(points[0].getAttribute("aria-pressed"), "false");
  const cards = [...container.querySelectorAll(".scene-callout")];
  await key(cards[0], "ArrowDown"); assert.equal(document.activeElement, cards[1]);
  for (const element of [...points, ...cards]) { assert.equal(element.type, "button"); assert.ok(element.getAttribute("aria-pressed")); }
});

test("inactive overlays stay muted and radiation principles are directly selectable", async () => {
  const forklift = HAZARD_REFERENCE_RECORDS[2];
  await render(EquipmentHazardScene, { config: forklift.visualization, name: forklift.name, language: "en" });
  await click(marker("slope-edge"));
  assert.equal(shape("slope-edge").classList.contains("is-visible"), false);
  assert.match(container.querySelector(".scene-selection-summary").textContent, /Not active/);
  const radiation = HAZARD_REFERENCE_RECORDS[5];
  await render(ConceptVisualization, { config: radiation.visualization, name: radiation.name, language: "en" });
  const principles = [...container.querySelectorAll(".scene-principles button")];
  assert.equal(principles.length, 3);
  assert.match(principles.map((el) => el.textContent).join(" "), /TIME.*DISTANCE.*SHIELDING/);
  await click(principles[2]);
  assert.equal(marker("shielding").getAttribute("aria-pressed"), "true");
});

test("shared search includes callout concepts, controls and the sixth reference", () => {
  for (const [query, id] of [["fall trajectory", "ref-scaffold-fall"], ["ventilation", "ref-oxygen-deficient-space"], ["verification", "ref-unexpected-startup"], ["التدريع", "ref-radiation-exposure"]]) {
    assert.ok(filterHazards(HAZARD_REFERENCE_RECORDS, { query }).some((record) => record.id === id));
  }
});

test("template/overlay validation rejects unsupported engines, duplicate IDs and invalid coordinates", () => {
  const record = HAZARD_REFERENCE_RECORDS[0], config = record.visualization, first = config.overlays[0];
  assert.throws(() => validateHazardLibrary([{ ...record, visualization: { ...config, template: "missing" } }]), /Invalid scene template/);
  assert.throws(() => validateHazardLibrary([{ ...record, visualization: { ...config, overlays: [first, first] } }]), /overlay ID/);
  assert.throws(() => validateHazardLibrary([{ ...record, visualization: { ...config, overlays: [{ ...first, point: [-1, 10] }] } }]), /coordinate/);
});

test("optimized local assets, mobile layout, focus and reduced-motion rules stay in place", () => {
  for (const record of HAZARD_REFERENCE_RECORDS) {
    const file = new URL(`../public${SCENE_TEMPLATES[record.visualization.template].asset}`, import.meta.url);
    assert.ok(statSync(file).size < 200_000);
    assert.equal(readFileSync(file).subarray(8, 12).toString(), "WEBP");
  }
  const css = readFileSync(new URL("../app/hazard-scenes/hazard-scenes.css", import.meta.url), "utf8");
  assert.match(css, /width: 44px; height: 44px/);
  assert.match(css, /@container \(max-width: 420px\)/);
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /animation: none !important; transition: none !important/);
});

test("44px targets stay separate within the smallest verified mobile scene", () => {
  const width = 251, target = 44;
  for (const record of HAZARD_REFERENCE_RECORDS) {
    const points = record.visualization.overlays.map((overlay) => ({ id: overlay.id, point: overlay.marker ?? overlay.point }));
    for (const [index, a] of points.entries()) {
      assert.ok(a.point.every((coordinate) => coordinate / 1000 * width >= target / 2 && coordinate / 1000 * width <= width - target / 2), a.id);
      for (const b of points.slice(index + 1)) assert.ok(Math.abs(a.point[0] - b.point[0]) / 1000 * width >= target || Math.abs(a.point[1] - b.point[1]) / 1000 * width >= target, `${record.id}: ${a.id} overlaps ${b.id}`);
    }
  }
});

test("missing images retain accessible descriptions and an unsupported template fails cleanly", async () => {
  const record = HAZARD_REFERENCE_RECORDS[0];
  await render(WorkerHazardScene, { config: record.visualization, name: record.name, language: "en" });
  await act(() => container.querySelector("img").dispatchEvent(new window.Event("error")));
  assert.ok(container.querySelector(".scene-image-error"));
  assert.equal(container.querySelectorAll(".scene-callout").length, record.visualization.overlays.length);
  await render(WorkerHazardScene, { config: { ...record.visualization, template: "unavailable" }, name: record.name, language: "en" });
  assert.match(container.textContent, /Scene template unavailable/);
});
