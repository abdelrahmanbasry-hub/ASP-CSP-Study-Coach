# Body System Explorer — Phase 1.1

## Scope

Visual and interaction refinements to the approved Phase 1 implementation only. No edits to the hazard data model, hazard IDs, source records, category definitions, migration logic, or surrounding Library architecture in this phase. Earlier working-tree changes remain untouched.

## Changes

- Anatomy is approximately 18% larger: at a 1536px viewport, the rendered body width increased from 238.33px to 282.10px (+18.37%). The desktop SVG height increased from 490px to 580px; narrower framing preserves the enlargement when width is constrained. Phone height increased from 470px to 554px.
- Body Systems shows targets and attached callouts without circulation or exposure paths. Exposure Route emphasizes numbered, directional entry arrows against quieter anatomy. Health Effects retains target highlights and connects each target to its effects card.
- System-specific consequences appear within the corresponding target card. Effects shared by multiple targets remain in one clearly labeled source summary; no new medical relationships are inferred.
- Primary targets use strong fills/strokes; secondary targets use softer fills or dashed outlines; inactive targets are muted. Selection adds a dark outline, a double-ring target marker, and a focused connector/card.
- Blood uses eight bilateral, distributed highlights instead of a torso dot or full circulation network. Marrow highlights sit within the sternum, pelvis, and proximal femurs. Whole-body targets use a silhouette highlight. These remain explicitly labeled schematic representations.
- Connector origins are measured from actual rendered target markers. Callouts follow anatomical order to reduce crossing. The legend uses aligned columns, a selected-system key, and a two-column layout in narrow containers.
- The existing stacked mobile layout remains; long connectors remain hidden when callouts move below the anatomy. Region and callout interaction, keyboard navigation, and bilingual labels are preserved.

## Files changed in Phase 1.1

| File | Purpose |
| --- | --- |
| `app/body-explorer/HumanBodySvg.tsx` | Anatomy framing, distributed blood/marrow geometry, route arrows, selected markers |
| `app/body-explorer/anatomyGeometry.ts` | Accurate target anchors and anatomical callout ordering |
| `app/body-explorer/BodySystemExplorer.tsx` | Mode-specific callouts, effect interaction, legend and schematic explanation |
| `app/body-explorer/BodySystemConnectors.tsx` | Rendered-marker origins and selected connector state |
| `app/body-explorer/HealthEffectsView.tsx` | Linked target cards and correctly scoped source effects |
| `app/body-explorer/body-explorer.css` | Scale, contrast, focus, mode emphasis, legend and responsive styling |
| `tests/body-explorer.test.mjs` | Three additional interaction regressions |
| `reports/body-system-explorer-phase-1.1.md` | This change and validation record |

## Validation

| Check | Result |
| --- | --- |
| `pnpm test` | **PASS — 116 tests**, including 20 explorer tests |
| Production build, run by `pnpm test` | **PASS — all five Vinext build stages**; existing warning about chunks over 500kB remains |
| `pnpm exec eslint app/body-explorer tests/body-explorer.test.mjs` | **PASS** |
| `pnpm lint` | **FAIL — 16 existing errors** in `.agents/skills/brand/scripts/*.cjs` and `.agents/skills/design-system/scripts/*.cjs`; no explorer errors |
| `pnpm exec tsc --noEmit` | **FAIL — two existing errors outside this scope**: `app/KeyInformation.tsx:50` (flatMap result inference), `app/practice-v2/page.tsx:6` (missing system/onSystem props) |

Browser checks covered desktop anatomy, blood/marrow distribution, primary/secondary contrast, separate route/effect views, and Arabic-only effects. Layout checks at 320, 390, 768, 1024, and 1536px found no horizontal page overflow or overflowing effect cards. In the desktop Benzene effects view, both connector origins and endpoints measured zero offset from their respective markers/cards.

Regression tests continue to verify all 37 original records and IDs, bilingual content and RTL, all 17 keyboard-operable regions, reverse filtering/reset, Source data table, Save, Related OSHA standards, and Related Practice. The original source-field SHA-256 check passes. New tests cover distributed blood/marrow across modes, preservation of shared versus system-specific effects, and rendering of all four supported route types.

Logs: `tmp/body-explorer-phase11-tests.log`, `tmp/body-explorer-phase11-lint.log`, `tmp/body-explorer-phase11-typecheck.log`, `tmp/body-explorer-phase11-scoped-lint.log`.

No deployment was performed.
