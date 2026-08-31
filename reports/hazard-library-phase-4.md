**Phase 4 — Core Physical Hazard Population**

Implemented the supplied controlled dataset and stopped after Phase 4. No Phase 5 content, new engine, dependency, deployment, or per-hazard page was added.

| Category | Phase 4 imported | Existing Phase 3 references in category | Displayed category total |
| --- | ---: | ---: | ---: |
| Electrical | 10 | 1 | 11 |
| Falls & Work at Height | 14 | 1 | 15 |
| Machinery & Tools | 14 | 0 | 14 |
| Material Handling | 14 | 1 | 15 |
| **Phase 4 total** | **52** | | |

The full catalog contains **95 distinct IDs**: 37 original Occupational Health records, six original Phase 3 references, and 52 controlled Phase 4 records. Arc Flash, Scaffold Fall and Forklift Tip-Over retain separate original-reference and controlled-record IDs. Rail labels distinguish them; records were not merged or renamed.

**Architecture and controlled content**

The JSON is imported through a lossless adapter. Bilingual names, summaries, mechanisms, consequences, high-risk work, all hierarchy-of-controls fields, work-context slugs, Practice tags and search terms are preserved. The raw dataset remains byte-identical to the ZIP (SHA-256 `7fc5d22f4d633395b799fee7e3945b1aa8e0ebcd4fbbfb5e3d578a2ff3a75d7b`). All five package files are retained under `data/hazard-library/phase4/`.

The adapter maps supplied category/subcategory codes into the existing configured taxonomy and preserves the original codes, package version, content status and visualization tokens in `importMetadata`. Optional `standardReferences` retain supplied number, scope and relation plus an explicit resolved/unresolved status. Source metadata retains Yates edition, section, approximate page range, support level and supplied OSHA-verification wording. Support remains **42 direct, four indirect and six supplemented**; no source qualifiers were promoted to direct support.

All existing engines and generic details components remain in use. The scene registry now permits an explicit engine allowlist for the two supplied templates used by more than one engine. The 52 records use 27 physical templates: three existing and 24 new. Geometry is keyed by template and semantic element, never by hazard ID. Every supplied overlay and landmark has validated coordinates and bilingual interface labels.

**Files added**

- [app/phase4HazardData.ts](D:/csp-coach/csp-coach/app/phase4HazardData.ts)
- [app/phase4Taxonomy.ts](D:/csp-coach/csp-coach/app/phase4Taxonomy.ts)
- [app/hazardStandardReferences.ts](D:/csp-coach/csp-coach/app/hazardStandardReferences.ts)
- [app/hazard-scenes/phase4SceneGeometry.ts](D:/csp-coach/csp-coach/app/hazard-scenes/phase4SceneGeometry.ts)
- [app/hazard-scenes/phase4SceneLabels.ts](D:/csp-coach/csp-coach/app/hazard-scenes/phase4SceneLabels.ts)
- [tests/phase4-hazards.test.mjs](D:/csp-coach/csp-coach/tests/phase4-hazards.test.mjs)

Controlled package copies:

- [data/hazard-library/phase4/PHASE-4-CODEX-PROMPT.md](D:/csp-coach/csp-coach/data/hazard-library/phase4/PHASE-4-CODEX-PROMPT.md)
- [data/hazard-library/phase4/phase4-hazard-audit.csv](D:/csp-coach/csp-coach/data/hazard-library/phase4/phase4-hazard-audit.csv)
- [data/hazard-library/phase4/phase4-hazard-master-dataset.json](D:/csp-coach/csp-coach/data/hazard-library/phase4/phase4-hazard-master-dataset.json)
- [data/hazard-library/phase4/phase4-source-authority-notes.md](D:/csp-coach/csp-coach/data/hazard-library/phase4/phase4-source-authority-notes.md)
- [data/hazard-library/phase4/README.md](D:/csp-coach/csp-coach/data/hazard-library/phase4/README.md)

**Files modified from the approved Phase 3 baseline**

- [app/hazardTypes.ts](D:/csp-coach/csp-coach/app/hazardTypes.ts)
- [app/hazardCategories.ts](D:/csp-coach/csp-coach/app/hazardCategories.ts)
- [app/hazardLibraryData.ts](D:/csp-coach/csp-coach/app/hazardLibraryData.ts)
- [app/hazardExplorer.ts](D:/csp-coach/csp-coach/app/hazardExplorer.ts)
- [app/globalSearch.ts](D:/csp-coach/csp-coach/app/globalSearch.ts)
- [app/hazard-scenes/sceneTemplates.ts](D:/csp-coach/csp-coach/app/hazard-scenes/sceneTemplates.ts)
- [app/hazard-scenes/InteractiveHazardScene.tsx](D:/csp-coach/csp-coach/app/hazard-scenes/InteractiveHazardScene.tsx)
- [app/hazard-scenes/hazard-scenes.css](D:/csp-coach/csp-coach/app/hazard-scenes/hazard-scenes.css)
- [app/hazard-library/HazardsLibrary.tsx](D:/csp-coach/csp-coach/app/hazard-library/HazardsLibrary.tsx)
- [app/hazard-library/hazard-library.css](D:/csp-coach/csp-coach/app/hazard-library/hazard-library.css)
- [tests/hazard-library.test.mjs](D:/csp-coach/csp-coach/tests/hazard-library.test.mjs)

The pre-existing uncommitted changes elsewhere in the workspace were retained. Occupational Health data, the body engine, the six reference records and their scene configurations/assets, Practice questions, the standards catalog, saved-state storage and package dependencies were not modified in Phase 4.

**Reusable templates and assets**

Added 24 optimized 1200 × 1200 WebP illustrations (2,982,760 bytes total, approximately 2.98 MB). Assets are lazy-loaded and retain responsive overlay coordinates. The built-in ImageGen tool generated text-free base artwork; Pillow performed resize/WebP optimization only. Original generated PNGs remain in place. Exact per-asset prompts, shared style direction, original paths and output paths are recorded in [reports/phase4/scene-assets.json](D:/csp-coach/csp-coach/reports/phase4/scene-assets.json).

| Template / asset | Engine(s) | Status |
| --- | --- | --- |
| [public/hazard-scenes/electrical-panel-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/electrical-panel-worker.webp) | worker-scene | Existing, preserved |
| [public/hazard-scenes/electrical-contact-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/electrical-contact-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/overhead-power-line.webp](D:/csp-coach/csp-coach/public/hazard-scenes/overhead-power-line.webp) | worker-scene | Added |
| [public/hazard-scenes/electrical-circuit.webp](D:/csp-coach/csp-coach/public/hazard-scenes/electrical-circuit.webp) | concept-diagram | Added |
| [public/hazard-scenes/electrical-cord-grounding.webp](D:/csp-coach/csp-coach/public/hazard-scenes/electrical-cord-grounding.webp) | concept-diagram, worker-scene | Added |
| [public/hazard-scenes/walking-surface-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/walking-surface-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/floor-opening-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/floor-opening-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/roof-edge-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/roof-edge-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/ladder-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/ladder-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/stairway-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/stairway-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/scaffold-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/scaffold-worker.webp) | worker-scene | Existing, preserved |
| [public/hazard-scenes/aerial-lift-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/aerial-lift-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/rope-descent-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/rope-descent-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/fall-arrest-system.webp](D:/csp-coach/csp-coach/public/hazard-scenes/fall-arrest-system.webp) | concept-diagram | Added |
| [public/hazard-scenes/fall-arrest-clearance.webp](D:/csp-coach/csp-coach/public/hazard-scenes/fall-arrest-clearance.webp) | concept-diagram | Added |
| [public/hazard-scenes/machine-guarding.webp](D:/csp-coach/csp-coach/public/hazard-scenes/machine-guarding.webp) | equipment-scene | Added |
| [public/hazard-scenes/grinder-saw-workstation.webp](D:/csp-coach/csp-coach/public/hazard-scenes/grinder-saw-workstation.webp) | equipment-scene, worker-scene | Added |
| [public/hazard-scenes/hand-tool-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/hand-tool-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/robot-cell.webp](D:/csp-coach/csp-coach/public/hazard-scenes/robot-cell.webp) | equipment-scene | Added |
| [public/hazard-scenes/conveyor-system.webp](D:/csp-coach/csp-coach/public/hazard-scenes/conveyor-system.webp) | equipment-scene | Added |
| [public/hazard-scenes/material-handling-worker.webp](D:/csp-coach/csp-coach/public/hazard-scenes/material-handling-worker.webp) | worker-scene | Added |
| [public/hazard-scenes/forklift-warehouse.webp](D:/csp-coach/csp-coach/public/hazard-scenes/forklift-warehouse.webp) | equipment-scene | Existing, preserved |
| [public/hazard-scenes/loading-dock.webp](D:/csp-coach/csp-coach/public/hazard-scenes/loading-dock.webp) | equipment-scene | Added |
| [public/hazard-scenes/pallet-jack.webp](D:/csp-coach/csp-coach/public/hazard-scenes/pallet-jack.webp) | equipment-scene | Added |
| [public/hazard-scenes/warehouse-storage.webp](D:/csp-coach/csp-coach/public/hazard-scenes/warehouse-storage.webp) | equipment-scene | Added |
| [public/hazard-scenes/crane-suspended-load.webp](D:/csp-coach/csp-coach/public/hazard-scenes/crane-suspended-load.webp) | equipment-scene | Added |
| [public/hazard-scenes/forklift-battery-charging.webp](D:/csp-coach/csp-coach/public/hazard-scenes/forklift-battery-charging.webp) | equipment-scene | Added |

Contact sheets: [reports/phase4/scene-contact-sheet-1.jpg](D:/csp-coach/csp-coach/reports/phase4/scene-contact-sheet-1.jpg), [reports/phase4/scene-contact-sheet-2.jpg](D:/csp-coach/csp-coach/reports/phase4/scene-contact-sheet-2.jpg), [reports/phase4/scene-contact-sheet-3.jpg](D:/csp-coach/csp-coach/reports/phase4/scene-contact-sheet-3.jpg).

**Interaction, accessibility and responsiveness**

Numbered overlays and external callout cards select the same scene element and update the existing generic details panel. Scene/Mechanism/Health Effects modes remain available. Physical landmark buttons identify every supplied worker, equipment, source and process point without adding overlapping text to the artwork. Selecting a landmark clears the previous hazard callout; switching hazards clears scene selection.

Markers retain 44-pixel targets with automatically separated positions and connectors anchored at their actual target regions. Native buttons support click, tap, Enter, Space, arrow keys and Home/End; visible focus, pressed states, live descriptions, dashed/solid shape distinctions and reduced-motion CSS remain intact. Arabic callouts align RTL while the physical scene stays LTR. Rail rows now size to their content so bilingual names and controlled IDs do not overlap.

Browser checks at 1536 × 1000 confirmed the three-column layout, readable machinery/ladder scenes, selected trajectories and generic panel updates. At 390 × 844, Arabic mode showed a 321-pixel scene, 44-pixel targets, a single callout column and no document horizontal overflow. Keyboard Enter selected a scene marker and updated the generic panel. Both-language rail rows were checked for content clipping after the row-height correction. All 52 records additionally render in English, Arabic and Both through automated component tests.

**Standards resolution**

110 supplied references were checked against existing catalog citations. **Two reference occurrences resolve** to the existing `1910-147` registry ID:

| Hazard | Supplied number | Supplied scope | Supplied relation |
| --- | --- | --- | --- |
| HL-MACH-012 | 1910.147 | general-industry | general-related |
| HL-MAT-007 | 1910.147 | general-industry | general-related |

**108 reference occurrences remain unresolved, covering 38 unique numbers/families.** No fake IDs, new catalog entries or duplicate regulatory text were created. Unresolved numbers remain searchable and appear in the generic mapping-status disclosure; Standards links receive only resolved catalog IDs. Where there are none, the existing catalog opens with the existing unmapped notice.

Unresolved numbers/families: `1910.140`, `1910.176`, `1910.178`, `1910.179`, `1910.184`, `1910.212`, `1910.215`, `1910.219`, `1910.22`, `1910.23`, `1910.242`, `1910.243`, `1910.25`, `1910.27`, `1910.28`, `1910.29`, `1910.303`, `1910.304`, `1910.305`, `1910.333`, `1910.334`, `1910.335`, `1910.67`, `1926 Subpart CC`, `1926.1052`, `1926.1053`, `1926.251`, `1926.404`, `1926.405`, `1926.416`, `1926.441`, `1926.451`, `1926.453`, `1926.454`, `1926.501`, `1926.502`, `1926.555`, `1926.602`.

Full per-hazard mapping, including scope and relation: [reports/phase4/standards-audit.json](D:/csp-coach/csp-coach/reports/phase4/standards-audit.json).

**Practice integration and search**

Supplied Practice tags are passed unchanged to the existing Practice filtering mechanism. No questions or IDs were synthesized. Current catalog matches exist for **45 of 52 records**. These seven currently have no matching questions for their supplied tags: `HL-MACH-003`, `HL-MACH-004`, `HL-MACH-006`, `HL-MACH-007`, `HL-MACH-009`, `HL-MACH-010`, `HL-MACH-011`. The existing empty-result behavior remains available. Per-record tags and counts: [reports/phase4/practice-audit.json](D:/csp-coach/csp-coach/reports/phase4/practice-audit.json).

The existing `hazardSearchText` and global search index were extended, not replaced. All 95 records share name/Arabic/category/subcategory/mechanism/consequence/high-risk-work/control/body-system/exposure-route search. Phase 4 adds supplied Practice tags, work-context slugs and standard numbers, including unresolved references. Global results target each canonical hazard ID.

**Save and migration**

No saved-state migration is required. The original OH and `ref-*` IDs retain their `hazard:<id>` notebook entries, notes and timestamps. Controlled records use their exact supplied `HL-*` IDs in that same save mechanism. Original source-table fields and reverse body-system filtering are unchanged.

**Tests and validation**

Added **63 Phase 4 tests**: package checksum/counts/IDs; exact content and provenance preservation; taxonomy; genuine standards resolution and unresolved behavior; template/engine reuse; asset size; anchored/spaced markers; common/global search; existing Practice objects; legacy OH/reference identity; 52 per-record English/Arabic/Both rendering and overlay/landmark-selection cases; generic-panel source/mapping/controls; Standards and Practice navigation; save compatibility; subcategory/language/keyboard behavior. Existing Library tests were updated for the expanded 95-record catalog and multi-record keyword matches while retaining their original regression checks.

| Validation | Result |
| --- | --- |
| Changed-file ESLint | **PASS — zero errors/warnings** |
| Full `pnpm lint` | **16 pre-existing errors; zero new errors** |
| `pnpm exec tsc --noEmit` | **Two pre-existing errors; zero new errors** |
| `pnpm test` | **PASS — 211 tests, zero failures**; includes the actual production-build prerequisite |
| Explicit `pnpm build` | **PASS** |
| `git diff --check` | **PASS**; existing LF/CRLF normalization warnings only |

Final logs: [reports/phase4/changed-lint.log](D:/csp-coach/csp-coach/reports/phase4/changed-lint.log), [reports/phase4/full-lint.log](D:/csp-coach/csp-coach/reports/phase4/full-lint.log), [reports/phase4/typecheck.log](D:/csp-coach/csp-coach/reports/phase4/typecheck.log), [reports/phase4/tests.log](D:/csp-coach/csp-coach/reports/phase4/tests.log), [reports/phase4/build.log](D:/csp-coach/csp-coach/reports/phase4/build.log).

**Pre-existing failures (unchanged from the Phase 3 report)**

- Full lint: 16 errors in `.agents/skills/brand/scripts/*.cjs` and `.agents/skills/design-system/scripts/*.cjs`, consisting of disallowed CommonJS imports and one unused variable.
- Typecheck: `app/KeyInformation.tsx:50` retains the flatMap/literal-boolean inference error; `app/practice-v2/page.tsx:6` still omits required system/onSystem props.
- Build warnings: the existing large-chunk warning and Vinext route-classification notice remain.

**New failures introduced by Phase 4: zero.**

**Known limitations**

- The current standards catalog cannot resolve the 108 references listed above. Resolution does not determine legal applicability, and this import does not claim independent OSHA or Yates content verification beyond preserving the supplied metadata.
- Seven records have no current Practice matches; topical matching is not a newly curated question family.
- Artwork uses fixed physical arrangements with configurable overlays. Substantially different equipment layouts or protection arrangements may require a reusable template variant. These are educational illustrations, not simulations or work instructions; no regulatory numerical values or calculated distances/energies were added.
- The source supplies overlay/marker tokens but no separately authored per-overlay safety explanations. Callouts therefore display the unchanged controlled record summary as explicitly labeled record context. Illustration emphasis is not a risk ranking. No extra safety content was invented to fill these fields.
- Approximate page ranges and indirect/supplemented source status remain as supplied. Raw English source metadata and work-context slugs are retained alongside bilingual interface labels.
- Browser visual checks sampled the new worker/equipment artwork and Arabic mobile behavior; all 24 base assets were visually reviewed on contact sheets, and all 52 records were exercised by component tests. A full manual device/screen-reader matrix was not performed.

**Stopped after Phase 4. Phase 5 was not started.**
