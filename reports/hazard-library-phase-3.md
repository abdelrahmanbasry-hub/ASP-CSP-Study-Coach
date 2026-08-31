# Hazard Library — Phase 3 completion report

## 1. Architecture summary

Phase 3 implements four reusable engines over one shared renderer. A hazard's visualization configuration chooses an engine and a template, then supplies semantic points, role states, shapes, paths, bilingual callouts, energy types and optional effect/control context. No component branches on a hazard ID.

The hybrid renderer combines optimized, text-free industrial illustrations with responsive SVG geometry and native HTML buttons. Long labels stay outside the artwork. The existing generic Library details panel receives the selected callout without replacing the page or creating hazard-specific panels.

The approved BodySystemExplorer, original occupational records, source table and body mappings were not modified. No additional hazard families, Phase 4 work, deployment, new standards records or Practice questions were created.

## 2. Files added

- `app/hazardSceneData.ts` — six scene configurations, semantic overlays and bilingual descriptions.
- `app/hazardReferenceData.ts` — six bounded reference records and source-backed study summaries.
- `app/hazard-scenes/InteractiveHazardScene.tsx` — shared artwork, geometry, markers, callouts, modes and selection.
- `app/hazard-scenes/WorkerHazardScene.tsx`
- `app/hazard-scenes/EquipmentHazardScene.tsx`
- `app/hazard-scenes/ProcessHazardDiagram.tsx`
- `app/hazard-scenes/ConceptVisualization.tsx`
- `app/hazard-scenes/sceneTemplates.ts` — template/asset/engine registry.
- `app/hazard-scenes/sceneLabels.ts` — bilingual engine, role and energy labels.
- `app/hazard-scenes/hazard-scenes.css` — scoped visual states, responsive layouts and reduced motion.
- `tests/hazard-scenes.test.mjs` — 18 new regression tests.
- `reports/hazard-scene-assets.json` — complete generation prompts, original output paths and project asset paths.
- `reports/hazard-library-phase-3.md` — this report.
- Six WebP assets listed below.

## 3. Files modified

- `app/hazardTypes.ts` — implemented-scene union, semantic overlay/point/shape contracts, energy types, optional callout consequences/controls and notes. Existing body and future-placeholder variants remain supported.
- `app/hazardCategories.ts` — configured Ionizing radiation subcategory.
- `app/hazardLibraryData.ts` — imports the reference records; validates template/engine compatibility, overlay IDs, bilingual text and coordinates.
- `app/hazardExplorer.ts` — extends the same search projection with bilingual scene callout labels/descriptions.
- `app/globalSearch.ts` — labels non-occupational scene records correctly.
- `app/hazard-library/HazardsLibrary.tsx` — scoped callout selection, generic details integration, source links, reference-scene count and labels.
- `app/hazard-library/HazardVisualization.tsx` — routes implemented configurations to the four engines and resets scene state when records change.
- `tests/hazard-library.test.mjs` — updates Phase 2 placeholder assumptions to the implemented six-reference catalog while preserving architecture regressions.

All earlier working-tree changes were retained. No dependencies, persisted-state schema, body-engine files, original source rows, standards text or Practice question files were changed in this phase.

## 4. Scene/image assets

All six project assets are 1200 × 1200 WebP images, generated with the built-in image_gen tool and optimized for the application. Together they total **646,598 bytes (about 631 KiB)**. Only the selected scene is rendered; images specify intrinsic dimensions, lazy loading and asynchronous decoding.

| Asset under `public/hazard-scenes/` | Bytes |
| --- | ---: |
| `electrical-panel-worker.webp` | 119,972 |
| `scaffold-worker.webp` | 84,892 |
| `forklift-warehouse.webp` | 117,374 |
| `confined-space-vessel.webp` | 137,600 |
| `loto-energy-machine.webp` | 106,168 |
| `radiation-source-shield-worker.webp` | 80,592 |

The final prompt set and output provenance are preserved in [hazard-scene-assets.json](hazard-scene-assets.json). Prompts request professional industrial proportions, navy/teal/amber/gray materials, restrained backgrounds and no baked-in labels, arrows, numbered cards or hazard zones. These generated illustrations are educational references, not engineering specifications or approved work procedures.

## 5. Reusable components

`WorkerHazardScene`, `EquipmentHazardScene`, `ProcessHazardDiagram` and `ConceptVisualization` are the four public engine entry points. They share `InteractiveHazardScene` so keyboard behavior, bilingual rendering, focus states and geometry stay consistent. The router chooses an entry point from the configured engine kind; the template registry chooses physical artwork.

## 6–7. Templates and reference hazards

| Hazard | Stable ID | Engine | Template |
| --- | --- | --- | --- |
| Arc Flash | `ref-arc-flash` | worker-scene | electrical-panel-worker |
| Scaffold Fall | `ref-scaffold-fall` | worker-scene | scaffold-worker |
| Forklift Tip-Over | `ref-forklift-tip-over` | equipment-scene | forklift-warehouse |
| Oxygen-Deficient Confined Space | `ref-oxygen-deficient-space` | process-diagram | confined-space-vessel |
| Unexpected Startup / LOTO | `ref-unexpected-startup` | process-diagram | loto-energy-machine |
| Radiation Exposure | `ref-radiation-exposure` | concept-diagram | radiation-source-shield-worker |

The catalog now has **43 records: 37 unchanged occupational-health records and six reference scenes**. Arc Flash moves from the old concept placeholder to the worker engine; the confined-space reference moves from the worker placeholder to the process engine.

## 8. Interaction model

- Click/tap a numbered scene point, external card, or concept principle to select it.
- Selection emphasizes the corresponding geometry, marker and card, and populates a shared section in the existing details panel.
- Select again or use Clear selection to clear focus. Switching hazards resets scene selection and mode.
- Scene, mechanism/path, and health-effect modes adjust emphasis. Process connections remain visible in the base process view. Effects distinguish hazard-level consequences from specifically authored callout context.
- Configured inactive overlays remain muted and do not activate hazard geometry when selected; their explanations remain available.
- Every offset marker has a connector beginning at its actual configured target point in the artwork coordinate plane.
- TIME, DISTANCE and SHIELDING have directly selectable principle cards above the radiation illustration.
- Potential LOTO energy connections are explicitly distinguished from energized status or verified isolation.
- Control points and protection principles are labeled separately from hazard roles.

## 9. Accessibility and responsive work

Markers, callouts, modes and principles use native buttons with pressed states and visible focus. Enter/Space activate selection; arrow keys and Home/End move within groups. Explicit activation also supports hosts that forward keyboard events without native browser defaults.

Images have meaningful bilingual descriptions. Callout text remains usable when an image fails to load. Numbering, text labels, shape changes, solid/dashed borders and focus outlines supplement color.

Both/English/Arabic apply to scene text, descriptions, labels and callouts. Arabic cards align RTL while the physical scene remains LTR. Layout uses a fixed 1000 × 1000 coordinate plane scaled with the artwork; no equipment mirroring is applied.

Desktop retains the existing three-column Library layout. Narrow screens retain readable artwork and stack external callout cards. All markers provide 44 × 44 px targets. Live checks at 320 px confirmed all six scenes have no horizontal page overflow, clipped targets or overlapping hit areas. Two close marker pairs were repositioned and covered by regression tests.

The stylesheet disables transitions/animation under reduced motion. Scenes do not contain looping or autoplay animations.

Live visual checks covered all six illustrations, Arc Flash keyboard selection, radiation principle selection, process flow/ventilation alignment, and Arabic rendering at phone width. Additional viewport checks retained the existing navigation behavior.

## 10. Tests added/updated

`tests/hazard-scenes.test.mjs` adds **18 tests**, including:

- Each of the six hazards through its public engine.
- Routing, record-switch resets and returning to the body engine.
- Reusing a template with a new fixture record/overlay instead of hazard-ID logic.
- Marker/card selection, connector origins and generic details integration.
- Mode changes, effect context and inactive overlays.
- Direct radiation principle selection.
- All engines in English, Arabic and Both; fixed physical direction.
- Keyboard activation and focus navigation.
- Search for callout concepts and controls.
- Existing Standards/Practice reference payloads.
- Invalid templates, duplicate overlay IDs and invalid coordinates.
- Asset sizes/formats, missing-image fallback, responsive CSS and reduced-motion rules.
- Minimum-screen 44px target separation.

The updated Phase 2 tests continue covering All Hazards, categories/subcategories, More, source-table preservation, reverse body filtering, search, saved-note compatibility, language switching and Standards/Practice destinations. All 20 original Body Explorer regressions pass, including the unchanged original-source hash.

## 11–15. Validation

| Check | Result |
| --- | --- |
| Changed-file ESLint | **PASS** |
| `pnpm lint` | **16 pre-existing errors; zero new errors** |
| `pnpm exec tsc --noEmit` | **Two pre-existing errors; zero new errors** |
| `pnpm test` | **PASS — 148 tests**; includes the repository's production-build prerequisite |
| `pnpm build` | **PASS**, also run explicitly |
| `git diff --check` | **PASS**; Git prints existing LF/CRLF normalization notices |

Logs: `tmp/hazard-phase3-scoped-lint.log`, `tmp/hazard-phase3-lint.log`, `tmp/hazard-phase3-typecheck.log`, `tmp/hazard-phase3-tests.log`, `tmp/hazard-phase3-build.log`.

## 16. Pre-existing issues

- Full lint: 16 errors in `.agents/skills/brand/scripts/*.cjs` and `.agents/skills/design-system/scripts/*.cjs`, involving CommonJS imports and one unused variable.
- Typecheck: `app/KeyInformation.tsx:50` has the prior flatMap/literal-boolean inference error; `app/practice-v2/page.tsx:6` omits required system/onSystem props.
- Build: existing large-chunk warning and Vinext route-classification notice remain.

These match the Phase 2 baseline. Phase 3 introduces **zero new lint, typecheck, test or build failures**.

## 17. Limitations and migration notes

- These are six educational reference scenes, not a complete hazard library, physical simulation, site-specific risk assessment or work procedure. Geometry does not calculate incident energy, fall distances, clearances, dose or regulatory thresholds.
- The base illustrations have fixed physical layouts. Future substantially different scaffold protection, loads, equipment or process arrangements may need a template variant; semantic overlays and callouts can already be configured independently.
- The slope/edge overlay is present but inactive for the forklift reference. Future scenarios can configure it without creating a new page.
- The schema supports electrical, mechanical, hydraulic, pneumatic, thermal, gravity, chemical/process, atmospheric and radiation energy labels. Only the requested reference scenarios are authored.
- Controls contain concise supported examples. Unauthored hierarchy levels remain empty and are identified as not authored; empty does not mean no control is necessary.
- Standards references remain limited to the existing six-record catalog. Confined Space and LOTO use existing IDs. Arc Flash, Scaffold Fall, Forklift Tip-Over and Radiation have no mapped IDs yet and explicitly open the existing catalog. OSHA source links provide provenance without duplicating regulatory text.
- Practice links continue to reference existing tags/IDs. Topical matching is not a newly curated question family.
- No saved-state migration is needed. The original 37 IDs and five Phase 2 reference IDs are unchanged; all categories still use `hazard:<id>` notebook keys. Existing notes and timestamps are preserved. Radiation adds one new ID only.
- No body/source data migration, architecture replacement, new dependency, publication or Phase 4 work was performed.

**Stopped after Phase 3.**
