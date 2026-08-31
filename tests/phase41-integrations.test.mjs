import "./helpers/register-tsx.mjs";
import assert from "node:assert/strict";
import { after, afterEach, test } from "node:test";
import { readFileSync } from "node:fs";
import { Window } from "happy-dom";
import { canonicalHazardId, hazardCompatibilityIds, hazardNotebookKeys, HAZARD_ID_ALIASES } from "../app/hazardAliases.ts";
import { HAZARD_LIBRARY_RECORDS, HAZARD_LIBRARY_BY_ID, HAZARD_REFERENCE_RECORDS, UNIQUE_HAZARD_REFERENCE_RECORDS } from "../app/hazardLibraryData.ts";
import { FINAL_HAZARD_RECORDS } from "../app/finalHazardData.ts";
import { PHASE4_HAZARD_RECORDS } from "../app/phase4HazardData.ts";
import { normalizeStandardNumber, resolveHazardStandards, buildMissingStandardsReport } from "../app/hazardStandardReferences.ts";
import { OSHA_STANDARDS } from "../app/standardsData.ts";
import { filterHazards } from "../app/hazardExplorer.ts";
import { emptyStudySystemState, normalizeStudySystemState } from "../app/studySystemState.ts";
import { PRACTICE_TAG_ALIASES, matchesPracticeTagAlias } from "../app/practiceTagAliases.ts";
import { filterPracticeV2References } from "../app/practiceV2.ts";
const { buildGlobalSearchIndex, searchGlobalIndex } = await import("../app/globalSearch.ts");
const { PRACTICE_V2_QUESTIONS } = await import("../app/practiceV2Catalog.ts");
const pairs = Object.entries(HAZARD_ID_ALIASES);
const fixture = (id, citation) => ({ ...OSHA_STANDARDS[0], id, citation });
const ref = number => ({ number, scope: "general-industry", relation: "related" });

test("visible final catalog has 220 unique records: 183 controlled, 37 OH and no prototype duplicates", () => {
  assert.equal(HAZARD_LIBRARY_RECORDS.length, 220); assert.equal(new Set(HAZARD_LIBRARY_RECORDS.map(r => r.id)).size, 220);
  assert.equal(HAZARD_LIBRARY_RECORDS.filter(r => r.source.kind === "controlled-dataset").length, 183);
  assert.equal(HAZARD_LIBRARY_RECORDS.filter(r => r.categoryId === "occupational-health").length, 37);
  assert.deepEqual(UNIQUE_HAZARD_REFERENCE_RECORDS.map(r => r.id), []);
  for (const [legacy, canonical] of pairs) {
    assert.equal(HAZARD_LIBRARY_RECORDS.filter(r => r.id === canonical).length, 1);
    assert.equal(HAZARD_LIBRARY_RECORDS.some(r => r.id === legacy), false);
    const old = HAZARD_REFERENCE_RECORDS.find(r => r.id === legacy), current = HAZARD_LIBRARY_BY_ID[canonical];
    assert.equal(HAZARD_LIBRARY_RECORDS.filter(r => r.name.en === old.name.en).length, old.name.en === current.name.en ? 1 : 0);
  }
  assert.deepEqual(["electrical", "falls-height", "machinery-tools", "material-handling"].map(categoryId => filterHazards(HAZARD_LIBRARY_RECORDS, { categoryId }).length), [10, 14, 14, 14]);
});

test("exact aliases preserve controlled IDs, content and approved Phase 3 scene objects without duplicate objects in lookup", () => {
  for (const [legacy, canonical] of pairs) {
    const record = HAZARD_LIBRARY_BY_ID[canonical], original = HAZARD_REFERENCE_RECORDS.find(r => r.id === legacy), source = [...PHASE4_HAZARD_RECORDS, ...FINAL_HAZARD_RECORDS].find(r => r.id === canonical);
    assert.equal(canonicalHazardId(legacy), canonical); assert.equal(canonicalHazardId(canonical), canonical);
    assert.equal(HAZARD_LIBRARY_BY_ID[legacy], record); assert.equal(record.visualization, original.visualization);
    for (const key of Object.keys(source).filter(key => key !== "visualization")) assert.deepEqual(record[key], source[key], key);
    assert.deepEqual(hazardCompatibilityIds(legacy), [canonical, legacy]);
    assert.deepEqual(hazardNotebookKeys(legacy), [`hazard:${canonical}`, `hazard:${legacy}`]);
  }
  assert.equal(canonicalHazardId("ref-arc-flash-unknown"), "ref-arc-flash-unknown");
  assert.equal(canonicalHazardId("REF-ARC-FLASH"), "REF-ARC-FLASH");
});

test("Library and global search return canonical destinations for old IDs and hazard names", () => {
  const index = buildGlobalSearchIndex({ examName: "ASP", practiceBank: [], chapterPractice: [], attempts: [] });
  assert.equal(index.filter(d => d.kind === "hazard").length, 220);
  for (const [legacy, canonical] of pairs) {
    assert.equal(index.some(d => d.id === `hazard:${legacy}`), false);
    assert.deepEqual(filterHazards(HAZARD_LIBRARY_RECORDS, { query: legacy }).map(r => r.id), [canonical]);
    for (const query of [legacy, canonical, HAZARD_LIBRARY_BY_ID[canonical].name.en, HAZARD_LIBRARY_BY_ID[canonical].name.ar]) {
      const result = searchGlobalIndex(index, query).find(d => d.id === `hazard:${canonical}`);
      assert.ok(result, query); assert.equal(result.target.itemId, canonical);
    }
  }
});

test("strict standard grammar normalizes dot/dash/CFR/section/subpart formatting", () => {
  for (const value of ["1910.178", "1910-178", " 1910 - 178 ", "29 CFR 1910.178", "29 C.F.R. § 1910.178", "OSHA 29 CFR 1910.178", "29 CFR Section 1910.178"]) assert.equal(normalizeStandardNumber(value), "1910.178", value);
  for (const value of ["1926 Subpart CC", "29 CFR Part 1926 Subpart cc", "1926-Subpart-CC"]) assert.equal(normalizeStandardNumber(value), "1926 Subpart CC");
  assert.equal(normalizeStandardNumber("1910.178 (l) (1)"), "1910.178(l)(1)");
  assert.notEqual(normalizeStandardNumber("1910.178(a)(i)"), normalizeStandardNumber("1910.178(a)(I)"));
});

test("exact standards resolution uses genuine IDs even when the registry ID is opaque", () => {
  const catalog = [fixture("osha-pit-vetted", "29 CFR 1910.178"), fixture("registry-cranes", "29 CFR Part 1926 Subpart CC")];
  const resolved = resolveHazardStandards([ref("1910-178"), ref("1926-Subpart-CC")], catalog);
  assert.deepEqual(resolved.map(r => r.standardId), ["osha-pit-vetted", "registry-cranes"]);
  assert.ok(resolved.every(r => r.matchMethod === "exact"));
  assert.equal(resolved[0].number, "1910-178"); assert.equal(resolved[0].scope, "general-industry"); assert.equal(resolved[0].relation, "related");
  assert.equal(resolveHazardStandards([ref("1910.178")], [fixture("1910-178", "Powered industrial trucks")])[0].standardId, "1910-178");
});

test("paragraph references use the most specific genuine ancestor, not numeric prefixes or unverified subparts", () => {
  const catalog = [fixture("section", "1910.178"), fixture("paragraph", "1910.178(l)"), fixture("crane-subpart", "1926 Subpart CC")];
  const result = resolveHazardStandards([ref("1910.178(l)(1)"), ref("1910.178(m)"), ref("1910.17"), ref("1910.1780"), ref("1926.1400")], catalog);
  assert.equal(result[0].standardId, "paragraph"); assert.equal(result[0].matchMethod, "parent-section");
  assert.equal(result[1].standardId, "section");
  assert.ok(result.slice(2).every(r => r.resolution === "unresolved" && !r.standardId));
});

test("standard normalization rejects wrong title/part, ranges, appended text and ambiguous registry matches", () => {
  const catalog = [fixture("pit", "1910.178")];
  for (const number of ["40 CFR 1910.178", "1910.178 / 1926.602", "1910.178-1910.179", "1910.178 PEL", "1910178", "1926.178", "1910.17", "1910.1780", "1910", "Powered industrial trucks"]) {
    const result = resolveHazardStandards([ref(number)], catalog)[0]; assert.equal(result.resolution, "unresolved", number); assert.equal("standardId" in result, false);
  }
  assert.equal(resolveHazardStandards([ref("1910.178")], [fixture("1910-178", "29 CFR 1926.602")])[0].resolution, "unresolved");
  assert.equal(resolveHazardStandards([ref("1910.178")], [fixture("1910-178", "40 CFR 1910.178")])[0].resolution, "unresolved");
  const ambiguous = resolveHazardStandards([ref("1910.178")], [fixture("a", "1910.178"), fixture("b", "1910-178")])[0];
  assert.equal(ambiguous.reason, "ambiguous-catalog-match"); assert.equal("standardId" in ambiguous, false);
});

test("missing-standard report retains every supplied reference and deterministically reports actual catalog gaps", () => {
  const report = buildMissingStandardsReport(PHASE4_HAZARD_RECORDS);
  assert.deepEqual(report.summary, { totalOccurrences: 110, resolvedOccurrences: 2, missingOccurrences: 108, missingUniqueReferences: 38 });
  assert.equal(report.catalog.length, 6); assert.ok(report.missing.every(r => r.reason === "not-in-catalog"));
  assert.equal(report.missing.flatMap(r => r.occurrences).length, 108);
  const known = new Set(OSHA_STANDARDS.map(s => s.id)); assert.ok(report.resolved.every(r => known.has(r.standardId)));
  assert.ok(report.missing.every(group => group.occurrences.every(r => !r.standardId && r.scope && r.relation && r.hazardId)));
  assert.deepEqual(JSON.parse(readFileSync(new URL("../reports/phase4.1/missing-standards.json", import.meta.url), "utf8")), report);
  const addedCatalogFixture = [...OSHA_STANDARDS, fixture("vetted-pit", "29 CFR 1910.178")];
  const future = buildMissingStandardsReport(PHASE4_HAZARD_RECORDS, addedCatalogFixture);
  assert.ok(future.summary.resolvedOccurrences > 2); assert.equal(future.missing.some(r => r.normalizedNumber === "1910.178"), false);
});

test("Practice aliases require exact phrases with evidence; five unrelated or absent topics remain unmatched", () => {
  assert.equal(matchesPracticeTagAlias("a severe pinch point.", "pinch-point"), true);
  assert.equal(matchesPracticeTagAlias("a portable tool develops leakage", "portable-tool"), true);
  for (const [text, tag] of [["a pinching point", "pinch-point"], ["pinch elsewhere at a different point", "pinch-point"], ["portable tooling", "portable-tool"], ["machine guarding", "machinery"], ["cutting point", "cutting-point"], ["circular duct", "circular-saw"]]) assert.equal(matchesPracticeTagAlias(text, tag), false);
  for (const alias of Object.values(PRACTICE_TAG_ALIASES)) for (const id of alias.evidenceQuestionIds) {
    const q = PRACTICE_V2_QUESTIONS.find(q => q.id === id); assert.ok(q); assert.ok(`${q.concept} ${q.chapterTitle} ${q.stem}`.toLowerCase().includes(alias.phrase));
  }
  const unmatched = PHASE4_HAZARD_RECORDS.filter(r => !filterPracticeV2References(PRACTICE_V2_QUESTIONS, { practiceTags: r.relatedPracticeTags }).length);
  assert.deepEqual(unmatched.map(r => r.id), ["HL-MACH-004", "HL-MACH-006", "HL-MACH-007", "HL-MACH-009", "HL-MACH-010"]);
  const sourceOnly = { ...PRACTICE_V2_QUESTIONS[0], concept: "unrelated", chapterTitle: "unrelated", stem: "unrelated", sourceLocation: "portable tool" };
  assert.deepEqual(filterPracticeV2References([sourceOnly], { practiceTags: ["portable-tool"] }), []);
});

const window = new Window({ url: "http://localhost/" });
const globals = ["window", "document", "HTMLElement", "SVGElement", "Node", "Event", "MouseEvent", "KeyboardEvent"];
const previous = new Map(globals.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
for (const key of globals) Object.defineProperty(globalThis, key, { value: key === "window" ? window : window[key], configurable: true, writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act, createElement, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { HazardsLibrary } = await import("../app/hazard-library/HazardsLibrary.tsx");
const { BookmarkAction } = await import("../app/StudySystem.tsx");
let root, container, savedState, opens;
async function mount(props, initial = emptyStudySystemState()) {
  savedState = initial; opens = [];
  function Harness() {
    const [system, setSystem] = useState(initial);
    return createElement(HazardsLibrary, { ...props, system, onSystem: next => { savedState = next; setSystem(next); }, onOpen: (...args) => opens.push(args) });
  }
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
  await act(() => root.render(createElement(Harness)));
}
const click = async selector => { const el = container.querySelector(selector); assert.ok(el, selector); await act(() => el.click()); };
const entry = id => ({ id: `hazard:${id}`, kind: "hazard", title: id, subtitle: "Original summary", note: `Original note for ${id}`, createdAt: 12, updatedAt: 34 });
afterEach(async () => { if (root) await act(() => root.unmount()); root = null; container?.remove(); });
after(() => { window.happyDOM.abort(); for (const key of globals) { const old = previous.get(key); if (old) Object.defineProperty(globalThis, key, old); else delete globalThis[key]; } delete globalThis.IS_REACT_ACT_ENVIRONMENT; });

for (const [legacy, canonical] of pairs) test(`${legacy} opens ${canonical}, retains the saved legacy note and reuses approved interactive callouts`, async () => {
  const old = entry(legacy), initial = normalizeStudySystemState({ ...emptyStudySystemState(), notebook: { [old.id]: old } });
  await mount({ initialItemId: legacy }, initial);
  assert.equal(container.querySelector('[data-hazard-id][aria-pressed="true"]').dataset.hazardId, canonical);
  assert.equal(container.querySelector(`[data-hazard-id="${legacy}"]`), null);
  assert.match(container.querySelector(".bookmark-action").getAttribute("aria-label"), /^Remove /);
  const scene = HAZARD_REFERENCE_RECORDS.find(r => r.id === legacy).visualization;
  assert.equal(container.querySelector(".hazard-scene").dataset.template, scene.template);
  await click(`[data-callout-id="${scene.overlays[0].id}"]`);
  assert.ok(container.querySelector(".scene-selected-detail").textContent.includes(scene.overlays[0].description.en));
  assert.deepEqual(savedState.notebook, initial.notebook);
  await click('[aria-label="Related Practice"]'); assert.deepEqual(opens[0][2].practiceTags, HAZARD_LIBRARY_BY_ID[canonical].relatedPracticeTags);
  await click('[aria-label="Related OSHA standards"]'); assert.deepEqual(opens[1][2].standardIds, HAZARD_LIBRARY_BY_ID[canonical].relatedStandardIds);
  // Explicit Unsave retires both compatibility keys; saving again creates only HL-*.
  await click(".bookmark-action"); assert.deepEqual(savedState.notebook[old.id], old);
  await click(".bookmark-confirm button"); assert.equal(savedState.notebook[old.id], undefined);
  await click(".bookmark-action"); assert.ok(savedState.notebook[`hazard:${canonical}`]); assert.equal(savedState.notebook[old.id], undefined);
});

test("both legacy and canonical notebook entries remain lossless until explicit unsave, including a serialized reload", async () => {
  const legacy = entry("ref-arc-flash"), canonical = { ...entry("HL-ELEC-001"), createdAt: 50, updatedAt: 90 }, unrelated = entry("tox-benzene");
  const initial = normalizeStudySystemState(JSON.parse(JSON.stringify({ ...emptyStudySystemState(), notebook: { [legacy.id]: legacy, [canonical.id]: canonical, [unrelated.id]: unrelated } })));
  await mount({ initialItemId: "HL-ELEC-001" }, initial);
  assert.deepEqual(savedState.notebook[legacy.id], legacy); assert.deepEqual(savedState.notebook[canonical.id], canonical);
  await click('[data-subcategory-id="all"]');
  await click('[data-hazard-id="HL-ELEC-002"]'); await click(".bookmark-action");
  assert.deepEqual(savedState.notebook[legacy.id], legacy); assert.deepEqual(savedState.notebook[canonical.id], canonical);
  await click('[data-hazard-id="HL-ELEC-001"]'); await click(".bookmark-action");
  assert.deepEqual(savedState.notebook[legacy.id], legacy);
  await click(".bookmark-confirm button");
  assert.equal(savedState.notebook[legacy.id], undefined); assert.equal(savedState.notebook[canonical.id], undefined);
  assert.deepEqual(savedState.notebook[unrelated.id], unrelated);
});

test("a stale bookmark caller with ref ID creates a canonical save", async () => {
  await mount({ initialItemId: "HL-ELEC-001" });
  await act(() => root.render(createElement(BookmarkAction, { kind: "hazard", itemId: "ref-arc-flash", title: "Arc Flash", system: emptyStudySystemState(), onChange: next => { savedState = next; } })));
  await click(".bookmark-action"); assert.ok(savedState.notebook["hazard:HL-ELEC-001"]); assert.equal(savedState.notebook["hazard:ref-arc-flash"], undefined);
});

test("old-ID search entry routes to a single canonical visible record", async () => {
  await mount({ initialSearch: "ref-forklift-tip-over" });
  const records = container.querySelectorAll("[data-hazard-id]"); assert.equal(records.length, 1); assert.equal(records[0].dataset.hazardId, "HL-MAT-004");
  assert.equal(container.querySelector(".hazard-scene").dataset.template, "forklift-warehouse");
});
