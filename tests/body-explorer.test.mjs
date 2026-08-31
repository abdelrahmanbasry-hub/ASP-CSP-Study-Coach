import "./helpers/register-tsx.mjs";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { after, afterEach, test } from "node:test";
import { Window } from "happy-dom";
import { HAZARD_RECORDS, HAZARD_COUNTS } from "../app/hazardData.ts";
import { BODY_SYSTEMS, EXPOSURE_ROUTES } from "../app/bodySystems.ts";
import { filterHazards } from "../app/hazardExplorer.ts";
import { migrateHazardRecord } from "../app/hazardMigration.ts";

const window = new Window({ url: "http://localhost/" });
const globals = ["window", "document", "HTMLElement", "SVGElement", "Node", "Event", "MouseEvent", "KeyboardEvent"];
const previous = new Map(globals.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
for (const key of globals) Object.defineProperty(globalThis, key, { value: key === "window" ? window : window[key], configurable: true, writable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act, createElement, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { HazardsLibrary } = await import("../app/StudyLibrary.tsx");
const { emptyStudySystemState } = await import("../app/studySystemState.ts");
let root;
let container;
let savedState;
let opens;

async function mount(initial = emptyStudySystemState()) {
  savedState = initial;
  opens = [];
  function Harness() {
    const [system, setSystem] = useState(initial);
    return createElement(HazardsLibrary, { system, onSystem: (next) => { savedState = next; setSystem(next); }, onOpen: (...args) => opens.push(args) });
  }
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root.render(createElement(Harness)));
}
const visible = (element) => !element.closest("[hidden]");
const buttons = () => [...container.querySelectorAll("button")].filter(visible);
const button = (label) => {
  const found = buttons().find((element) => element.textContent.trim() === label || element.getAttribute("aria-label") === label);
  assert.ok(found, `Missing button: ${label}`);
  return found;
};
const click = async (element) => { await act(() => element.dispatchEvent(new window.MouseEvent("click", { bubbles: true }))); };
const key = async (element, value) => { await act(() => { element.focus(); element.dispatchEvent(new window.KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true })); }); };
const explorer = () => container.querySelector(".body-system-explorer");
const region = (id) => explorer().querySelector(`[data-system-id="${id}"]`);
const roleIds = (role) => [...explorer().querySelectorAll(`[data-target-role="${role}"]`)].map((element) => element.dataset.systemId).sort();
const rail = () => [...container.querySelectorAll(".hazard-record-list [data-hazard-id]")];
const choose = async (name) => { const item = rail().find((element) => element.querySelector('[lang="en"]')?.textContent === name); assert.ok(item, `Missing record: ${name}`); await click(item); };
const changeSearch = async (text) => {
  const input = container.querySelector('[aria-label="Search this category"]');
  await act(() => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(input, text);
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
  });
};
afterEach(async () => { if (root) await act(() => root.unmount()); root = null; container?.remove(); });
after(() => {
  window.happyDOM.abort();
  for (const key of globals) { const descriptor = previous.get(key); if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  delete globalThis.IS_REACT_ACT_ENVIRONMENT;
});

test("migrates all 37 rows with stable IDs and complete typed targets/routes", () => {
  assert.deepEqual(HAZARD_COUNTS, { total: 37, biological: 19, toxicological: 18 });
  const allowed = new Set(BODY_SYSTEMS.map((system) => system.id));
  assert.equal(allowed.size, 17);
  assert.equal(new Set(HAZARD_RECORDS.map((record) => record.id)).size, 37);
  for (const record of HAZARD_RECORDS) {
    assert.ok(record.targets.length);
    assert.equal(new Set(record.targets.map((target) => target.systemId)).size, record.targets.length);
    for (const target of record.targets) {
      assert.ok(allowed.has(target.systemId));
      assert.ok(["primary", "secondary"].includes(target.role));
      for (const language of ["en", "ar"]) assert.ok(record.mainConsequences[language].includes(target.effects[language]), `Invented effect: ${record.id}`);
    }
    for (const route of record.exposureRoutes) assert.ok(route in EXPOSURE_ROUTES);
  }
});

test("preserves every original bilingual field, row, category and hazard ID", () => {
  const originalKeys = ["id", "category", "sourceRow", "hazardDisease", "type", "definition", "targetOrganSystem", "mainConsequences", "exposureTransmission", "highRiskOccupationsWorkplace", "sourceNote"];
  const original = HAZARD_RECORDS.map((record) => Object.fromEntries(originalKeys.map((key) => [key, record[key]])));
  // SHA-256 of the original pre-migration records, not of generated target metadata.
  assert.equal(createHash("sha256").update(JSON.stringify(original)).digest("hex"), "781810f2c6368333f6c64506a0b4f113c5fdcec3abe21f9d72a3f2d7c27dd8db");
});

test("keeps ambiguous routes for review without inventing absorption or blood targets", () => {
  assert.equal(HAZARD_RECORDS.filter((record) => record.mappingReview.length).length, 11);
  const hepatitis = HAZARD_RECORDS.find((record) => record.id === "bio-hepatitis-b");
  assert.deepEqual(hepatitis.exposureRoutes, []);
  assert.deepEqual(hepatitis.targets.map((target) => target.systemId), ["liver"]);
  assert.deepEqual(HAZARD_RECORDS.find((record) => record.id === "tox-cobalt").exposureRoutes, ["inhalation"]);
  const unknown = migrateHazardRecord({ ...hepatitis, targetOrganSystem: { en: "Unmapped source term", ar: "مصطلح غير محدد" } });
  assert.deepEqual(unknown.targets, []);
  assert.ok(unknown.mappingReview.some((review) => review.field === "targets"));
});

test("normalizes all four supported route types without treating contact as absorption", () => {
  const routes = (id) => HAZARD_RECORDS.find((record) => record.id === id).exposureRoutes;
  assert.deepEqual(routes("bio-anthrax"), ["inhalation", "ingestion"]);
  assert.deepEqual(routes("bio-hepatitis-a"), ["ingestion"]);
  assert.deepEqual(routes("bio-tetanus"), ["percutaneous"]);
  assert.deepEqual(routes("tox-formaldehyde"), ["inhalation", "dermal-absorption"]);
  assert.deepEqual(routes("tox-organophosphate-carbamate-pesticides"), ["inhalation", "dermal-absorption"]);
  assert.deepEqual(routes("bio-orf"), []);
});

test("selecting Asbestos and Benzene changes one reusable SVG to different configured targets", async () => {
  await mount();
  const svg = explorer().querySelector(".human-body-svg");
  assert.deepEqual(roleIds("primary"), ["lungs"]);
  await choose("Benzene");
  assert.equal(explorer().querySelector(".human-body-svg"), svg);
  assert.deepEqual(roleIds("primary"), ["blood", "bone-marrow"]);
  assert.deepEqual(roleIds("secondary"), []);
  assert.equal(region("lungs").dataset.targetRole, "inactive");
});

test("primary and secondary systems expose different roles, callouts and non-color labels", async () => {
  await mount();
  await choose("Cadmium");
  assert.deepEqual(roleIds("primary"), ["kidneys", "musculoskeletal"]);
  assert.deepEqual(roleIds("secondary"), ["respiratory"]);
  assert.match(region("respiratory").getAttribute("aria-label"), /Secondary target/);
  assert.equal(explorer().querySelectorAll(".body-callout.is-secondary").length, 1);
  assert.match(explorer().querySelector(".body-explorer-legend").textContent, /Not listed in this record/);
});

test("reference-style callouts follow anatomy order and use matching region anchors and accents", async () => {
  await mount();
  await choose("Benzene");
  const callouts = [...explorer().querySelectorAll("[data-callout-system]")];
  assert.deepEqual(callouts.map((element) => element.dataset.calloutSystem), ["bone-marrow", "blood"]);
  for (const callout of callouts) {
    const id = callout.dataset.calloutSystem;
    assert.ok(explorer().querySelector(`[data-region-anchor="${id}"]`));
    assert.equal(callout.style.getPropertyValue("--callout-color"), region(id).style.getPropertyValue("--region-accent"));
    await key(callout, "Tab");
    assert.ok(region(id).classList.contains("is-hovered"));
  }
  assert.ok(explorer().querySelector('[role="tabpanel"]').compareDocumentPosition(explorer().querySelector('[role="tablist"]')) & window.Node.DOCUMENT_POSITION_FOLLOWING);
});

test("clicking kidneys filters hazards and clearing restores the category", async () => {
  await mount();
  await click(region("kidneys"));
  assert.deepEqual(rail().map((element) => element.querySelector('[lang="en"]').textContent), ["Cadmium", "Lead"]);
  assert.equal(region("kidneys").getAttribute("aria-pressed"), "true");
  await click(button("Clear filterمسح التصفية"));
  assert.equal(rail().length, 18);
  assert.equal(explorer().querySelector(".body-filter-banner"), null);
});

test("an unlisted system has an empty state and a working reset", async () => {
  await mount();
  await click(region("ears"));
  assert.equal(rail().length, 0);
  assert.match(container.textContent, /No matching record/);
  await click(button("Clear filterمسح التصفية"));
  assert.equal(rail().length, 18);
});

test("all 17 SVG regions are keyboard buttons; Enter and Space toggle the filter", async () => {
  await mount();
  const regions = explorer().querySelectorAll("[data-system-id]");
  assert.equal(regions.length, 17);
  for (const element of regions) { assert.equal(element.getAttribute("tabindex"), "0"); assert.equal(element.getAttribute("role"), "button"); assert.ok(element.getAttribute("aria-label")); }
  await key(region("lungs"), "Enter");
  assert.equal(region("lungs").getAttribute("aria-pressed"), "true");
  assert.ok(rail().length > 0 && rail().length < 18);
  await key(region("lungs"), " ");
  assert.equal(rail().length, 18);
  assert.equal(region("lungs").getAttribute("aria-pressed"), "false");
});

test("mode tabs show routes and effects and support arrow-key focus navigation", async () => {
  await mount();
  await choose("Benzene");
  const tabs = explorer().querySelectorAll('[role="tab"]');
  await key(tabs[0], "ArrowRight");
  assert.equal(tabs[1].getAttribute("aria-selected"), "true");
  assert.equal(document.activeElement, tabs[1]);
  assert.deepEqual([...explorer().querySelectorAll("[data-exposure-route]")].map((element) => element.dataset.exposureRoute), ["inhalation"]);
  await click(tabs[2]);
  assert.match(explorer().querySelector(".health-effects-view").textContent, /Bone-marrow suppression and leukemia/);
  assert.match(explorer().querySelector(".health-effects-view").textContent, /does not assign each effect/);
  await key(tabs[2], "Home");
  assert.equal(tabs[0].getAttribute("aria-selected"), "true");
  assert.ok(explorer().querySelector(".body-system-callouts"));
});

test("systems and effects retain distributed blood and marrow targets without exposure paths", async () => {
  await mount();
  await choose("Benzene");
  const tabs = explorer().querySelectorAll('[role="tab"]');
  const bloodSites = [...region("blood").querySelectorAll(".blood-site")];
  assert.ok(bloodSites.length > 4, "Blood should span multiple bilateral regions");
  assert.deepEqual([...region("bone-marrow").querySelectorAll("[data-marrow-site]")].map((site) => site.dataset.marrowSite),
    ["sternum", "pelvis", "left-proximal-femur", "right-proximal-femur"]);
  assert.equal(explorer().querySelector(".blood-vessels"), null);
  for (const tab of [tabs[0], tabs[2]]) {
    await click(tab);
    assert.deepEqual(roleIds("primary"), ["blood", "bone-marrow"]);
    assert.equal(explorer().querySelectorAll("[data-exposure-route]").length, 0);
    assert.equal(explorer().querySelectorAll("[data-region-anchor]").length, 2);
    assert.equal(explorer().querySelectorAll("[data-callout-system]").length, 2);
    assert.equal(region("blood").querySelector(".blood-site"), bloodSites[0]);
  }
  await click(tabs[1]);
  assert.equal(explorer().querySelectorAll("[data-callout-system]").length, 0);
  assert.equal(explorer().querySelectorAll("[data-region-anchor]").length, 0);
  assert.ok(explorer().querySelector('[data-exposure-route="inhalation"] path[marker-end]'));
});

test("effects link individual targets while keeping shared source claims grouped", async () => {
  await mount();
  await choose("Cadmium");
  await click(explorer().querySelectorAll('[role="tab"]')[2]);
  const record = HAZARD_RECORDS.find((entry) => entry.id === "tox-cadmium");
  const respiratory = explorer().querySelector('[data-callout-system="respiratory"]');
  assert.equal(respiratory.closest(".body-effect-card").querySelector('.body-effect-text [lang="en"]').textContent,
    record.targets.find((target) => target.systemId === "respiratory").effects.en);
  assert.equal(explorer().querySelector('.body-effect-summary p [lang="en"]').textContent, record.mainConsequences.en);
  for (const id of ["kidneys", "musculoskeletal"]) {
    const card = explorer().querySelector(`[data-callout-system="${id}"]`).closest(".body-effect-card");
    assert.ok(card.querySelector(".body-effect-shared-link"));
    assert.equal(card.querySelector(".body-effect-text"), null, "Do not assign the row's effects to individual organs");
  }
  await key(respiratory, "Tab");
  assert.ok(region("respiratory").classList.contains("is-hovered"));
  await click(respiratory);
  assert.equal(region("respiratory").getAttribute("aria-pressed"), "true");
  assert.ok(explorer().querySelector(".body-target-pin.is-selected .body-pin-focus"));
  await click(button("Clear filterمسح التصفية"));
  assert.equal(explorer().querySelector(".body-target-pin.is-selected"), null);
});

test("route mode draws the source's ingestion, dermal and percutaneous arrows", async () => {
  await mount();
  await choose("Formaldehyde");
  await click(explorer().querySelectorAll('[role="tab"]')[1]);
  assert.deepEqual([...explorer().querySelectorAll("[data-exposure-route]")].map((element) => element.dataset.exposureRoute), ["inhalation", "dermal-absorption"]);
  await click(button("Biological hazards (19)"));
  await choose("Hepatitis A");
  assert.ok(explorer().querySelector('[data-exposure-route="ingestion"] path[marker-end]'));
  await choose("Tetanus");
  assert.ok(explorer().querySelector('[data-exposure-route="percutaneous"] path[marker-end]'));
  assert.equal(explorer().querySelector('[data-exposure-route="ingestion"]'), null);
  await click(button("العربية"));
  assert.equal(explorer().querySelectorAll('[lang="en"]').length, 0);
  assert.ok(explorer().querySelector('.exposure-route-view [lang="ar"][dir="rtl"]'));
});

test("English, Arabic and Both control anatomy labels, callouts, record rail and effects", async () => {
  await mount();
  await click(button("English"));
  assert.equal(explorer().querySelectorAll('[lang="ar"]').length, 0);
  assert.equal(container.querySelectorAll('.hazard-record-list [lang="ar"]').length, 0);
  await click(button("العربية"));
  assert.equal(explorer().querySelectorAll('[lang="en"]').length, 0);
  assert.equal(container.querySelectorAll('.hazard-record-list [lang="en"]').length, 0);
  for (const element of explorer().querySelectorAll('[lang="ar"]')) assert.equal(element.getAttribute("dir"), "rtl");
  assert.match(region("lungs").getAttribute("aria-label"), /الرئتان/);
  await click(button("Both"));
  assert.ok(explorer().querySelector('[lang="en"]'));
  assert.ok(explorer().querySelector('[lang="ar"]'));
});

test("bilingual search includes body-system aliases and resets a reverse filter", async () => {
  await mount();
  await click(region("lungs"));
  await changeSearch("نخاع العظم");
  assert.equal(rail().length, 1);
  assert.match(rail()[0].textContent, /Benzene/);
  assert.equal(explorer().querySelector(".body-filter-banner"), null);
  await changeSearch("kidneys");
  assert.equal(rail().length, 2);
  assert.equal(filterHazards(HAZARD_RECORDS, "toxicological", "   ").length, 18);
});

test("biological category uses the same anatomy and preserves transmission review notes", async () => {
  await mount();
  await click(button("Biological hazards (19)"));
  assert.equal(rail().length, 19);
  await choose("Hepatitis B");
  assert.deepEqual(roleIds("primary"), ["liver"]);
  await click(explorer().querySelectorAll('[role="tab"]')[1]);
  assert.match(explorer().querySelector(".exposure-route-view").textContent, /Blood or body-fluid exposure/);
  assert.match(explorer().querySelector(".body-review-note").textContent, /Mapping needs review/);
});

test("source table remains available and returning preserves the explorer selection and language", async () => {
  await mount();
  await choose("Benzene");
  await click(button("English"));
  await click(button("Source data table"));
  assert.equal(visible(container.querySelector(".hazard-table")), true);
  assert.equal(container.querySelectorAll(".hazard-table tbody tr").length, 18);
  assert.equal(container.querySelectorAll(".hazard-table th").length, 7);
  await click(button("Biological hazards (19)"));
  assert.equal(container.querySelectorAll(".hazard-table tbody tr").length, 19);
  await click(button("Body-system explorer"));
  assert.deepEqual(roleIds("primary"), ["blood", "bone-marrow"]);
  assert.equal(explorer().querySelectorAll('[lang="ar"]').length, 0);
});

test("Save and existing saved hazard IDs remain compatible; related links keep the selected query", async () => {
  await mount();
  await choose("Benzene");
  await click(button("Save Benzene to notebook"));
  assert.ok(savedState.notebook["hazard:tox-benzene"]);
  assert.equal(savedState.notebook["hazard:tox-benzene"].title, "Benzene");
  await click(button("Related OSHA standards"));
  await click(button("Related Practice"));
  assert.deepEqual(opens, [["standards", "Benzene", { standardIds: ["1910-1200", "1910-134"] }], ["practice", "Benzene", { practiceTags: ["Benzene"], practiceQuestionIds: [] }]]);
  await choose("Asbestos");
  await choose("Benzene");
  assert.ok(button("Remove Benzene from notebook"));
});

test("responsive CSS reflows at container width and preserves focus and reduced motion", () => {
  const css = readFileSync(new URL("../app/body-explorer/body-explorer.css", import.meta.url), "utf8");
  assert.match(css, /container-type:\s*inline-size/);
  assert.match(css, /@container\s*\(max-width: 435px\)[\s\S]*?\.body-explorer-stage\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /@media\s*\(max-width: 760px\)[\s\S]*?\.hazard-explorer\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /:focus-visible\s*\{\s*outline: 3px solid/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
