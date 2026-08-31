# Body System Explorer — Phase 1

Completed 2026-08-31. Scope: the existing Library explorer only. No new hazard categories or medical content, no saved-state migration, and no public deployment.

## Result

- One interactive, reusable SVG with 17 stable typed regions: brain/nervous system, eyes, ears, upper respiratory tract, respiratory system, lungs, heart/cardiovascular, blood/hematopoietic system, bone marrow, liver, kidneys, gastrointestinal system, skin/mucosa, musculoskeletal, reproductive, immune/lymphatic, and whole body.
- The selected record drives highlights. Asbestos highlights lungs; benzene highlights blood and bone marrow. The unsupported additional targets in the design mockups were not added.
- Body Systems, Exposure Route, and Health Effects modes share the same anatomy.
- Reverse exploration filters the current category by an organ/system, including secondary targets. Clear filter restores results; an unlisted system produces an explicit empty state.
- Bilingual labels stay outside the SVG. Arabic content has RTL direction. SVG regions have accessible names, pressed states, keyboard focus, Enter/Space activation, and linked callouts. Mode tabs support arrow keys, Home, and End.
- Desktop retains three columns. Tablet uses two columns plus the details below. Narrow containers stack anatomy and callouts, and mobile stacks all panels.
- Search, both categories, the original source table, Save, Related OSHA standards, Related Practice, and language controls remain available. Switching to the table and back now preserves the explorer's selection and language.

## Files changed by this task

| File | Change |
| --- | --- |
| `app/StudyLibrary.tsx` | Integrate the new explorer, filtering, bilingual record list, review status, and retained view state. |
| `app/bodySystems.ts` | Typed region registry, bilingual system/route labels, target roles and review types. |
| `app/hazardMigration.ts` | Conservative migration from the existing source vocabulary and verbatim effect excerpts. |
| `app/hazardData.ts` | Extend records, migrate all source rows, validate target IDs, effects, routes, and review flags. |
| `app/hazardExplorer.ts` | Shared filtering, selection-role lookup, language and mode types. |
| `app/visualLearning.ts` | Preserve compatibility exports, deriving mappings from records instead of a second manually maintained map. |
| `app/body-explorer/BodySystemExplorer.tsx` | Compose modes, filter status/reset, legend, body-system index, and source interpretation note. |
| `app/body-explorer/HumanBodySvg.tsx` | Reusable interactive vector anatomy, target markers, focus states, and route arrows. |
| `app/body-explorer/BodySystemCallouts.tsx` | Bilingual primary/secondary callouts synchronized with hover/focus. |
| `app/body-explorer/ExposureRouteView.tsx` | Supported pathways and original transmission wording, including review notes. |
| `app/body-explorer/HealthEffectsView.tsx` | Original grouped effects and source-backed secondary excerpts. |
| `app/body-explorer/Bilingual.tsx` | Shared bilingual rendering and accessible labels. |
| `app/body-explorer/body-explorer.css` | Scoped colors, SVG states, layout, responsiveness, and reduced-motion support. |
| `app/VisualLearningPanel.tsx` | Removed the obsolete figure after replacing its only consumer. |
| `tests/body-explorer.test.mjs` | 17 migration, component-interaction, compatibility, and responsive-style regressions. |
| `tests/helpers/register-tsx.mjs` | Real TSX loading for the existing Node test runner, including actual local eager JSON fixtures. |
| `package.json`, `pnpm-lock.yaml` | Add `happy-dom` as a development-only dependency for component interactions. |
| `reports/body-system-explorer-phase-1.md` | This handoff report. |

The pre-existing changes to AdaptiveCoach, HomeworkHub, PracticeV2View, StudySystem, globals.css, ScientificCalculator, and the calculator tests were not edited or reverted by this task.

## Data model and migration

All **37 records** migrated: **18 toxicological** and **19 biological**. Original IDs, source rows, categories, bilingual fields, and medical wording are preserved. A regression test checks a SHA-256 of all original fields against the pre-migration records.

New fields:

```ts
targets: {
  systemId: BodySystemId;
  role: "primary" | "secondary";
  effects: { en: string; ar: string };
  effectsScope: "source-row" | "system";
  sourceField: "targetOrganSystem" | "mainConsequences";
}[];
exposureRoutes: ("inhalation" | "ingestion" | "dermal-absorption" | "percutaneous")[];
mappingReview: { field: "targets" | "exposureRoutes"; reason: { en: string; ar: string } }[];
```

“Primary” means named in the source target column. “Secondary” means explicitly mentioned in the existing effects field. This is a source-provenance convention, not a newly authored clinical severity ranking. The interface explains this convention.

The primary targets are mapped using the source's explicit anatomical terms. Three records also use verbatim consequence excerpts for secondary targets: cadmium (respiratory), formaldehyde (eyes), and lead (reproductive). Broad respiratory wording stays broad; it is not silently converted to lungs or upper airways. Lymphatic wording maps to the explicitly labeled immune/lymphatic region, rather than blood.

The original source often combines effects across multiple organs. Those effects remain grouped and marked `source-row`, rather than inventing an effect-by-organ attribution. Contact is not automatically classified as dermal absorption. Blood exposure is not treated as a blood target or a definite percutaneous route.

## Records needing review

**0 unmapped target-organ fields. 11 records have ambiguous or partially mapped exposure/transmission wording.** They are preserved and visibly flagged. Explicit supported routes can still be displayed alongside the review flag.

| Record ID | Name | Original exposure/transmission |
| --- | --- | --- |
| `bio-anthrax` | Anthrax | Inhalation, skin contact, or ingestion of spores |
| `bio-brucellosis` | Brucellosis | Animal contact or dairy exposure |
| `bio-leptospirosis` | Leptospirosis | Contact with contaminated water or urine |
| `bio-plague` | Plague | Flea bites or contact with infected animals |
| `bio-tularemia` | Tularemia | Ticks, animals, or contaminated dust |
| `bio-hepatitis-b` | Hepatitis B | Blood or body-fluid exposure |
| `bio-orf` | Orf | Direct animal or contaminated-material contact |
| `bio-rabies` | Rabies | Animal bite or saliva contacting broken skin or mucosa |
| `bio-candidiasis` | Candidiasis | Contact or endogenous overgrowth |
| `tox-hexavalent-chromium` | Hexavalent chromium | Inhalation or skin contact |
| `tox-cobalt` | Cobalt | Inhalation or skin contact |

## Validation

Environment: Node 24.19.0, pnpm 11.19.0.

| Check | Result |
| --- | --- |
| `pnpm test` | **PASS: 113 tests**, 0 failures. This command also executes the actual production build first. |
| Production `pnpm run build` (invoked by `pnpm test`) | **PASS.** Existing large-client-chunk warning remains. |
| `pnpm lint` | **FAIL: 16 errors** in existing `.agents/skills/brand/scripts/*.cjs` and `.agents/skills/design-system/scripts/*.cjs` (CommonJS imports and one unused variable). |
| ESLint on all changed application/test JS and TS files | **PASS.** |
| `pnpm exec tsc --noEmit` | **FAIL: 2 unrelated errors**, detailed below. No new explorer diagnostics. |
| `git diff --check` | **PASS.** Git emitted only line-ending normalization warnings. |

TypeScript errors left outside Phase 1 scope:

- `app/KeyInformation.tsx:50`: the `flatMap` callback infers incompatible literal `false` and boolean return shapes.
- `app/practice-v2/page.tsx:6`: the standalone route does not supply the existing required `system` and `onSystem` props to PracticeV2.

The 17 new tests cover migration counts/types; original-field preservation; ambiguous mapping and unknown targets; all four route types; asbestos versus benzene on the same SVG; primary versus secondary roles; reverse filtering and reset; empty results; all 17 keyboard regions; mode changes and tab focus; English/Arabic/Both; bilingual system search; biological hazards and route review; source-table state preservation; saved IDs and related-link queries; and responsive/focus/reduced-motion CSS.

Real in-app browser checks additionally confirmed:

- Different asbestos and benzene target patterns, keyboard kidney filtering, filter clearing, and exposure/effects modes.
- Arabic-only content has no English content nodes inside the explorer; all Arabic content computes to RTL.
- 375px mobile, 820px tablet, and 1536px desktop viewports have no horizontal document overflow. Mobile anatomy/callouts stack; tablet and desktop retain their intended grid structures.
- SVG vessel and marrow paths render as strokes, not accidentally filled polygons.
- No browser console errors were observed. Temporary viewport overrides were reset, and the local preview remains available at `http://localhost:3001/`.

## Limits and handoff

- Schematic, non-diagnostic anatomy; distributed systems use representative locations. It is intentionally not a photorealistic copy of the reference images.
- Only source-backed targets and entry pathways are shown. The 11 exposure reviews require source clarification before adding more pathways.
- Source-row effects remain grouped where the original record does not support precise organ-specific attribution.
- No broader Hazard Library expansion was started.
- The public deployment was not changed. The Sites hosting workflow requires approval before publishing to this site's existing public access; this task leaves a reviewable local implementation.

## Reference-fidelity refinement

Follow-up to the user's visual feedback:

- Replaced the flat gray appearance with shared translucent anatomy, softly colored organs, a more detailed skeletal/muscle underlay, and finer organ contours. Added `app/body-explorer/AnatomyStructure.tsx`.
- Added organ-specific presentation colors in `app/body-explorer/anatomyGeometry.ts`: respiratory targets use green and blood/marrow use purple. No hazard facts or target relationships changed.
- Added `app/body-explorer/BodySystemConnectors.tsx`. Connectors use the SVG screen transform and rendered card bounds, update with ResizeObserver, and stay attached when dimensions or language change. Browser measurement confirmed zero endpoint displacement for both benzene callouts.
- Ordered callouts by primary/secondary role and vertical anatomical position to avoid crossed connectors. Hover/focus emphasizes the corresponding organ, pin, connector, and callout.
- Moved mode controls beneath the anatomy, tightened the heading, and aligned the bilingual labels under their corresponding English labels in Both mode.
- Added regression coverage for callout order, matching target anchors/colors, linked keyboard focus, and the below-figure mode-control placement. 17 explorer tests and 113 repository tests pass.
- Mobile (375px) stacks anatomy and callouts without drawing long crossing connectors; tablet (820px) and desktop (1536px) retain their intended layout. No horizontal overflow was observed.
- Changed-file lint passes. The same two unrelated TypeScript errors remain.

The SVG is intentionally simplified and is not an exact reproduction of the detailed medical illustration in the mockups.
