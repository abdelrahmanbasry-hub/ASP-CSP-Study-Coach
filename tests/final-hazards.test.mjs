import "./helpers/register-tsx.mjs";
import assert from "node:assert/strict";
import { test, after, afterEach } from "node:test";
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { Window } from "happy-dom";
import { FINAL_DATASET, FINAL_HAZARD_RECORDS, FINAL_IMPLEMENTED_PHASE } from "../app/finalHazardData.ts";
import { FINAL_CATEGORIES, FINAL_PHASES } from "../app/finalHazardTaxonomy.ts";
import { HAZARD_LIBRARY_RECORDS, HAZARD_LIBRARY_BY_ID, HAZARD_REFERENCE_RECORDS, validateHazardLibrary } from "../app/hazardLibraryData.ts";
import { HAZARD_ID_ALIASES, hazardNotebookKeys } from "../app/hazardAliases.ts";
import { HAZARD_CATEGORY_BY_ID } from "../app/hazardCategories.ts";
import { SCENE_TEMPLATES, supportsSceneEngine } from "../app/hazard-scenes/sceneTemplates.ts";
import { filterHazards } from "../app/hazardExplorer.ts";
import { emptyStudySystemState, normalizeStudySystemState } from "../app/studySystemState.ts";
import { OSHA_STANDARDS } from "../app/standardsData.ts";
import { buildMissingStandardsReport } from "../app/hazardStandardReferences.ts";
import { notebookResourceGroups } from "../app/hazardNotebook.ts";
import { matchesPracticeTagAlias } from "../app/practiceTagAliases.ts";
import { filterPracticeV2References } from "../app/practiceV2.ts";
const directory = new URL("../data/hazard-library/final/", import.meta.url);

const window = new Window({ url: "http://localhost/" });
const globals = ["window","document","HTMLElement","SVGElement","Node","Event","MouseEvent","KeyboardEvent"];
const previous = new Map(globals.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
for (const key of globals) Object.defineProperty(globalThis,key,{value:key==="window"?window:window[key],configurable:true,writable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {act,createElement,useState}=await import("react");
const {createRoot}=await import("react-dom/client");
const {HazardVisualization}=await import("../app/hazard-library/HazardVisualization.tsx");
const {HazardsLibrary}=await import("../app/hazard-library/HazardsLibrary.tsx");
const {StudyNotebook}=await import("../app/StudySystem.tsx");
let root,container;
async function render(component,props){if(!root){container=document.createElement("div");document.body.append(container);root=createRoot(container);}await act(()=>root.render(createElement(component,props)));}
const click=async selector=>{const e=typeof selector==="string"?container.querySelector(selector):selector;assert.ok(e,selector);await act(()=>e.click());};
afterEach(async()=>{if(root)await act(()=>root.unmount());root=null;container?.remove();});
after(()=>{window.happyDOM.abort();for(const key of globals){const old=previous.get(key);if(old)Object.defineProperty(globalThis,key,old);else delete globalThis[key];}delete globalThis.IS_REACT_ACT_ENVIRONMENT;});

test("all package files match the supplied manifest; phase checkpoints contain 35/37/41/18 exact combined-source records", () => {
  const manifest = JSON.parse(readFileSync(new URL("MANIFEST.json", directory)));
  for (const item of manifest) {
    const bytes = readFileSync(new URL(item.file, directory));
    assert.equal(bytes.length, item.bytes); assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
  }
  const combined = [];
  for (const [phase, count] of [[5,35], [6,37], [7,41], [8,18]]) {
    const records = JSON.parse(readFileSync(new URL(`phase${phase}-hazard-master-dataset.json`, directory))).records;
    assert.equal(records.length, count); combined.push(...records);
    if (phase <= FINAL_IMPLEMENTED_PHASE) assert.equal(FINAL_HAZARD_RECORDS.filter(r => r.importMetadata.phase === phase).length, count);
  }
  assert.deepEqual(combined, FINAL_DATASET.records); assert.equal(new Set(combined.map(r => r.id)).size, 131);
});

test("lossless controlled adapters retain content, source qualifiers, conditions, tags, and intentionally empty OSHA mappings", () => {
  for (const record of FINAL_HAZARD_RECORDS) {
    const raw = FINAL_DATASET.records.find(r => r.id === record.id);
    for (const field of ["name", "summary", "mechanisms", "consequences", "highRiskWork", "controls", "workContexts", "relatedPracticeTags", "searchTerms"]) assert.deepEqual(record[field], raw[field], `${record.id}/${field}`);
    for (const [key, value] of Object.entries(raw.source)) assert.deepEqual(record.source[key], value);
    assert.equal(record.importMetadata.phase, FINAL_PHASES[raw.categoryId]);
    assert.deepEqual(record.importMetadata.visualization, raw.visualization);
    assert.deepEqual(record.standardReferences.map(({number,scope,relation}) => ({number,scope,relation})), raw.relatedStandards);
    assert.ok(record.relatedStandardIds.every(id => OSHA_STANDARDS.some(s => s.id === id)));
    if (!raw.relatedStandards.length) assert.deepEqual(record.relatedStandardIds, []);
    assert.equal(record.relatedPracticeQuestionIds.length, 0);
  }
  assert.doesNotThrow(() => validateHazardLibrary());
});

test("checkpoint categories have exact counts and every record has reachable bilingual subcategory navigation", () => {
  for (const [code, categoryId] of Object.entries(FINAL_CATEGORIES)) {
    if (FINAL_PHASES[code] > FINAL_IMPLEMENTED_PHASE) continue;
    const records = filterHazards(HAZARD_LIBRARY_RECORDS, {categoryId});
    assert.equal(records.length, FINAL_DATASET.categoryCounts[code]);
    for (const record of records) assert.ok(HAZARD_CATEGORY_BY_ID[categoryId].subcategories.some(s => s.id === record.subcategoryId && s.name.ar));
  }
});

test("configured engines, optimized artwork, translated overlays, landmarks and separated mobile markers cover every imported record", () => {
  for (const record of FINAL_HAZARD_RECORDS) {
    const scene = record.visualization, template = SCENE_TEMPLATES[scene.template];
    assert.ok(supportsSceneEngine(template, scene.kind));
    assert.ok(statSync(new URL(`../public${template.asset}`, import.meta.url)).size < 260_000);
    assert.equal(template.width, 1200); assert.equal(template.height, 1200);
    assert.deepEqual(scene.overlays.map(o => o.id), record.importMetadata.visualization.overlays);
    assert.deepEqual(scene.landmarks.map(o => o.id), record.importMetadata.visualization.markers);
    for (const overlay of scene.overlays) { assert.ok(overlay.label.en && /[\u0600-\u06ff]/.test(overlay.label.ar)); assert.ok(overlay.shapes.length); }
    for (let i=0; i<scene.overlays.length; i++) for(let j=i+1;j<scene.overlays.length;j++) {
      const a=scene.overlays[i].marker,b=scene.overlays[j].marker;
      assert.ok(Math.hypot(a[0]-b[0],a[1]-b[1])>=145, record.id);
    }
  }
});

test("five deterministic reference aliases preserve scene identity and canonical search/save targets", () => {
  assert.equal(Object.keys(HAZARD_ID_ALIASES).length, 5);
  for (const [old, id] of Object.entries(HAZARD_ID_ALIASES)) {
    assert.equal(HAZARD_LIBRARY_BY_ID[old], HAZARD_LIBRARY_BY_ID[id]);
    assert.equal(HAZARD_LIBRARY_BY_ID[id].visualization, HAZARD_REFERENCE_RECORDS.find(r => r.id===old).visualization);
    assert.ok(!HAZARD_LIBRARY_RECORDS.some(r => r.id===old));
    assert.deepEqual(filterHazards(HAZARD_LIBRARY_RECORDS,{query:old}).map(r=>r.id),[id]);
    assert.deepEqual(hazardNotebookKeys(old),[`hazard:${id}`,`hazard:${old}`]);
  }
});

test("protective airflow, egress and distance overlays remain control points rather than hazard labels",()=>{
  for(const record of FINAL_HAZARD_RECORDS)for(const overlay of record.visualization.overlays){
    if(["ventilation","ventilation-path","distance","egress-path","escape-route","inerting-control"].includes(overlay.id)){
      assert.equal(overlay.semantic,"control");assert.equal(overlay.role,"possible");
    }
  }
});

test("the shared search covers every new canonical bilingual field, context, control, tag and unresolved section", () => {
  for (const r of FINAL_HAZARD_RECORDS) {
    const queries = [r.id,r.name.en,r.name.ar,r.summary.ar,HAZARD_CATEGORY_BY_ID[r.categoryId].name.en,...r.relatedPracticeTags,...r.workContexts,...r.standardReferences.map(s=>s.number),...r.mechanisms.map(s=>s.en),...r.consequences.map(s=>s.ar),...r.highRiskWork.map(s=>s.en),...Object.values(r.controls).flat().map(s=>s.ar)];
    for(const query of queries) assert.equal(filterHazards([r],{query}).length,1,`${r.id}: ${query}`);
  }
  const report=buildMissingStandardsReport(FINAL_HAZARD_RECORDS);
  assert.equal(report.summary.totalOccurrences,FINAL_HAZARD_RECORDS.reduce((n,r)=>n+r.standardReferences.length,0));
  assert.ok(report.missing.every(item=>item.occurrences.every(ref=>!ref.standardId)));
});

test("stored-energy spelling alias is supported by existing mechanical energy questions and rejects partial or unrelated matches",async()=>{
  const {PRACTICE_V2_QUESTIONS}=await import("../app/practiceV2Catalog.ts");
  const record=HAZARD_LIBRARY_BY_ID["HL-LOTO-009"];
  const matches=filterPracticeV2References(PRACTICE_V2_QUESTIONS,{practiceTags:record.relatedPracticeTags});
  assert.ok(matches.some(q=>q.id==="PV2-CORE-CH17-008"));assert.ok(matches.every(q=>PRACTICE_V2_QUESTIONS.includes(q)));
  assert.equal(matchesPracticeTagAlias("projectile trajectory and stored energy","stored-energy"),true);
  assert.equal(matchesPracticeTagAlias("stored energyvalues","stored-energy"),false);
  assert.equal(matchesPracticeTagAlias("energy storage elsewhere","stored-energy"),false);
  assert.equal(matchesPracticeTagAlias("stored energy","reaccumulation"),false);
});

for (const record of FINAL_HAZARD_RECORDS) test(`${record.id}: bilingual engine rendering, click/keyboard selection and responsive scene orientation`, async()=>{
  for(const language of ["en","ar","both"]){
    await render(HazardVisualization,{key:`${record.id}-${language}`,record,language,selectedSystem:null,onSelectSystem:()=>{},onClearSystem:()=>{}});
    const scene=record.visualization;
    assert.equal(container.querySelector(".hazard-scene").dataset.template,scene.template);
    assert.equal(container.querySelector(".scene-stage").dir,"ltr");
    assert.equal(!!container.querySelector('[lang="en"]'),language!=="ar");
    assert.equal(!!container.querySelector('[lang="ar"]'),language!=="en");
    assert.equal(container.querySelectorAll("[data-overlay-id]").length,scene.overlays.length);
    const first=scene.overlays[0];await click(`[data-callout-id="${first.id}"]`);
    assert.equal(container.querySelector(`[data-overlay-id="${first.id}"]`).getAttribute("aria-pressed"),"true");
    assert.ok(container.querySelector(".scene-selection-summary").textContent.includes(record.summary[language==="ar"?"ar":"en"]));
    assert.equal(container.querySelector(`[data-connector="${first.id}"] path`).getAttribute("d"),`M${first.point[0]} ${first.point[1]} L${first.marker[0]} ${first.marker[1]}`);
    const marker=container.querySelector(".scene-marker");
    await act(()=>marker.dispatchEvent(new window.KeyboardEvent("keydown",{key:" ",bubbles:true,cancelable:true})));
    assert.equal(marker.getAttribute("aria-pressed"),"false");
    await click('[data-landmark-id="control-point"]');assert.equal(container.querySelector("[data-landmark-focus]").dataset.landmarkFocus,"control-point");
  }
});

test("all 37 preserved Occupational Health records render all three language modes through the body engine",async()=>{
  const records=HAZARD_LIBRARY_RECORDS.filter(r=>r.visualization.kind==="body-system");
  assert.equal(records.length,37);
  for(const record of records)for(const language of ["en","ar","both"]){
    await render(HazardVisualization,{key:`${record.id}-${language}`,record,language,selectedSystem:null,onSelectSystem:()=>{},onClearSystem:()=>{}});
    assert.ok(container.querySelector('[data-visualization-engine="body-system"]'));
    assert.equal(container.querySelector('.body-system-explorer').dataset.language,language);
    assert.equal(!!container.querySelector('[lang="en"]'),language!=="ar");
    assert.equal(!!container.querySelector('[lang="ar"]'),language!=="en");
    assert.ok(container.querySelector('h3').textContent.includes(record.name[language==="ar"?"ar":"en"]));
    for(const label of container.querySelectorAll('[lang="ar"]'))assert.equal(label.dir,"rtl");
  }
});

test("new confined-space/LOTO canonical Save recognizes legacy notes and never creates duplicate entries",async()=>{
  for(const legacy of ["ref-oxygen-deficient-space","ref-unexpected-startup"]){
    const id=HAZARD_ID_ALIASES[legacy],entry={id:`hazard:${legacy}`,kind:"hazard",title:"Original",subtitle:"Saved",note:"My original note",createdAt:12,updatedAt:34};
    let saved=normalizeStudySystemState({...emptyStudySystemState(),notebook:{[entry.id]:entry}});
    function Harness(){const[system,set]=useState(saved);return createElement(HazardsLibrary,{initialItemId:legacy,system,onSystem:next=>{saved=next;set(next);},onOpen:()=>{}});}
    await render(Harness,{key:legacy});
    assert.equal(container.querySelector(".hazard-record-list .active").dataset.hazardId,id);
    assert.ok(container.querySelector(".hazard-bookmark-heading button").textContent.includes("Saved"));
    assert.deepEqual(saved.notebook[entry.id],entry);assert.equal(Object.keys(saved.notebook).length,1);
  }
});

test("final visible catalog and global index contain exactly 220 canonical destinations and no prototypes",async()=>{
  assert.equal(HAZARD_LIBRARY_RECORDS.length,220);
  assert.equal(new Set(HAZARD_LIBRARY_RECORDS.map(r=>r.id)).size,220);
  assert.equal(HAZARD_LIBRARY_RECORDS.filter(r=>r.id.startsWith("HL-")).length,183);
  assert.ok(HAZARD_LIBRARY_RECORDS.every(r=>!r.id.startsWith("ref-")));
  const {buildGlobalSearchIndex,searchGlobalIndex}=await import("../app/globalSearch.ts");
  const index=buildGlobalSearchIndex({examName:"ASP",practiceBank:[],chapterPractice:[],attempts:[]});
  assert.equal(index.filter(d=>d.kind==="hazard").length,220);
  for(const record of HAZARD_LIBRARY_RECORDS){
    const result=searchGlobalIndex(index,record.id).find(d=>d.id===`hazard:${record.id}`);
    assert.equal(result?.target.itemId,record.id);
  }
  assert.equal(index.some(d=>d.target.itemId==="ref-radiation-exposure"),false);
});

test("broad radiation legacy view preserves identity and notes, never aliases to a subtype or enters the rail",async()=>{
  const id="ref-radiation-exposure",original=HAZARD_REFERENCE_RECORDS.find(r=>r.id===id);
  assert.equal(HAZARD_LIBRARY_BY_ID[id],original);assert.equal(HAZARD_ID_ALIASES[id],undefined);
  assert.deepEqual(filterHazards(HAZARD_LIBRARY_RECORDS,{query:id}),[]);
  const entry={id:`hazard:${id}`,kind:"hazard",title:original.name.en,note:"Broad radiation note",createdAt:11,updatedAt:22};
  const state=normalizeStudySystemState({...emptyStudySystemState(),notebook:{[entry.id]:entry}});
  await render(HazardsLibrary,{initialItemId:id,system:state,onSystem:()=>assert.fail("Opening must not mutate notebook"),onOpen:()=>{}});
  assert.ok(container.querySelector('[role="status"]').textContent.includes("Saved legacy reference"));
  assert.ok(container.querySelector('.hazard-detail-card h3').textContent.includes(original.name.en));
  assert.equal(container.querySelectorAll('[data-hazard-id]').length,11);
  assert.equal(container.querySelector('[data-hazard-id="ref-radiation-exposure"]'),null);
  assert.ok(container.querySelector('.hazard-bookmark-heading button').textContent.includes("Saved"));
  assert.deepEqual(state.notebook[entry.id],entry);
  await click([...container.querySelectorAll('button')].find(b=>b.textContent.includes("Browse radiation hazards")));
  assert.ok(container.querySelector('.hazard-record-list .active').dataset.hazardId.startsWith("HL-RAD-"));
});

test("dual legacy/canonical saves share one notebook resource without losing independently editable notes or timestamps",async()=>{
  const make=(id,note,time)=>({id:`hazard:${id}`,kind:"hazard",title:id,note,createdAt:time,updatedAt:time+5});
  const old=make("ref-oxygen-deficient-space","Older note",10),canonical=make("HL-CONF-001","Newer note",20),radiation=make("ref-radiation-exposure","Broad radiation",30),subtype=make("HL-RAD-001","Specific subtype",40);
  const notebook=Object.fromEntries([old,canonical,radiation,subtype].map(e=>[e.id,e]));
  const before=JSON.stringify(notebook);const groups=notebookResourceGroups(notebook);
  assert.equal(groups.length,3);assert.equal(groups.find(g=>g.id===canonical.id).entries.length,2);
  assert.equal(JSON.stringify(notebook),before);
  let state={...emptyStudySystemState(),notebook};
  function Harness(){const[system,set]=useState(state);return createElement(StudyNotebook,{system,onChange:next=>{state=next;set(next);}});}
  await render(Harness,{});
  assert.equal(container.querySelectorAll('.notebook-card').length,3);
  assert.equal(container.querySelectorAll('textarea').length,4);
  const area=container.querySelector(`[data-notebook-entry="${old.id}"] textarea`);
  await act(()=>{Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,"value").set.call(area,"Edited older note");area.dispatchEvent(new window.Event("input",{bubbles:true}));});
  assert.equal(state.notebook[old.id].note,"Edited older note");
  assert.equal(state.notebook[old.id].createdAt,old.createdAt);
  assert.deepEqual(state.notebook[canonical.id],canonical);assert.deepEqual(state.notebook[radiation.id],radiation);
});

test("generic details retain final source caveats, exact controls and Standards/Practice payloads",async()=>{
  for(const id of ["HL-PSM-001","HL-THERM-001","HL-ENV-001","HL-SEC-001","HL-NOISE-001"]){
    const record=HAZARD_LIBRARY_BY_ID[id],opens=[];
    await render(HazardsLibrary,{key:id,initialItemId:id,system:emptyStudySystemState(),onSystem:()=>{},onOpen:(...args)=>opens.push(args)});
    const panel=container.querySelector('.hazard-detail-card');
    assert.ok(panel.textContent.includes(record.source.regulatoryVerification));
    for(const basis of record.source.externalBasis)assert.ok(panel.textContent.includes(basis));
    for(const control of Object.values(record.controls).flat())assert.ok(panel.textContent.includes(control.ar));
    await click('.scene-callout');assert.ok(panel.querySelector('[data-selected-callout]'));
    await click('[aria-label="Related OSHA standards"]');assert.deepEqual(opens[0][2],{standardIds:record.relatedStandardIds});
    await click('[aria-label="Related Practice"]');assert.deepEqual(opens[1][2],{practiceTags:record.relatedPracticeTags,practiceQuestionIds:[]});
    await click('[data-category-id="all"]');assert.equal(container.querySelectorAll('[data-hazard-id]').length,220);assert.equal(panel.querySelector('[data-selected-callout]'),null);
  }
});
