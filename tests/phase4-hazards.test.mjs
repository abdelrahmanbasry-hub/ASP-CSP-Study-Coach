import { canonicalHazardId } from "../app/hazardAliases.ts";
import "./helpers/register-tsx.mjs";
import assert from "node:assert/strict";
import { test, after, afterEach } from "node:test";
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { Window } from "happy-dom";
import { PHASE4_DATASET, PHASE4_HAZARD_RECORDS, PHASE4_STANDARD_AUDIT } from "../app/phase4HazardData.ts";
import { HAZARD_LIBRARY_RECORDS, HAZARD_LIBRARY_BY_ID, HAZARD_REFERENCE_RECORDS, validateHazardLibrary } from "../app/hazardLibraryData.ts";
import { HAZARD_RECORDS } from "../app/hazardData.ts";
import { HAZARD_CATEGORY_BY_ID } from "../app/hazardCategories.ts";
import { PHASE4_CATEGORIES } from "../app/phase4Taxonomy.ts";
import { SCENE_TEMPLATES, supportsSceneEngine } from "../app/hazard-scenes/sceneTemplates.ts";
import { resolveHazardStandards } from "../app/hazardStandardReferences.ts";
import { OSHA_STANDARDS } from "../app/standardsData.ts";
import { filterHazards } from "../app/hazardExplorer.ts";
import { emptyStudySystemState, normalizeStudySystemState } from "../app/studySystemState.ts";
import { filterPracticeV2References } from "../app/practiceV2.ts";
const { PRACTICE_V2_QUESTIONS } = await import("../app/practiceV2Catalog.ts");
const { buildGlobalSearchIndex, searchGlobalIndex } = await import("../app/globalSearch.ts");
const source = PHASE4_DATASET.records;

test("controlled package remains byte-identical; exactly 52 unique records import as 10/14/14/14", () => {
  const bytes = readFileSync(new URL("../data/hazard-library/phase4/phase4-hazard-master-dataset.json", import.meta.url));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "7fc5d22f4d633395b799fee7e3945b1aa8e0ebcd4fbbfb5e3d578a2ff3a75d7b");
  assert.equal(source.length, 52); assert.equal(PHASE4_HAZARD_RECORDS.length, 52);
  assert.equal(new Set(PHASE4_HAZARD_RECORDS.map(r => r.id)).size, 52);
  assert.deepEqual(Object.fromEntries(Object.entries(PHASE4_CATEGORIES).map(([code, category]) => [code, PHASE4_HAZARD_RECORDS.filter(r => r.categoryId === category).length])), { ELEC: 10, FALL: 14, MACH: 14, MAT: 14 });
  assert.equal(HAZARD_LIBRARY_RECORDS.length, 220); assert.doesNotThrow(() => validateHazardLibrary());
});

test("lossless adapter preserves every controlled bilingual field, tag, source qualifier and visualization token", () => {
  for (const raw of source) {
    const record = HAZARD_LIBRARY_BY_ID[raw.id];
    for (const field of ["name", "summary", "mechanisms", "consequences", "highRiskWork", "controls", "workContexts", "relatedPracticeTags", "searchTerms"]) assert.deepEqual(record[field], raw[field], `${raw.id}/${field}`);
    for (const [key, value] of Object.entries(raw.source)) assert.equal(record.source[key], value, `${raw.id}/${key}`);
    assert.deepEqual(record.importMetadata, { phase: 4, packageVersion: PHASE4_DATASET.version, contentStatus: raw.contentStatus, categoryId: raw.categoryId, subcategoryId: raw.subcategoryId, visualization: raw.visualization });
    const controlled = PHASE4_HAZARD_RECORDS.find(r => r.id === raw.id);
    assert.deepEqual(controlled.visualization.overlays.map(o => o.id), raw.visualization.overlays);
    assert.deepEqual(controlled.visualization.landmarks.map(o => o.id), raw.visualization.markers);
    assert.ok(HAZARD_CATEGORY_BY_ID[record.categoryId].subcategories.some(s => s.id === record.subcategoryId));
  }
  assert.deepEqual(Object.fromEntries(["direct", "indirect", "supplemented"].map(support => [support, PHASE4_HAZARD_RECORDS.filter(r => r.source.yatesSupport === support).length])), { direct: 42, indirect: 4, supplemented: 6 });
});

test("all supplied standard numbers keep scope/relation; only real catalog IDs are linked", () => {
  assert.equal(PHASE4_STANDARD_AUDIT.length, 110);
  assert.equal(PHASE4_STANDARD_AUDIT.filter(r => r.resolution === "resolved").length, 2);
  const unresolved = PHASE4_STANDARD_AUDIT.filter(r => r.resolution === "unresolved");
  assert.equal(unresolved.length, 108); assert.equal(new Set(unresolved.map(r => r.number)).size, 38);
  for (const raw of source) {
    const record = HAZARD_LIBRARY_BY_ID[raw.id];
    assert.deepEqual(record.standardReferences.map(({ number, scope, relation }) => ({ number, scope, relation })), raw.relatedStandards);
    for (const reference of record.standardReferences) {
      if (reference.resolution === "resolved") assert.ok(OSHA_STANDARDS.some(s => s.id === reference.standardId));
      else assert.equal("standardId" in reference, false);
    }
    assert.deepEqual(record.relatedStandardIds, [...new Set(record.standardReferences.flatMap(r => r.standardId ? [r.standardId] : []))]);
  }
  const refs = [{ number: " 29 CFR 1910.147 ", scope: "general-industry", relation: "related" }, { number: "1910.9999", scope: "general-industry", relation: "direct" }];
  assert.equal(resolveHazardStandards(refs)[0].standardId, "1910-147");
  assert.deepEqual(resolveHazardStandards(refs, []), refs.map(r => ({ ...r, resolution: "unresolved", reason: "not-in-catalog" })));
});

test("27 configured templates reuse existing engines with 24 optimized additions and no per-hazard components", () => {
  const names = [...new Set(source.map(r => r.visualization.template))]; assert.equal(names.length, 27);
  assert.equal(names.filter(name => !HAZARD_REFERENCE_RECORDS.some(r => r.visualization.template === name)).length, 24);
  for (const record of PHASE4_HAZARD_RECORDS) {
    const scene = record.visualization, template = SCENE_TEMPLATES[scene.template];
    assert.ok(supportsSceneEngine(template, scene.kind));
    assert.ok(statSync(new URL(`../public${template.asset}`, import.meta.url)).size < 230_000);
    assert.equal(template.width, 1200); assert.equal(template.height, 1200);
    for (const overlay of scene.overlays) {
      assert.ok(overlay.label.ar && overlay.label.en); assert.ok(overlay.shapes.length);
      for (const value of [...overlay.point, ...overlay.marker]) assert.ok(value >= 0 && value <= 1000);
      assert.deepEqual(overlay.description, record.summary);
    }
    for (let i = 0; i < scene.overlays.length; i++) for (let j = i + 1; j < scene.overlays.length; j++) {
      const a = scene.overlays[i].marker, b = scene.overlays[j].marker;
      assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) >= 145, `${record.id} markers overlap`);
    }
  }
  assert.ok(supportsSceneEngine(SCENE_TEMPLATES["electrical-cord-grounding"], "concept-diagram"));
  assert.ok(supportsSceneEngine(SCENE_TEMPLATES["electrical-cord-grounding"], "worker-scene"));
  assert.ok(supportsSceneEngine(SCENE_TEMPLATES["grinder-saw-workstation"], "worker-scene"));
  assert.ok(supportsSceneEngine(SCENE_TEMPLATES["grinder-saw-workstation"], "equipment-scene"));
  assert.equal(supportsSceneEngine(SCENE_TEMPLATES["electrical-cord-grounding"], "process-diagram"), false);
});

test("one search index covers all controlled fields, supplied Practice tags and unresolved standard numbers", () => {
  for (const r of PHASE4_HAZARD_RECORDS) {
    const queries = [r.name.en, r.name.ar, r.summary.en, r.mechanisms[0].ar, r.consequences[0].en, r.highRiskWork[0].ar, r.categoryId.replaceAll("-", " "), ...r.relatedPracticeTags, ...r.workContexts, ...r.standardReferences.map(s => s.number), ...Object.values(r.controls).flat().map(t => t.en)];
    // Category display names are indexed, rather than internal slugs.
    queries[6] = HAZARD_CATEGORY_BY_ID[r.categoryId].name.en;
    for (const query of queries) assert.equal(filterHazards([r], { query }).length, 1, `${r.id} missing search: ${query}`);
  }
  const index = buildGlobalSearchIndex({ examName: "ASP", practiceBank: [], chapterPractice: [], attempts: [] });
  assert.equal(index.filter(d => d.kind === "hazard").length, 220);
  for (const id of ["HL-ELEC-001", "HL-FALL-003", "HL-MACH-005", "HL-MAT-014"]) {
    const result = searchGlobalIndex(index, id).find(d => d.id === `hazard:${id}`);
    assert.ok(result); assert.equal(result.target.itemId, id); assert.equal(result.target.libraryTab, "hazards");
  }
});

test("supplied Practice tags filter existing question objects without synthesizing content", () => {
  for (const record of PHASE4_HAZARD_RECORDS) {
    const related = filterPracticeV2References(PRACTICE_V2_QUESTIONS, { practiceTags: record.relatedPracticeTags, practiceQuestionIds: record.relatedPracticeQuestionIds });
    assert.equal(record.relatedPracticeQuestionIds.length, 0);
    assert.ok(related.every(question => PRACTICE_V2_QUESTIONS.includes(question)));
  }
});

test("the original 37 Occupational Health objects and six Phase 3 references retain identity and IDs", () => {
  assert.equal(HAZARD_REFERENCE_RECORDS.length, 6); assert.equal(HAZARD_RECORDS.length, 37);
  for (const record of HAZARD_REFERENCE_RECORDS) {
    assert.equal(HAZARD_LIBRARY_BY_ID[record.id].id, canonicalHazardId(record.id));
    assert.equal(HAZARD_LIBRARY_BY_ID[record.id].visualization, record.visualization);
  }
  for (const record of HAZARD_RECORDS) assert.equal(HAZARD_LIBRARY_BY_ID[record.id].visualization.occupationalHealth, record);
  assert.ok(HAZARD_LIBRARY_BY_ID["ref-arc-flash"]); assert.ok(HAZARD_LIBRARY_BY_ID["HL-ELEC-001"]);
  assert.equal(filterHazards(HAZARD_LIBRARY_RECORDS, { categoryId: "occupational-health", subcategoryId: "biological" }).length, 19);
});

const window = new Window({ url: "http://localhost/" });
const globals = ["window", "document", "HTMLElement", "SVGElement", "Node", "Event", "MouseEvent", "KeyboardEvent"];
const previous = new Map(globals.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
for (const key of globals) Object.defineProperty(globalThis, key, { value: key === "window" ? window : window[key], configurable: true, writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act, createElement, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { HazardVisualization } = await import("../app/hazard-library/HazardVisualization.tsx");
const { HazardsLibrary } = await import("../app/hazard-library/HazardsLibrary.tsx");
let root, container, savedState, opens;
async function render(component, props) {
  if (!root) { container = document.createElement("div"); document.body.append(container); root = createRoot(container); }
  await act(() => root.render(createElement(component, props)));
}
const click = async selector => { const element = typeof selector === "string" ? container.querySelector(selector) : selector; assert.ok(element, selector); await act(() => element.click()); };
const key = async (element, value) => act(() => { element.focus(); element.dispatchEvent(new window.KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true })); });
async function mountLibrary(id, initial = emptyStudySystemState()) {
  opens = []; savedState = initial;
  function Harness() { const [system, setSystem] = useState(initial); return createElement(HazardsLibrary, { initialItemId: id, system, onSystem: next => { savedState = next; setSystem(next); }, onOpen: (...args) => opens.push(args) }); }
  await render(Harness, {});
}
afterEach(async () => { if (root) await act(() => root.unmount()); root = null; container?.remove(); });
after(() => { window.happyDOM.abort(); for (const key of globals) { const old = previous.get(key); if (old) Object.defineProperty(globalThis, key, old); else delete globalThis[key]; } delete globalThis.IS_REACT_ACT_ENVIRONMENT; });

for (const record of PHASE4_HAZARD_RECORDS) test(`${record.id} ${record.name.en}: existing engine renders supplied overlays and landmarks in all languages`, async () => {
  for (const language of ["en", "ar", "both"]) {
    await render(HazardVisualization, { record, language, selectedSystem: null, onSelectSystem: () => {}, onClearSystem: () => {} });
    const config = record.visualization;
    assert.equal(container.querySelector(".hazard-scene").dataset.visualizationEngine, config.kind);
    assert.equal(container.querySelector(".hazard-scene").dataset.template, config.template);
    assert.equal(container.querySelectorAll("[data-overlay-id]").length, config.overlays.length);
    assert.equal(container.querySelectorAll("[data-landmark-id]").length, config.landmarks.length);
    assert.equal(!!container.querySelector('[lang="en"]'), language !== "ar");
    assert.equal(!!container.querySelector('[lang="ar"]'), language !== "en");
    assert.equal(container.querySelector(".scene-stage").dir, "ltr");
    const first = config.overlays[0]; await click(`[data-callout-id="${first.id}"]`);
    assert.equal(container.querySelector(`[data-overlay-id="${first.id}"]`).getAttribute("aria-pressed"), "true");
    assert.ok(container.querySelector(".scene-selection-summary").textContent.includes(record.summary[language === "ar" ? "ar" : "en"]));
    assert.equal(container.querySelector(`[data-connector="${first.id}"] path`).getAttribute("d"), `M${first.point[0]} ${first.point[1]} L${first.marker[0]} ${first.marker[1]}`);
    await click(`[data-landmark-id="${config.landmarks[0].id}"]`);
    assert.equal(container.querySelector("[data-landmark-focus]").dataset.landmarkFocus, config.landmarks[0].id);
    assert.equal(container.querySelector('.scene-marker[aria-pressed="true"]'), null);
  }
});

test("generic panel displays exact controlled content, standard mapping, provenance and supplied Practice tags", async () => {
  const r = PHASE4_HAZARD_RECORDS.find(r => r.source.yatesSupport === "supplemented");
  await mountLibrary(r.id);
  const panel = container.querySelector(".hazard-detail-card");
  assert.ok(panel.textContent.includes(r.summary.en)); assert.ok(panel.textContent.includes(r.source.yatesSection));
  assert.equal(panel.querySelector("[data-yates-support]").dataset.yatesSupport, "supplemented");
  assert.equal(panel.querySelectorAll("[data-standard-resolution]").length, r.standardReferences.length);
  for (const text of Object.values(r.controls).flat()) assert.ok(panel.textContent.includes(text.ar));
  await click(".scene-callout"); assert.ok(panel.querySelector("[data-selected-callout]"));
  assert.ok(panel.querySelector(".scene-selected-detail").textContent.includes(r.summary.en));
  await click('[aria-label="Related OSHA standards"]'); assert.deepEqual(opens[0][2], { standardIds: r.relatedStandardIds });
  await click('[aria-label="Related Practice"]'); assert.deepEqual(opens[1][2], { practiceTags: r.relatedPracticeTags, practiceQuestionIds: [] });
  await click('[data-category-id="electrical"]'); assert.equal(container.querySelector("[data-selected-callout]"), null);
});

test("resolved and unresolved links use genuine catalog IDs only", async () => {
  for (const resolution of ["resolved", "unresolved"]) {
    const record = PHASE4_HAZARD_RECORDS.find(r => resolution === "resolved" ? r.relatedStandardIds.length : !r.relatedStandardIds.length);
    await render(HazardsLibrary, { key: record.id, initialItemId: record.id, system: emptyStudySystemState(), onSystem: () => {}, onOpen: (...args) => { opens = args; } });
    await click('[aria-label="Related OSHA standards"]'); assert.deepEqual(opens[2].standardIds, record.relatedStandardIds);
    if (resolution === "unresolved") { assert.equal(opens[2].standardIds.length, 0); assert.ok(container.querySelector('[data-standard-resolution="unresolved"]')); }
  }
});

test("unified Save preserves legacy OH/reference notes and saves/removes a controlled ID", async () => {
  const entries = ["tox-benzene", "ref-arc-flash"].map(id => ({ id: `hazard:${id}`, kind: "hazard", title: id, subtitle: "saved", note: "Keep note", createdAt: 12, updatedAt: 34 }));
  const state = normalizeStudySystemState({ ...emptyStudySystemState(), notebook: Object.fromEntries(entries.map(e => [e.id, e])) });
  await mountLibrary("HL-ELEC-002", state);
  await click('.hazard-bookmark-heading button'); assert.ok(savedState.notebook["hazard:HL-ELEC-002"]);
  for (const entry of entries) assert.deepEqual(savedState.notebook[entry.id], entry);
  await click('.hazard-bookmark-heading button'); assert.equal(savedState.notebook["hazard:HL-ELEC-002"], undefined);
  for (const entry of entries) assert.deepEqual(savedState.notebook[entry.id], entry);
});

test("subcategory selection, language controls and keyboard callout/landmark focus remain usable", async () => {
  await mountLibrary("HL-MACH-001");
  await click('[data-subcategory-id="cutting"]');
  const expected = filterHazards(PHASE4_HAZARD_RECORDS, { categoryId: "machinery-tools", subcategoryId: "cutting" });
  assert.equal(container.querySelectorAll("[data-hazard-id]").length, expected.length);
  for (const language of ["العربية", "English", "Both"]) {
    await click([...container.querySelectorAll('.hazard-language-switch button')].find(b => b.textContent === language));
    assert.equal(!!container.querySelector('.hazard-scene [lang="en"]'), language !== "العربية");
    assert.equal(!!container.querySelector('.hazard-scene [lang="ar"]'), language !== "English");
  }
  const first = container.querySelector(".scene-marker"); await key(first, "Enter"); assert.equal(first.getAttribute("aria-pressed"), "true");
  await key(first, " "); assert.equal(first.getAttribute("aria-pressed"), "false");
  const landmarks = container.querySelectorAll("[data-landmark-id]"); await key(landmarks[0], "ArrowRight"); assert.equal(document.activeElement, landmarks[1]);
  await key(landmarks[1], "Enter"); assert.ok(container.querySelector("[data-landmark-focus]"));
  await click('[data-category-id="all"]'); assert.equal(container.querySelectorAll("[data-hazard-id]").length, 220);
  await click('[data-hazard-id="HL-MAT-014"]'); assert.equal(container.querySelector("[data-landmark-focus]"), null);
});
