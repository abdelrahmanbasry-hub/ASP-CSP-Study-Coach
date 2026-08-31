import "./helpers/register-tsx.mjs";
import assert from "node:assert/strict";
import { after, afterEach, test } from "node:test";
import { readFileSync } from "node:fs";
import { Window } from "happy-dom";
import { HAZARD_CATEGORIES } from "../app/hazardCategories.ts";
import { HAZARD_LIBRARY_RECORDS, HAZARD_LIBRARY_BY_ID } from "../app/hazardLibraryData.ts";
import { emptyStudySystemState } from "../app/studySystemState.ts";
import { coachRouteHref, normalizeCoachTarget, readCoachRoute } from "../app/coachRoutes.ts";
const { HazardIcon, resolveHazardIconKey, hazardCategoryIcons } = await import("../app/hazard-library/hazardIcons.tsx");
const { hazardCategoryCounts } = await import("../app/hazard-library/HazardCategoryNavigation.tsx");
const { HazardsLibrary } = await import("../app/hazard-library/HazardsLibrary.tsx");
const window = new Window({ url: "http://localhost/hazards" });
const globals = ["window", "document", "HTMLElement", "SVGElement", "Node", "Event", "MouseEvent", "KeyboardEvent"];
const previous = new Map(globals.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
for (const key of globals) Object.defineProperty(globalThis, key, { value: key === "window" ? window : window[key], configurable: true, writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act, createElement, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
let root, container;
async function mount(component = HazardsLibrary, props = {}) {
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
  await act(() => root.render(createElement(component, { system: emptyStudySystemState(), onSystem() {}, onOpen() {}, ...props })));
}
async function click(selector) { const element = container.querySelector(selector); assert.ok(element, selector); await act(() => element.click()); }
async function input(selector, text) {
  const element = container.querySelector(selector); assert.ok(element, selector);
  await act(() => { Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(element, text); element.dispatchEvent(new window.Event("input", { bubbles: true })); });
}
afterEach(async () => { if (root) await act(() => root.unmount()); root = null; container?.remove(); window.history.replaceState(null, "", "/hazards"); });
after(() => { window.happyDOM.abort(); for (const key of globals) { const value = previous.get(key); if (value) Object.defineProperty(globalThis, key, value); else delete globalThis[key]; } delete globalThis.IS_REACT_ACT_ENVIRONMENT; });

test("top-level Hazards is independent of Library in desktop/mobile shared navigation", () => {
  const shell = readFileSync(new URL("../app/AdaptiveCoach.tsx", import.meta.url), "utf8");
  const library = readFileSync(new URL("../app/StudyLibrary.tsx", import.meta.url), "utf8");
  assert.match(shell, /navigate\("hazards"\)/);
  assert.match(shell, /aria-current=\{view === "hazards" \? "page"/);
  assert.match(shell, /view === "hazards" && <main/);
  assert.match(shell, /window.addEventListener\("popstate", restoreRoute\)/);
  assert.match(shell, /lastHazardHref/);
  assert.doesNotMatch(library, /tab === "hazards"|setTab\("hazards"\)/);
  assert.match(library, /Retrieve\. Apply\. Space the review\./);
});

test("legacy URLs and saved prototype IDs deterministically resolve to the dedicated product", () => {
  for (const path of ["/library/hazards?itemId=ref-forklift-tip-over", "/?view=library&tab=hazards&itemId=ref-forklift-tip-over", "/?view=library&libraryTab=hazards&itemId=ref-forklift-tip-over"]) {
    const route = readCoachRoute(new URL(path, "http://localhost"));
    assert.equal(route.view, "hazards"); assert.equal(route.target.itemId, "HL-MAT-004");
    assert.equal(coachRouteHref(route.view, route.target), "/hazards?hazard=HL-MAT-004");
  }
  for (const [old, canonical] of [["ref-arc-flash","HL-ELEC-001"],["ref-scaffold-fall","HL-FALL-007"],["ref-oxygen-deficient-space","HL-CONF-001"],["ref-unexpected-startup","HL-LOTO-001"]]) {
    assert.equal(normalizeCoachTarget({view:"library",libraryTab:"hazards",itemId:old}).itemId,canonical);
  }
  assert.equal(readCoachRoute(new URL("http://localhost/?view=library")).view, "library");
  assert.equal(readCoachRoute(new URL("http://localhost/?view=unknown")).view, "study");
});

test("all category counts come only from the 220 visible canonical records", () => {
  assert.equal(HAZARD_LIBRARY_RECORDS.length, 220);
  assert.deepEqual(HAZARD_CATEGORIES.map(c => hazardCategoryCounts[c.id]), [37,15,10,12,14,14,14,12,11,9,10,8,8,10,8,10,10,8]);
  assert.equal(Object.values(hazardCategoryCounts).reduce((a,b) => a+b,0), 220);
  for (const category of HAZARD_CATEGORIES) assert.ok(hazardCategoryIcons[category.icon]);
});

test("semantic icon families, category fallback and neutral fallback are stable", () => {
  assert.equal(resolveHazardIconKey(HAZARD_LIBRARY_BY_ID["HL-MAT-004"]), "forklift");
  assert.equal(resolveHazardIconKey(HAZARD_LIBRARY_BY_ID["HL-ELEC-001"]), "arc-flash");
  assert.equal(resolveHazardIconKey(HAZARD_LIBRARY_BY_ID["HL-MAT-014"]), "battery");
  assert.equal(resolveHazardIconKey({name:{en:"Unmatched",ar:""},categoryId:"radiation"}), "radiation");
  assert.equal(resolveHazardIconKey({name:{en:"Unmatched",ar:""},categoryId:"missing"}), "neutral");
  assert.equal(resolveHazardIconKey(undefined, "missing"), "neutral");
  assert.equal(resolveHazardIconKey(undefined, "ladder"), "ladder");
  for (const record of HAZARD_LIBRARY_RECORDS) assert.notEqual(resolveHazardIconKey(record), "neutral");
});

test("icons expose accessible names only when meaningful and stand-alone", async () => {
  await mount(HazardIcon, { categoryId: "occupational-health", label: "Occupational Health" });
  assert.equal(container.querySelector("svg").getAttribute("role"), "img");
  assert.equal(container.querySelector("svg").getAttribute("aria-label"), "Occupational Health");
  await act(() => root.render(createElement(HazardIcon, { categoryId: "radiation" })));
  assert.equal(container.querySelector("svg").getAttribute("aria-hidden"), "true");
});

test("optional overview has 18 real category destinations and opens the study workspace", async () => {
  await mount(HazardsLibrary, { syncRoute: true });
  assert.equal(container.querySelectorAll("[data-overview-category]").length, 18);
  assert.equal(container.querySelector(".library-hero"), null);
  await click('[data-overview-category="material-handling"]');
  assert.equal(container.querySelectorAll("[data-hazard-id]").length, 14);
  assert.equal(container.querySelector(".hazard-overview"), null);
  assert.match(window.location.search, /category=material-handling/);
});

test("global search crosses categories while local search preserves the selected category", async () => {
  await mount(HazardsLibrary, { initialItemId: "HL-MAT-004" });
  await input('[aria-label="Search hazards"]', "arc flash");
  assert.ok(container.querySelector('[data-hazard-id="HL-ELEC-001"]'));
  assert.equal(container.querySelector('[data-category-id="all"]').getAttribute("aria-pressed"), "true");
  await click('[data-category-id="material-handling"]');
  await input('[aria-label="Search this category"]', "forklift");
  assert.ok(container.querySelectorAll("[data-hazard-id]").length > 0);
  assert.ok([...container.querySelectorAll("[data-hazard-id]")].every(row => row.dataset.hazardId.startsWith("HL-MAT-")));
});

test("explorer keyboard selection and saved indicators use the same notebook state", async () => {
  function Harness() {
    const [system, setSystem] = useState(emptyStudySystemState());
    return createElement(HazardsLibrary, { initialItemId: "HL-MAT-004", system, onSystem: setSystem, onOpen() {} });
  }
  await mount(Harness);
  await click('.hazard-bookmark-heading button');
  assert.ok(container.querySelector('[data-hazard-id="HL-MAT-004"] .hazard-saved-indicator'));
  await click('.hazard-toolbar-button:nth-child(2)');
  assert.equal(container.querySelectorAll("[data-hazard-id]").length, 1);
  assert.equal(container.querySelector("[data-hazard-id]").dataset.hazardId, "HL-MAT-004");
});

test("explorer supports Arrow/Home/End without trapping document modifier shortcuts", async () => {
  await mount(HazardsLibrary, {initialItemId:"HL-MAT-004"});
  const first = container.querySelector("[data-hazard-id]");
  await act(() => { first.focus(); first.dispatchEvent(new window.KeyboardEvent("keydown", {key:"End",bubbles:true,cancelable:true})); });
  const rows = [...container.querySelectorAll("[data-hazard-id]")];
  assert.equal(document.activeElement, rows.at(-1));
  await act(() => rows.at(-1).dispatchEvent(new window.KeyboardEvent("keydown", {key:"Home",bubbles:true,cancelable:true})));
  assert.equal(document.activeElement, first);
});

test("editorial learning hierarchy and five control disclosures preserve exact content", async () => {
  await mount(HazardsLibrary, {initialItemId:"HL-MAT-004"});
  const panel = container.querySelector(".hazard-detail-card");
  assert.deepEqual([...panel.querySelectorAll(":scope > dl > div > dt [lang=en]")].map(x=>x.textContent), ["What is it?","How does it happen?","What can happen?","Where is the risk?"]);
  assert.deepEqual([...panel.querySelectorAll("[data-control-level]")].map(x=>x.dataset.controlLevel), ["elimination","substitution","engineering","administrative","ppe"]);
  const record = HAZARD_LIBRARY_BY_ID["HL-MAT-004"];
  for (const values of Object.values(record.controls)) for (const value of values) { assert.ok(panel.textContent.includes(value.en)); assert.ok(panel.textContent.includes(value.ar)); }
  assert.ok(panel.querySelector(".hazard-crosslinks").compareDocumentPosition(panel.querySelector(".hazard-source-metadata")) & Node.DOCUMENT_POSITION_FOLLOWING);
});

test("deep links retain category, language, selection and canonical URL state", async () => {
  window.history.replaceState(null,"","/hazards?category=material-handling&subcategory=&hazard=HL-MAT-004&lang=ar");
  const languages = [];
  await mount(HazardsLibrary, {syncRoute:true,initialItemId:"HL-MAT-004",onLanguageChange:language=>languages.push(language)});
  assert.equal(container.querySelector(".hazard-premium").getAttribute("dir"),"rtl");
  assert.equal(container.querySelectorAll("[data-hazard-id]").length,14);
  assert.match(container.querySelector(".hazard-rail-heading small").textContent,/14/);
  assert.equal(container.querySelector(".hazard-record-list .active").dataset.hazardId,"HL-MAT-004");
  assert.equal(container.querySelector(".scene-stage").getAttribute("dir"),"ltr");
  assert.equal(languages.at(-1),"ar");
  assert.equal(container.querySelector(".hazard-premium [lang=en]"),null);
});

test("mobile selector exposes every filtered hazard with a native labelled control", async () => {
  await mount(HazardsLibrary, {initialItemId:"HL-MAT-004"});
  const select = container.querySelector(".hazard-mobile-selector select");
  assert.ok(select.closest("label"));
  const value = select.options[0].value;
  await act(() => { select.value=value; select.dispatchEvent(new window.Event("change",{bubbles:true})); });
  assert.equal(container.querySelector(".hazard-record-list .active").dataset.hazardId,value);
});
