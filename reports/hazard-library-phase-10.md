# Phase 10 — Hazard Library premium UI / UX redesign

Completed 2026-08-31. Scope: UI, routing, interaction, responsive layout and visual polish only. No content-population phase, deployment or commit was performed.

The reference image guided the hierarchy, navy/teal/warm-neutral palette, category strip and three-column workspace. It was not embedded in the application. Frontend-design and UI/UX skill guidance informed the shared visual language, focus states and responsive behavior; the existing application architecture and supplied reference took precedence.

## 1. Top-level Hazards routing

Added `/hazards` as a dedicated destination using the existing AdaptiveCoach shell. Hazards appears after Library, with a forklift icon and `aria-current="page"`. Desktop navigation, the responsive menu and the mobile bottom bar expose the destination. The bottom-bar Hazards shortcut replaces Mastery; Mastery remains accessible through Study.

## 2. Library routing

Library remains independent, containing Flashcards and Formula sheet. The duplicate Hazards sub-tab and mounted Hazard Library were removed. The existing “Retrieve. Apply. Space the review.” hero remains in Library, with its description and record total reflecting only Library content (186 records).

## 3. Old routes, aliases and history

`/library/hazards`, `/?view=library&tab=hazards`, and `/?view=library&libraryTab=hazards` restore through the shared shell and replace the URL with `/hazards`. This is client-side normalization, not an HTTP 301/308.

The URL preserves canonical hazard selection, category, subcategory, search, local filter, saved filter and language. Search typing replaces the current history entry; selections create entries. Back/Forward restores destinations without adding a second entry. Main-navigation, connected-resource and global-search departures remember the last Hazards URL during the current app session.

The five established aliases still resolve to their canonical IDs:

| Legacy ID | Canonical ID |
| --- | --- |
| ref-arc-flash | HL-ELEC-001 |
| ref-scaffold-fall | HL-FALL-007 |
| ref-forklift-tip-over | HL-MAT-004 |
| ref-oxygen-deficient-space | HL-CONF-001 |
| ref-unexpected-startup | HL-LOTO-001 |

The broad legacy Radiation Exposure record stays hidden from normal counts/lists/search while retaining its compatibility and notebook behavior.

## 4. Desktop layout

The workspace retains Explorer / Visualization / Details, with approximate 21% / 49% / 29% column proportions before gaps and minimum widths. The compact 88 px desktop toolbar replaces the Study Library hero only within Hazards. It contains global hazard search, Categories, Saved and the language switch.

## 5. Workspace width

The main workspace uses 92% width, capped at 1680 px. Below 1400 px it uses 95% to preserve the center scene. At 1920 px the measured workspace was 1680 px; at 1366 px it was approximately 1283 px. Mobile uses 10 px outer margins.

## 6. Category landing page

Bare `/hazards` offers an optional 18-category overview with real counts. Choosing a category opens the full study workspace. The Categories button provides a return to the overview; direct hazard URLs and navigation back into a selected hazard do not require going through it.

## 7. Category navigation

Compact, horizontally scrollable semantic-icon navigation replaces large category cards inside the workspace. Counts are computed from canonical records. Selection uses a distinct surface, underline and pressed state. The existing More menu, Arabic labels and keyboard support remain. The active primary category is scrolled into view without scrolling the document. Subcategories are secondary compact chips with real counts.

## 8. Category icon architecture

`hazardCategoryIcons` centralizes all 18 category concepts using the existing Lucide library. One small shared lungs SVG fills a gap in the installed icon set. All category icons are vectors, with consistent size and restrained semantic accents.

## 9. Individual hazard icon architecture

`hazardIcons` and an ordered semantic-family resolver supply reusable icons for related hazards. Examples include forklifts, pedestrian interaction, falling loads, batteries, docks, arc flash, electrical contact, cables, pressure, rescue, noise, temperature and radiation. There are no per-hazard React components or 220 bespoke icons.

## 10. Icon fallbacks

Resolution is explicit icon key / matching hazard family → category icon → neutral icon. Tests cover specific, category and neutral fallback behavior and all canonical records. Standalone icons can expose a label; decorative icons are hidden from assistive technology.

## 11. Hazard Explorer

The rail now has a category heading, canonical total with filtered-result context, compact subcategories, local search, semantic row icons, bilingual names, selected-row styling and notebook Save indicators. Clear filters resets search, subcategory, saved-only and body filters. Saved notes opens the existing notebook. Arrow Up/Down and Home/End move focus through rows; Enter/Space use native button activation.

## 12. Center visualization

The center has a breadcrumb, hazard icon and bilingual title, followed by the existing engine. Artwork keeps its original aspect ratio without critical cropping. On tall desktops, square scene size is bounded by the available column and 56% of viewport height; this keeps the whole scene useful. Approved assets and marker coordinates were not changed.

## 13. Visualization modes

Existing modes are presented as a compact segmented control immediately below the scene. Pressed states, focus outlines and keyboard navigation remain. Mobile browser checks confirmed Dynamics / Event and Health Effects mode changes.

## 14. Markers and callouts

The selected marker retains its ring, shape and semantic role styling. A single prominent bilingual explanation sits above the compact callout list, improving the mobile reading order. The contextual detail-panel callout is retained for compatibility and its related-effects/controls content. Landmark disclosures and configuration notes follow the main interaction area. All six forklift markers measured 44 × 44 px at mobile width.

## 15. Detail panel

The original controlled values now appear under What is it? → How does it happen? → What can happen? → Where is the risk? → How do we control it? Typography and thin separators replace repeated inner cards. Occupational Health retains target-organ data, body-system chips and source-review notes.

## 16. Hierarchy of controls

Added reusable `HazardControls`: five numbered, icon-supported native disclosures for Elimination, Substitution, Engineering, Administrative and PPE. All existing English/Arabic control strings remain exact. No controls were authored for source records that do not supply them.

## 17. Standards

The action is a compact full-width study button. Mapping status and unresolved-reference information remain available. The original `standardIds` payload is unchanged. Browser verification of Forklift Tip-Over correctly opened the existing catalog with its “no mapped IDs” context; no 1910.178 mapping was invented from the reference image.

## 18. Practice

The compact Practice action preserves the original tags/question IDs. The browser check opened the existing Practice destination and displayed its actual matched-topic result (29 existing questions in the tested CSP state), not a fabricated count from the mockup.

## 19. Source / provenance

Controlled provenance remains in expandable sections after the study actions. Yates edition, sections, approximate pages, support status, external basis, package metadata and regulatory verification wording are preserved. Existing disclaimers and source links remain.

## 20. Card/border reduction

Major panels and interactive controls retain boundaries. Explorer rows use subtle separators; mode controls, compact callouts and detail sections use restrained surfaces and typography. There is no nested dashboard-card treatment for each sentence.

## 21. Desktop scrolling

The existing application topbar stays sticky. On desktops at least 1200 px wide and 800 px tall, the Explorer and Details panels use viewport-bounded sticky positioning; the record list and long detail content can scroll. The center remains in normal document flow. Shorter laptop layouts avoid a fixed-height detail scroller. No additional sticky toolbar/category stack was introduced.

## 22. Tablet

Below 1200 px, the workspace becomes a 235 px Explorer beside a larger visualization, with Details below the scene. The shell uses its responsive menu so the eighth destination does not overlap the brand at 1024 px. Tablet screenshot and overflow checks passed.

## 23. Mobile

At approximately 390 px the layout stacks: toolbar/search → scrollable category/subcategory navigation → labelled native hazard selector → title → scene/modes/explanation → details/controls/actions/source. The long desktop record rail is replaced by the selector. Full names remain in the scene heading and selector options. All actions remain reachable, and Hazards has a persistent bottom-navigation shortcut.

## 24. Arabic / RTL

Arabic mode translates application navigation, category navigation, Explorer and detail labels and changes text/layout direction. Both mode keeps bilingual hazard rows and detail content; its compact category/subcategory strip displays English, while Arabic mode displays Arabic. Industrial scenes, body geometry, coordinates and physically meaningful icons remain unmirrored with LTR scene stages. Browser inspection confirmed RTL workspace / LTR scene and no Arabic overflow.

## 25. Accessibility

Preserved native buttons, disclosures, input labels, live scene descriptions and screen-reader scene text. Added/retained visible focus, `aria-pressed`, active-navigation `aria-current`, menu `aria-expanded`, labelled icons and a labelled mobile select. Row/mode/marker keyboard behavior and reduced-motion styling are retained. Selection uses outlines, typography, icons and shape as well as color. This is not a formal WCAG certification or assistive-technology audit.

## 26. Performance

No new bitmap assets, runtime packages, fonts or visualization engines were added. Existing optimized WebPs, lazy image loading, image sizing and responsive overlay geometry remain. Only the selected visualization is mounted by the shared router. No performance benchmark or bundle-size reduction is claimed; the existing large-chunk build warning remains.

## 27. Reusable additions

Added the route normalization helpers, shared semantic icon registry/resolver, `HazardIcon`, `HazardControls`, and scoped premium presentation stylesheet. The overview and subcategory/Explorer presentation are built from the shared canonical catalog.

## 28. Existing components modified

AdaptiveCoach, StudyLibrary, HazardCategoryNavigation, HazardsLibrary and InteractiveHazardScene were updated. The five visualization engine components, dispatcher, canonical datasets, alias table, asset registry and overlay configuration files were not changed.

## 29. Files added

- `app/coachRoutes.ts`
- `app/hazards/page.tsx`
- `app/library/hazards/page.tsx`
- `app/hazard-library/hazardIcons.tsx`
- `app/hazard-library/HazardControls.tsx`
- `app/hazard-library/hazard-premium.css`
- `tests/phase10-hazard-ui.test.mjs`
- This report, `reports/phase10/README.md`, and 13 PNG screenshots in `reports/phase10/`.

## 30. Files modified

- `app/AdaptiveCoach.tsx`
- `app/StudyLibrary.tsx`
- `app/globalSearch.ts`
- `app/globals.css`
- `app/hazard-library/HazardCategoryNavigation.tsx`
- `app/hazard-library/HazardsLibrary.tsx`
- `app/hazard-scenes/InteractiveHazardScene.tsx`
- `tests/body-explorer.test.mjs`
- `tests/hazard-library.test.mjs`
- `tests/phase4-hazards.test.mjs`

## 31. Screenshots and browser QA

See the [screenshot index](phase10/README.md). The requested ten captures cover all five existing engines: equipment (forklift), worker (arc flash), process (confined space and LOTO), concept (radiation), and body-system (Asbestos). Three additional captures show wide desktop, laptop and mobile marker selection.

| Viewport | Document horizontal overflow | Result |
| --- | --- | --- |
| 1920 × 1080 | None | Workspace capped at 1680 px |
| 1440 × 1000 | None | Three columns; English/Both and Arabic reviewed |
| 1366 × 768 | None | Laptop layout and navigation reviewed |
| 1024 × 1000 | None | Two columns with Details below |
| 390 × 844 | None | Stacked layout, native selection, 44 px markers |

Browser checks also covered legacy redirect, canonical selection, independent Library hero/tabs, returning to Hazards, Back/Forward, Standards, Practice, Arabic navigation, marker selection and scene modes. Browser QA used the local production preview, not a remote deployment.

## 32. Tests added / updated

Added 12 Phase 10 tests for navigation/route compatibility, canonical counts, icon coverage/fallback/accessibility, overview selection, global vs category search, Save indicators, row keyboard navigation, editorial/control content, RTL deep links and native mobile selection. Existing search tests now expect the top-level Hazards destination. The body-explorer search test uses the category-local search field, preserving its original category-filter expectation.

## 33. Canonical catalog

220 canonical visible hazards remain, with no visible legacy/prototype duplicates. Canonical content, IDs, Arabic names, controls, source fields and resource mappings were not edited. All 47 registered optimized scene assets and all five engines remain.

| Category | Count |
| --- | ---: |
| Occupational Health | 37 |
| Chemical & HazMat | 15 |
| Electrical | 10 |
| Fire & Explosion | 12 |
| Falls & Work at Height | 14 |
| Machinery & Tools | 14 |
| Material Handling | 14 |
| Ergonomics / Human Factors | 12 |
| Radiation | 11 |
| Confined Spaces | 9 |
| LOTO / Hazardous Energy | 10 |
| Pressure / Hydraulic / Pneumatic | 8 |
| Noise | 8 |
| Thermal Stress | 10 |
| Excavation & Trenching | 8 |
| Process Safety | 10 |
| Environmental | 10 |
| Security / Emergency | 8 |
| Total | 220 |

## 34. Changed-file lint

PASS. ESLint was run against all added/modified TypeScript, TSX and test files (15 files). The final shell-only follow-up was linted again and passed.

## 35. Full lint

`pnpm lint`: FAIL, identical to baseline — 16 pre-existing errors in bundled `.agents/skills/brand/scripts` and `.agents/skills/design-system/scripts`. No new application or test lint errors.

## 36. Typecheck

`pnpm exec tsc --noEmit`: FAIL, identical to baseline — two existing diagnostics in KeyInformation and the standalone Practice V2 route. No new type errors.

## 37. Full tests

`node --experimental-strip-types --test tests/*.test.mjs`: PASS — 385 tests, 0 failures, 0 skipped. Baseline was 373 passing tests; Phase 10 adds 12. Existing catalog, engine, geometry, source qualifiers, notes/aliases, body reverse filtering, Standards and Practice regression coverage remains passing.

## 38. Production build

`pnpm build`: PASS. Both `/hazards` and `/library/hazards` are included in the built route table. Existing warnings about chunks over 500 kB and vinext static route classification remain.

## 39. Diff integrity

`git diff --check`: PASS. Git emits repository line-ending conversion notices on Windows; these are not whitespace errors. No canonical data, approved asset, source package or overlay geometry changes are in the diff.

## 40. Pre-existing issues

- Full lint: 15 forbidden CommonJS `require()` imports plus one unused variable across seven skill utility scripts.
- `app/KeyInformation.tsx:50`: `flatMap` inference fixes `titleMatches` to literal `false`, conflicting with other boolean results.
- `app/practice-v2/page.tsx:6`: the standalone component invocation is missing required `system` and `onSystem` props.
- Build warnings: existing large client chunks and vinext route classification limitations.

These unrelated problems were recorded before coding and intentionally left unchanged. Phase 10 introduces zero new validation failures.

## 41. Known limitations and handoff

- Legacy route normalization runs after the client shell starts; there is no server HTTP redirect.
- The URL restores navigation/filter/language/record state, not transient marker selection, body-region selection, open disclosures or visualization mode. Those reset when a workspace remounts.
- Remembering the last Hazards destination applies within the running app session; a fresh bare `/hazards` visit opens the optional overview.
- Long bilingual controlled content still requires scrolling. Native mobile selectors may shorten the closed display of long option text, but the full hazard heading and option labels remain available.
- Some hazards intentionally share a category/family icon, and long secondary category sets remain behind More. No new authored hazard content or mappings were added to match mockup text.
- QA was performed in the available Chromium-based in-app browser at the listed viewports; no Safari/Firefox matrix, physical-device test, manual screen-reader audit or measured performance benchmark was performed.
- The local production preview runs at `http://localhost:3002/hazards`; no site was published, and no commit was made. Phase 10 stops here.
