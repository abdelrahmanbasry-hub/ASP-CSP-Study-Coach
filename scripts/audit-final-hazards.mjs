import "../tests/helpers/register-tsx.mjs";
import { mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { HAZARD_LIBRARY_RECORDS as records, HIDDEN_LEGACY_HAZARD_RECORDS, HAZARD_LIBRARY_BY_ID } from "../app/hazardLibraryData.ts";
import { HAZARD_ID_ALIASES } from "../app/hazardAliases.ts";
import { FINAL_HAZARD_RECORDS } from "../app/finalHazardData.ts";
import { HAZARD_CATEGORIES } from "../app/hazardCategories.ts";
import { buildMissingStandardsReport } from "../app/hazardStandardReferences.ts";
import { SCENE_TEMPLATES } from "../app/hazard-scenes/sceneTemplates.ts";
const { PRACTICE_V2_QUESTIONS } = await import("../app/practiceV2Catalog.ts");
import { filterPracticeV2References } from "../app/practiceV2.ts";
import { PRACTICE_TAG_ALIASES } from "../app/practiceTagAliases.ts";
const { buildGlobalSearchIndex } = await import("../app/globalSearch.ts");

const out = new URL("../reports/final/", import.meta.url);
mkdirSync(out, { recursive: true });
const write = (name, data) => writeFileSync(new URL(name, out), JSON.stringify(data, null, 2) + "\n");
const controlled = records.filter(r => r.importMetadata);
const countBy = (items, key) => Object.fromEntries([...new Set(items.map(key))].map(value => [value, items.filter(item => key(item) === value).length]));
const sourceCounts = items => countBy(items, r => r.source.yatesSupport);
const catalog = {
  schemaVersion: 1, visible: records.length, occupationalHealth: records.filter(r => r.categoryId === "occupational-health").length,
  controlled: controlled.length, imported: FINAL_HAZARD_RECORDS.length, phases: countBy(controlled, r => r.importMetadata.phase),
  categories: HAZARD_CATEGORIES.map(category => ({ id: category.id, name: category.name, count: records.filter(r => r.categoryId === category.id).length })),
  sourceSupport: { finalPackage: sourceCounts(FINAL_HAZARD_RECORDS), allControlled: sourceCounts(controlled) },
  records: records.map(r => ({ id: r.id, name: r.name, categoryId: r.categoryId, subcategoryId: r.subcategoryId, phase: r.importMetadata?.phase ?? null })),
};
write("catalog.json", catalog);
write("source-support.json", catalog.sourceSupport);
const normalizedName = name => name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const duplicateIds = records.filter((r, i) => records.findIndex(other => other.id === r.id) !== i).map(r => r.id);
const duplicateNames = records.flatMap((r,i) => records.slice(i+1).filter(other => normalizedName(other.name.en) === normalizedName(r.name.en)).map(other => [r.id,other.id]));
const nearNames = records.flatMap((r,i) => records.slice(i+1).filter(other => {
  const a = new Set(normalizedName(r.name.en).split(" ")), b = new Set(normalizedName(other.name.en).split(" "));
  return [...a].filter(token => b.has(token)).length / new Set([...a,...b]).size >= .7;
}).map(other => ({ ids: [r.id,other.id], names: [r.name.en,other.name.en], review: "Retained separate controlled records; lexical similarity is not an authorization to merge concepts." })));
const index = buildGlobalSearchIndex({ examName: "ASP", practiceBank: [], chapterPractice: [], attempts: [] }).filter(d => d.kind === "hazard");
write("reconciliation.json", {
  visible: records.length, duplicateIds, duplicateNames, nearNames,
  conceptOverlapReview: {
    policy: "Potential conceptual overlap is reported for editorial review, not merged. The controlled source specifies separate records, contexts and IDs; no exact-name duplicates or visible prototype duplicates remain.",
    groups: [
      ["HL-MAT-001", "HL-ERGO-001"],
      ["HL-MAT-014", "HL-FIRE-009"],
      ["HL-CHEM-002", "HL-FIRE-001"],
      ["HL-CHEM-009", "HL-PRESS-008", "HL-FIRE-008"],
      ["HL-CHEM-012", "HL-PSM-001"],
      ["HL-PRESS-001", "HL-PSM-003"],
      ["HL-LOTO-005", "HL-PRESS-004"],
      ["HL-FIRE-004", "HL-FIRE-005"],
      ["HL-CHEM-014", "HL-ENV-007"],
      ["HL-CHEM-013", "HL-ENV-008"],
      ["HL-PSM-007", "HL-SEC-007"],
      ["HL-LOTO-002", "HL-LOTO-003", "HL-LOTO-009"],
    ].map(ids => ids.map(id => ({ id, name: HAZARD_LIBRARY_BY_ID[id].name.en }))),
  },
  aliases: Object.entries(HAZARD_ID_ALIASES).map(([legacy,canonical]) => ({ legacy,canonical,method:"non-destructive lookup/search/Save compatibility alias; notebook presentation grouping",sameObject:HAZARD_LIBRARY_BY_ID[legacy]===HAZARD_LIBRARY_BY_ID[canonical] })),
  hiddenLegacy: HIDDEN_LEGACY_HAZARD_RECORDS.map(r => ({id:r.id,name:r.name,method:"original broad reference preserved for historic saved links; no subtype alias"})),
  globalSearchCount: index.length, staleReferenceResults: index.filter(d => d.target.itemId?.startsWith("ref-")).map(d=>d.id),
});
const standards = buildMissingStandardsReport(controlled);
write("standards.json", { ...standards, finalPackage: buildMissingStandardsReport(FINAL_HAZARD_RECORDS).summary,
  intentionallyUnmapped: controlled.filter(r => !r.standardReferences.length).map(r => ({ id:r.id,name:r.name.en,categoryId:r.categoryId,externalBasis:r.source.externalBasis??[],regulatoryVerification:r.source.regulatoryVerification??r.source.oshaVerification })),
  policy: "Existing six-record OSHA registry retained. No vetted citation-only/import pipeline exists. No fabricated IDs, no fuzzy mapping and no EPA records added. Scope/relation and supplied verification wording retained; not independently recertified by this import.",
});
const coverage = records.map(r => {
  const matches=filterPracticeV2References(PRACTICE_V2_QUESTIONS,{practiceTags:r.relatedPracticeTags,practiceQuestionIds:r.relatedPracticeQuestionIds});
  return { id:r.id,name:r.name.en,phase:r.importMetadata?.phase??null,tags:r.relatedPracticeTags,questionIds:matches.map(q=>q.id) };
});
write("practice.json", { summary: { visible:coverage.length,matched:coverage.filter(r=>r.questionIds.length).length,unmatched:coverage.filter(r=>!r.questionIds.length).length,finalPackageMatched:coverage.filter(r=>r.phase>=5&&r.questionIds.length).length,finalPackageUnmatched:coverage.filter(r=>r.phase>=5&&!r.questionIds.length).length },aliases:PRACTICE_TAG_ALIASES,newAliases:["stored-energy"],rejectedAliases:[{tags:["residual-energy","reaccumulation"],reason:"No exact equivalent concept/chapter/stem phrase found; do not widen to generic energy or infer unrelated synonyms."}],unmatched:coverage.filter(r=>!r.questionIds.length),coverage });
const templates = Object.entries(SCENE_TEMPLATES).map(([name,template])=>{
  const bytes=readFileSync(new URL(`../public${template.asset}`,import.meta.url));
  return {name,asset:template.asset,width:template.width,height:template.height,bytes:bytes.length,sha256:createHash("sha256").update(bytes).digest("hex"),engines:[...new Set([template.engine,...(template.supportedEngines??[])])],recordIds:records.filter(r=>r.visualization.template===name).map(r=>r.id)};
});
const newAssets=JSON.parse(readFileSync(new URL("scene-assets.json",out)));
write("scenes.json", {registered:templates.length,totalOptimizedBytes:templates.reduce((n,t)=>n+t.bytes,0),newAssetCount:newAssets.length,newAssetBytes:newAssets.reduce((n,a)=>n+statSync(new URL(`../${a.asset}`,import.meta.url)).size,0),packageTemplates:[...new Set(FINAL_HAZARD_RECORDS.map(r=>r.visualization.template))],templates,
  coverage:controlled.map(r=>({id:r.id,engine:r.visualization.kind,template:r.visualization.template,overlayIds:r.visualization.overlays.map(o=>o.id),landmarkIds:r.visualization.landmarks?.map(o=>o.id)??[],sourceSupport:r.source.yatesSupport})),
});
write("component-accessibility-coverage.json", {
  scope: "Coverage inventory; actual command outcomes are recorded separately in validation.json and logs. Browser checks are samples, not a formal assistive-technology conformance certification.",
  engines: [...new Set(records.map(r=>r.visualization.kind))],
  perRecordLanguageCoverage: records.map(r=>({id:r.id,languages:["en","ar","both"],testFile:r.importMetadata?.phase===4?"tests/phase4-hazards.test.mjs":"tests/final-hazards.test.mjs"})),
  componentSuites: ["tests/final-hazards.test.mjs","tests/hazard-library.test.mjs","tests/hazard-scenes.test.mjs","tests/body-explorer.test.mjs","tests/phase4-hazards.test.mjs","tests/phase41-integrations.test.mjs"],
  checks: [
    {feature:"Click/tap and Enter/Space selection; arrows/Home/End focus; pressed state; external bilingual callouts",evidence:["tests/hazard-scenes.test.mjs","tests/final-hazards.test.mjs"]},
    {feature:"Body keyboard regions, reverse filtering, three modes, source table and OH Save",evidence:["tests/body-explorer.test.mjs"]},
    {feature:"Category/More navigation, Escape and language switching",evidence:["tests/hazard-library.test.mjs","reports/final/browser-qa.json"]},
    {feature:"Visible focus, non-color roles, reduced-motion CSS, responsive layout",evidence:["tests/hazard-scenes.test.mjs","tests/body-explorer.test.mjs"]},
    {feature:"220 canonical search targets; legacy alias Save and independent note editing",evidence:["tests/final-hazards.test.mjs","tests/phase41-integrations.test.mjs"]},
    {feature:"Exact standards references, false-match rejection, missing standards; real Practice IDs",evidence:["tests/final-hazards.test.mjs","tests/phase41-integrations.test.mjs","reports/final/standards.json","reports/final/practice.json"]},
  ],
  browserEvidence:"reports/final/browser-qa.json",viewportWidths:[1536,1024,390],
  visualReview:"All 17 new scene assets reviewed individually or in phase contact sheets; sampled live desktop/mobile Arabic captures reviewed. Existing physical scene orientation remains LTR while Arabic callouts are RTL.",
  limitations:["No formal screen-reader/assistive-technology certification performed.","Reduced motion is covered by stylesheet regression tests; browser motion preference was not emulated.","Contrast and text wrapping received visual review, not exhaustive automated WCAG measurement."],
});
console.log(JSON.stringify({visible:catalog.visible,phases:catalog.phases,sourceSupport:catalog.sourceSupport,standards:standards.summary,practice:{matched:coverage.filter(r=>r.questionIds.length).length,unmatched:coverage.filter(r=>!r.questionIds.length).length},newAssets:newAssets.length,duplicates:duplicateIds.length+duplicateNames.length}));
