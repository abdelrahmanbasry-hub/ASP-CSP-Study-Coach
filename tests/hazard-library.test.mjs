import { canonicalHazardId } from "../app/hazardAliases.ts";
import "./helpers/register-tsx.mjs";
import assert from "node:assert/strict";
import { after, afterEach, test } from "node:test";
import { readFileSync } from "node:fs";
import { Window } from "happy-dom";
import { HAZARD_RECORDS } from "../app/hazardData.ts";
import { HAZARD_CATEGORIES } from "../app/hazardCategories.ts";
import { HAZARD_LIBRARY_RECORDS, HAZARD_LIBRARY_BY_ID, HAZARD_REFERENCE_RECORDS, validateHazardLibrary } from "../app/hazardLibraryData.ts";
import { filterHazards } from "../app/hazardExplorer.ts";
import { emptyStudySystemState, normalizeStudySystemState } from "../app/studySystemState.ts";
import { OSHA_STANDARDS } from "../app/standardsData.ts";
import { filterPracticeV2References } from "../app/practiceV2.ts";
const { buildGlobalSearchIndex, searchGlobalIndex } = await import("../app/globalSearch.ts");
const { PRACTICE_V2_QUESTIONS } = await import("../app/practiceV2Catalog.ts");

const window = new Window({ url: "http://localhost/" });
const globals = ["window", "document", "HTMLElement", "SVGElement", "Node", "Event", "MouseEvent", "KeyboardEvent"];
const previous = new Map(globals.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
for (const key of globals) Object.defineProperty(globalThis, key, { value: key === "window" ? window : window[key], configurable: true, writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act, createElement, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { HazardsLibrary } = await import("../app/hazard-library/HazardsLibrary.tsx");
const { StandardsExplorer } = await import("../app/StudySystem.tsx");
const { default: PracticeV2 } = await import("../app/PracticeV2View.tsx");
let root, container, savedState, opens;

async function mount(props = {}, initial = emptyStudySystemState()) {
  opens = [];
  savedState = initial;
  function Harness() {
    const [system, setSystem] = useState(initial);
    return createElement(HazardsLibrary, { ...props, system, onSystem: (next) => { savedState = next; setSystem(next); }, onOpen: (...args) => opens.push(args) });
  }
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
  await act(() => root.render(createElement(Harness)));
}
const click = async (element) => { assert.ok(element); await act(() => element.dispatchEvent(new window.MouseEvent("click", { bubbles: true }))); };
const key = async (element, value) => { await act(() => { element.focus(); element.dispatchEvent(new window.KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true })); }); };
const visible = (element) => !element.closest("[hidden]");
const button = (label) => {
  const found = [...container.querySelectorAll("button")].filter(visible).find((element) => element.getAttribute("aria-label") === label || element.textContent.trim() === label);
  assert.ok(found, `Missing button: ${label}`); return found;
};
const chooseCategory = async (id) => {
  const category = HAZARD_CATEGORIES.find((entry) => entry.id === id);
  if (category?.placement === "more") await click(button("More"));
  await click(container.querySelector(`[data-category-id="${id}"]`));
};
const records = () => [...container.querySelectorAll("[data-hazard-id]")].filter(visible);
const engine = () => container.querySelector("[data-visualization-engine]")?.getAttribute("data-visualization-engine");
const search = async (value) => {
  const input = container.querySelector('[aria-label="Search hazards"]');
  await act(() => { Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(input, value); input.dispatchEvent(new window.Event("input", { bubbles: true })); });
};
afterEach(async () => { if (root) await act(() => root.unmount()); root = null; container?.remove(); });
after(() => { window.happyDOM.abort(); for (const key of globals) { const descriptor = previous.get(key); if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } delete globalThis.IS_REACT_ACT_ENVIRONMENT; });

test("canonical catalog adapts 37 source records by identity and adds exactly six implemented reference scenes", () => {
  assert.equal(HAZARD_LIBRARY_RECORDS.length, 220);
  assert.equal(HAZARD_REFERENCE_RECORDS.length, 6);
  assert.doesNotThrow(() => validateHazardLibrary());
  for (const source of HAZARD_RECORDS) {
    const record = HAZARD_LIBRARY_BY_ID[source.id];
    assert.equal(record.categoryId, "occupational-health");
    assert.equal(record.subcategoryId, source.category);
    assert.equal(record.visualization.occupationalHealth, source);
    assert.equal(record.name, source.hazardDisease);
    assert.equal(record.summary, source.definition);
    assert.equal(record.consequences[0], source.mainConsequences);
  }
  assert.deepEqual(HAZARD_REFERENCE_RECORDS.map((record) => record.name.en), ["Arc Flash", "Scaffold Fall", "Forklift Tip-Over", "Oxygen-Deficient Confined Space", "Unexpected Startup / LOTO", "Radiation Exposure"]);
  for (const record of HAZARD_REFERENCE_RECORDS) {
    assert.equal(record.source.status, "study-summary");
    assert.equal(record.visualization.status, "implemented");
    assert.ok(record.visualization.overlays.length >= 4);
    assert.ok(record.source.urls.length);
  }
  assert.throws(() => validateHazardLibrary([HAZARD_LIBRARY_RECORDS[0], HAZARD_LIBRARY_RECORDS[0]]), /Duplicate/);
  assert.throws(() => validateHazardLibrary([{ ...HAZARD_REFERENCE_RECORDS[0], subcategoryId: "unknown" }]), /subcategory/);
  assert.throws(() => validateHazardLibrary([{ ...HAZARD_REFERENCE_RECORDS[0], relatedStandardIds: ["not-in-catalog"] }]), /Unknown standard/);
});

test("configured categories and More selection route records without leaking previous filters", async () => {
  await mount();
  assert.equal(records().length, 18);
  assert.equal(engine(), "body-system");
  assert.equal(container.querySelectorAll("[data-category-id]").length, HAZARD_CATEGORIES.length + 1);
  await chooseCategory("electrical");
  assert.deepEqual(records().map((element) => element.dataset.hazardId), [...Array.from({ length: 10 }, (_, i) => `HL-ELEC-${String(i + 1).padStart(3, "0")}`)]);
  assert.equal(engine(), "worker-scene");
  assert.equal(container.querySelector('[data-category-id="electrical"]').getAttribute("aria-pressed"), "true");
  await chooseCategory("hazardous-energy");
  assert.equal(engine(), "process-diagram");
  assert.equal(button("More").getAttribute("aria-expanded"), "false");
  assert.ok(button("More").classList.contains("is-active"));
  await chooseCategory("chemical-hazmat");
  assert.equal(records().length, 15);
  assert.equal(engine(), "process-diagram");
});

test("subcategory selection preserves Occupational Health engine, reverse filter and table state", async () => {
  await mount();
  await click(button("Biological hazards (19)"));
  assert.equal(records().length, 19);
  assert.equal(engine(), "body-system");
  await click(button("Toxic substances (18)"));
  await click(container.querySelector('[data-system-id="kidneys"]'));
  assert.deepEqual(records().map((element) => element.dataset.hazardId), ["tox-cadmium", "tox-lead"]);
  await click(button("Clear filterمسح التصفية"));
  await click(container.querySelector('[data-hazard-id="tox-benzene"]'));
  await click(button("Source data table"));
  await click(button("Biological hazards (19)"));
  assert.equal(container.querySelectorAll(".hazard-table tbody tr").length, 19);
  assert.equal(container.querySelectorAll(".hazard-table th").length, 7);
  await click(button("Body-system explorer"));
  assert.equal(container.querySelector('[data-hazard-id="tox-benzene"]').getAttribute("aria-pressed"), "true");
  assert.equal(records().length, 18);
});

test("All Hazards includes every record once and routes every implemented engine", async () => {
  await mount();
  await chooseCategory("all");
  assert.equal(records().length, 220);
  assert.equal(new Set(records().map((element) => element.dataset.hazardId)).size, 220);
  for (const reference of HAZARD_REFERENCE_RECORDS.filter(r => r.id !== "ref-radiation-exposure")) {
    await click(container.querySelector(`[data-hazard-id="${canonicalHazardId(reference.id)}"]`));
    assert.equal(engine(), reference.visualization.kind);
    assert.equal(container.querySelector(".hazard-scene").dataset.template, reference.visualization.template);
    assert.equal(container.querySelector(".human-body-svg"), null);
  }
  await click(container.querySelector('[data-hazard-id="tox-asbestos"]'));
  assert.equal(engine(), "body-system");
  assert.equal(container.querySelectorAll("[data-system-id]").length, 17);
});

test("one search matcher covers categories, subcategories, source/body/route fields and new common fields", () => {
  const ids = (query) => filterHazards(HAZARD_LIBRARY_RECORDS, { categoryId: "all", query }).map((record) => record.id);
  assert.ok(ids("Electrical").includes("HL-ELEC-001"));
  assert.ok(ids("Industrial trucks").includes("HL-MAT-004"));
  assert.ok(ids("warehouse").includes("HL-MAT-004"));
  assert.ok(ids("warehouse").some((id) => id.startsWith("HL-MAT-")));
  assert.ok(ids("نقص الاكسجين").includes("HL-CONF-001"));
  assert.ok(ids("bone marrow").includes("tox-benzene"));
  assert.ok(ids("dermal absorption").includes("tox-formaldehyde"));
  assert.ok(ids("1910.147").length >= 12);
  assert.ok(ids("1910.147").includes("HL-LOTO-001"));
  assert.ok(ids("Control of Hazardous Energy").includes("HL-LOTO-001"));
  const fixture = { ...HAZARD_REFERENCE_RECORDS[0], mechanisms: [{ en: "fixture-mechanism", ar: "آلية تجريبية" }], consequences: [{ en: "fixture-consequence", ar: "نتيجة تجريبية" }], highRiskWork: [{ en: "fixture-task", ar: "مهمة تجريبية" }], controls: { ...HAZARD_REFERENCE_RECORDS[0].controls, engineering: [{ en: "fixture-control", ar: "ضابط تجريبي" }] } };
  for (const query of ["fixture-mechanism", "fixture-consequence", "fixture-task", "fixture-control", "ضابط تجريبي", "engineering controls"]) assert.equal(filterHazards([fixture], { query }).length, 1);
});

test("global search extends the same catalog, preserves Arabic and resolves a canonical item ID", async () => {
  const index = buildGlobalSearchIndex({ examName: "ASP", practiceBank: [], chapterPractice: [], attempts: [] });
  assert.equal(index.filter((document) => document.kind === "hazard").length, 220);
  const result = searchGlobalIndex(index, "رافعة شوكية").find((document) => document.id === "hazard:HL-MAT-004");
  assert.ok(result);
  assert.equal(result.target.view, "hazards");
  assert.equal(result.target.libraryTab, undefined);
  await mount({ initialItemId: result.target.itemId, initialSearch: result.target.query });
  assert.equal(engine(), "equipment-scene");
  assert.equal(container.querySelector('[data-hazard-id="HL-MAT-004"]').getAttribute("aria-pressed"), "true");
  assert.equal(container.querySelector('[data-category-id="material-handling"]').getAttribute("aria-pressed"), "true");
});

test("Library search can cross All Hazards and recover from empty filters", async () => {
  await mount();
  await chooseCategory("all");
  await search("warehouse");
  assert.equal(records().length, filterHazards(HAZARD_LIBRARY_RECORDS, { query: "warehouse" }).length);
  assert.ok(records().some((record) => record.dataset.hazardId === "HL-MAT-004"));
  await click(container.querySelector('[data-hazard-id="HL-MAT-004"]'));
  assert.equal(engine(), "equipment-scene");
  await search("no-such-hazard");
  assert.equal(records().length, 0);
  await click(button("Clear search and filterمسح البحث والتصفية"));
  assert.equal(records().length, 220);
});

test("one saved-hazard mechanism preserves old IDs, notes and timestamps across categories", async () => {
  const entry = { id: "hazard:tox-benzene", kind: "hazard", title: "Benzene", subtitle: "Original saved summary", note: "Keep this note", createdAt: 12, updatedAt: 34 };
  await mount({}, normalizeStudySystemState({ ...emptyStudySystemState(), notebook: { [entry.id]: entry } }));
  await click(container.querySelector('[data-hazard-id="tox-benzene"]'));
  assert.ok(button("Remove Benzene from notebook"));
  await chooseCategory("electrical");
  await click(button("Save Arc Flash / Arc Blast to notebook"));
  assert.ok(savedState.notebook["hazard:HL-ELEC-001"]);
  assert.deepEqual(savedState.notebook[entry.id], entry);
  await chooseCategory("occupational-health");
  await click(container.querySelector('[data-hazard-id="tox-benzene"]'));
  assert.ok(button("Remove Benzene from notebook"));
  assert.deepEqual(savedState.notebook[entry.id], entry);
});

test("language switching persists across category engines with Arabic navigation and no English bilingual spans", async () => {
  await mount();
  await click(button("English"));
  assert.equal(container.querySelectorAll('[lang="ar"]').length, 0);
  await chooseCategory("electrical");
  await click(button("العربية"));
  assert.equal(container.querySelectorAll('[lang="en"]').length, 0);
  assert.equal(container.querySelector(".hazard-category-navigation").getAttribute("dir"), "rtl");
  assert.match(container.querySelector(".hazard-scene").textContent, /مشهد العامل/);
  assert.ok(button("حفظ القوس الكهربائي / انفجار القوس في الدفتر"));
  for (const span of container.querySelectorAll('[lang="ar"]')) assert.equal(span.getAttribute("dir"), "rtl");
  await click(button("الصحة المهنية"));
  assert.equal(engine(), "body-system");
  assert.equal(container.querySelectorAll('.body-system-explorer [lang="en"]').length, 0);
  await click(button("Both"));
  assert.ok(container.querySelector('[lang="en"]'));
  assert.ok(container.querySelector('[lang="ar"]'));
});

test("Standards links pass existing IDs and the destination resolves only those catalog records", async () => {
  await mount();
  await chooseCategory("hazardous-energy");
  await click(button("Related OSHA standards"));
  assert.deepEqual(opens[0], ["standards", "Unexpected Startup / Energization", { standardIds: ["1910-147"] }]);
  const destinations = [];
  await act(() => root.render(createElement(StandardsExplorer, { system: savedState, onChange: () => {}, onOpen: (...args) => destinations.push(args), initialQuery: opens[0][1], initialStandardIds: opens[0][2].standardIds })));
  assert.equal(container.querySelectorAll('[aria-label="Standards results"] button').length, 1);
  assert.equal(container.querySelector(".standard-detail h2").textContent, OSHA_STANDARDS.find((standard) => standard.id === "1910-147").title);
  await click(button("HazardsExplore exposures"));
  assert.deepEqual(destinations[0], ["library", "loto", { libraryTab: "hazards" }]);
  await click(button("Show all standards"));
  assert.equal(container.querySelectorAll('[aria-label="Standards results"] button').length, OSHA_STANDARDS.length);
});

test("unmapped Standards links open the catalog without manufacturing standards", async () => {
  await mount();
  await chooseCategory("electrical");
  await click(button("Related OSHA standards"));
  assert.deepEqual(opens[0][2], { standardIds: [] });
  await act(() => root.render(createElement(StandardsExplorer, { system: savedState, onChange: () => {}, onOpen: () => {}, initialQuery: "Arc Flash", initialStandardIds: [] })));
  assert.equal(container.querySelectorAll('[aria-label="Standards results"] button').length, 6);
  assert.match(container.textContent, /No standard IDs are mapped/);
});

test("Practice links resolve existing topic/ID references and never synthesize questions", async () => {
  await mount();
  await chooseCategory("material-handling");
  await click(container.querySelector('[data-hazard-id="HL-MAT-004"]'));
  await click(button("Related Practice"));
  assert.deepEqual(opens[0], ["practice", "Forklift Tip-Over", { practiceTags: HAZARD_LIBRARY_BY_ID["HL-MAT-004"].relatedPracticeTags, practiceQuestionIds: [] }]);
  const related = filterPracticeV2References(PRACTICE_V2_QUESTIONS, opens[0][2]);
  assert.ok(related.length > 0);
  for (const question of related) assert.ok(PRACTICE_V2_QUESTIONS.includes(question));
  const exact = related[0];
  assert.deepEqual(filterPracticeV2References(PRACTICE_V2_QUESTIONS, { practiceQuestionIds: [exact.id] }), [exact]);
  assert.deepEqual(filterPracticeV2References(PRACTICE_V2_QUESTIONS, { practiceTags: ["unmapped-example"] }), []);
  await act(() => root.render(createElement(PracticeV2, { system: savedState, onSystem: () => {}, searchTarget: { view: "practice", query: opens[0][1], ...opens[0][2], requestKey: 1 } })));
  assert.match(container.querySelector('[aria-label="Related hazard practice"]').textContent, /existing questions match/);
  assert.equal(button("Start practice").disabled, false);
  await click(button("Browse all Practice"));
  assert.equal(container.querySelector('[aria-label="Related hazard practice"]'), null);
});

test("category navigation supports focus keys, More disclosure/Escape and RTL direction", async () => {
  await mount();
  const all = button("All Hazards");
  await key(all, "ArrowRight");
  assert.equal(document.activeElement, button("Occupational Health"));
  await key(document.activeElement, "End");
  assert.equal(document.activeElement, button("More"));
  await click(button("More"));
  assert.equal(button("More").getAttribute("aria-expanded"), "true");
  await key(button("Confined Spaces"), "Escape");
  assert.equal(button("More").getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, button("More"));
  await click(button("العربية"));
  await key(button("جميع المخاطر"), "ArrowLeft");
  assert.equal(document.activeElement, button("الصحة المهنية"));
  for (const element of container.querySelectorAll('[data-category-button]')) assert.equal(element.tagName, "BUTTON");
});

test("responsive category navigation contains overflow and keeps More reachable on narrow screens", () => {
  const css = readFileSync(new URL("../app/hazard-library/hazard-library.css", import.meta.url), "utf8");
  assert.match(css, /\.hazard-category-strip\s*\{[^}]*min-width: 0[^}]*overflow-x: auto/);
  assert.match(css, /\.hazard-more-navigation\s*\{[^}]*flex: 0 0 auto/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.hazard-more-panel\s*\{[^}]*max-height: 60dvh[^}]*overflow-y: auto/);
});
