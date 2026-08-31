# Hazard Library — Phase 2 completion report

## Result and scope

The Library now uses configured navigation, a canonical hazard catalog, shared search, a visualization router, and reference-based Standards/Practice connections. The approved Body System Explorer remains the working body-system engine. Its geometry, modes, target mappings, and styling were not redesigned in this phase.

There are **42 catalog records: the original 37 occupational-health records and exactly five architecture references**. No full hazard families, final scenes, new standards text, or new Practice questions were authored. No deployment or Phase 3 work was performed.

## Repository inspection

The original Library, explorer wrapper, and source table were embedded in `app/StudyLibrary.tsx`. Source data and body mappings lived in `hazardData.ts`, `hazardMigration.ts`, and `bodySystems.ts`; reusable body UI lived in `app/body-explorer/`.

Local filtering was in `hazardExplorer.ts`; the source table also used an independent JSON-string search. Global search used `globalSearch.ts`, whose normalization discarded Arabic. Saved items already shared `BookmarkAction` and the `StudySystemState.notebook` map with keys such as `hazard:tox-benzene`.

Standards used the six-record `OSHA_STANDARDS` catalog and `StandardsExplorer`. Connected navigation was dropping Standards queries. Practice used the existing imported question catalog, but its view ignored topic-only connections. Both connection paths were corrected without duplicating their content.

## Files added

| File | Purpose |
| --- | --- |
| `app/hazardCategories.ts` | Bilingual category/subcategory configuration, navigation placement, defaults, source-table capability |
| `app/hazardTypes.ts` | Canonical record, controls, visualization configuration, resource-reference types |
| `app/hazardLibraryData.ts` | Lossless occupational adapter, five reference records, catalog lookup and validation |
| `app/searchText.ts` | Shared normalization and matching that preserve Arabic |
| `app/hazard-library/HazardsLibrary.tsx` | Shared Library shell, category/subcategory selection, record rail/detail, source table, Save and connections |
| `app/hazard-library/HazardCategoryNavigation.tsx` | Configured navigation, keyboard controls, More disclosure, RTL |
| `app/hazard-library/HazardVisualization.tsx` | Body-engine routing and four clearly labeled placeholder engines |
| `app/hazard-library/hazard-library.css` | Scoped navigation, reference states, responsive layouts and bilingual alignment |
| `tests/hazard-library.test.mjs` | Fourteen architecture and integration regressions |
| `reports/hazard-library-phase-2.md` | This report |

## Files modified

- `app/StudyLibrary.tsx`: delegates Hazards to the new shell; forwards canonical item IDs; updates the catalog count and description.
- `app/hazardData.ts`: names the existing source/body shape `OccupationalHealthRecord` and re-exports the canonical `HazardRecord` type. Original rows and IDs are unchanged.
- `app/hazardMigration.ts`: type-name update only; original mapping rules are unchanged.
- `app/hazardExplorer.ts`: extends the existing filter to canonical records and retains the legacy calling signature; exports searchable hazard text for global search.
- `app/globalSearch.ts`: indexes the canonical catalog using the same field projection and Arabic-preserving normalization; carries reference metadata in navigation targets.
- `app/AdaptiveCoach.tsx`: preserves Standards targets and forwards IDs/tags and the requested Library tab through connected navigation.
- `app/StudySystem.tsx`: resolves standard IDs from the existing catalog, supports return links to Hazards, uses the canonical catalog for resource counts, and adds optional Arabic labels to the existing Save button.
- `app/practiceV2.ts`: filters existing questions by referenced topic terms or IDs.
- `app/PracticeV2View.tsx`: applies those references, shows matched/empty states, and allows returning to all Practice.
- `app/body-explorer/BodySystemExplorer.tsx`, `BodySystemCallouts.tsx`, `HumanBodySvg.tsx`, `HealthEffectsView.tsx`, and `ExposureRouteView.tsx`: type-name updates only.
- `tests/body-explorer.test.mjs`: distinguishes hazard-record buttons from empty-state actions and verifies structured reference payloads alongside the existing link queries.

Pre-existing calculator and other working-tree changes were retained. This phase did not change dependencies, persisted-state schemas, `app/globals.css`, or the approved anatomy CSS/geometry.

## Data model and migration

The canonical `HazardRecord` contains stable `id`, configured `categoryId`/`subcategoryId`, bilingual `name`/`summary`, mechanisms, consequences, high-risk work, all five hierarchy-of-controls fields, visualization configuration, work-context tags, related standard IDs, related Practice tags/question IDs, source metadata, and English/Arabic search terms.

Each adapted occupational record retains the original object at `visualization.occupationalHealth`. This preserves the exact seven source-table fields, original source metadata, target roles, effects provenance, route-review notes, and hazard IDs. General consumers use `HazardRecord`; body/source consumers use `OccupationalHealthRecord`. The legacy `HAZARD_RECORDS` export remains the original 37-record set; `HAZARD_LIBRARY_RECORDS` is the canonical 42-record catalog.

No storage migration is required. All categories use the existing `hazard:<id>` notebook keys and Save implementation. Existing notes and timestamps are preserved; no saved entries are rewritten during adaptation.

Navigation contains All Hazards, nine primary categories, and nine categories under More. Subcategories, labels, placement, and defaults are configuration-driven. Categories without content remain usable empty states. The source table remains occupational-health-only and keeps its independent filters while preserving the explorer selection.

## Tests and validation

| Command/check | Result |
| --- | --- |
| `pnpm test` | **PASS: 130 tests**, including all 20 Body Explorer regressions and 14 new Phase 2 tests |
| `pnpm build` | **PASS**, run explicitly after final implementation; all Vinext build stages completed |
| `pnpm lint` | **FAIL: 16 pre-existing errors** in `.agents/skills/brand/scripts/*.cjs` and `.agents/skills/design-system/scripts/*.cjs` |
| `pnpm exec tsc --noEmit` | **FAIL: two pre-existing errors** outside the Phase 2 implementation: `app/KeyInformation.tsx:50` (flatMap inference) and `app/practice-v2/page.tsx:6` (missing system/onSystem props) |
| Scoped ESLint on changed implementation and regression tests | **PASS** |

The new tests cover category/subcategory selection, all 42 records, all five visualization types, honest placeholder states, original-object identity, source-table preservation, search across common/category/body/route/control/standard fields, Arabic global search, ID-based navigation, saved-note compatibility, language switching, Standards resolution and return navigation, Practice topic/ID resolution, keyboard/RTL navigation, and responsive navigation rules. The existing original-source SHA-256 regression still passes.

Browser checks at 320, 390, 768, 1024, and 1536px found no horizontal page overflow. The category strip scrolls internally and More remains reachable. The mobile More panel stays above the bottom navigation; its last Arabic category was selected successfully. Real navigation opened LOTO's existing `1910.147` record and 25 existing forklift-related questions. Arabic global search for `رافعة شوكية` opened Forklift Tip-Over in the equipment placeholder engine.

Validation logs are in `tmp/hazard-phase2-lint.log`, `tmp/hazard-phase2-typecheck.log`, `tmp/hazard-phase2-tests.log`, `tmp/hazard-phase2-build.log`, and `tmp/hazard-phase2-scoped-lint.log`.

## Known limitations

- Worker, equipment, process, and concept engines are placeholders only. Arc Flash, Scaffold Fall, Forklift Tip-Over, Oxygen-Deficient Confined Space, and Unexpected Startup / LOTO contain architecture metadata, not completed study content or safety procedures.
- Controls and other unauthored fields intentionally remain empty. Empty means not authored, not that no control is needed.
- Standards references are limited to IDs already in the six-record catalog. Arc Flash, Scaffold Fall, and Forklift Tip-Over have no mapped standard IDs yet and explicitly open the catalog. Occupational links to Hazard Communication/Respiratory Protection are study-topic connections, not legal applicability determinations.
- Practice topic references match existing concept, chapter, stem, and source terms. They are topical associations rather than a curated hazard-specific question set; missing matches produce an explicit empty state.
- Search remains client-side. No new backend, full hazard population, or database migration was introduced.
- The production build retains its existing large-chunk warning and Vinext route-classification notice. Repository-wide lint/typecheck cannot be reported as passing until the unrelated failures above are fixed.
