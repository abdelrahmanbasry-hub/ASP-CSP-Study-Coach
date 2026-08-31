# Phase 9 — Final Integration and QA Requirements

Phase 9 adds no new hazard family content.

## A. Canonical catalog integrity

Required final visible catalog:
- 37 Occupational Health records
- 52 Phase 4 canonical records
- 131 Phase 5–8 canonical records
- 0 visible Phase 3 prototype duplicates
- expected total: 220 canonical visible hazards

Audit:
- duplicate concepts
- duplicate IDs
- near-duplicate display names
- stale `ref-*` search results
- stale saved-state targets
- orphaned standards/practice links
- hidden legacy compatibility records accidentally appearing in category totals

## B. Visualization architecture

There must still be exactly the established engine family:
- body-system
- worker-scene
- equipment-scene
- process-diagram
- concept-diagram

Do not introduce a sixth engine to solve one family.

Audit:
- all canonical records route to a valid engine;
- every referenced template is registered;
- every overlay/marker token has valid geometry/labels;
- geometry is keyed by template/semantic element, not by hazard ID;
- approved Phase 3 scenes remain visually intact when reused;
- no hazard falls back to crude placeholder art in the production Library.

## C. Visual reuse / performance

The 131 final-phase records currently reference 21 template names, many of which are already available or should be reusable.

Do not create 131 image files.

Review:
- template reuse ratios;
- asset dimensions and WebP/optimized formats where appropriate;
- lazy loading;
- responsive overlay coordinates;
- no layout shift caused by oversized images;
- no hidden original PNGs shipped unnecessarily if the repo policy does not need them;
- no text baked into illustrations where bilingual/RTL labels must change dynamically.

## D. Search

Search must cover:
- English name
- Arabic name
- category/subcategory
- mechanism
- consequence
- high-risk work
- controls
- work contexts
- standards numbers including unresolved references
- Practice tags

Audit that canonical IDs are the search targets and legacy reference IDs do not appear as visible duplicate results.

## E. Save / notes / migration

Audit:
- existing saved OH records
- existing Phase 3/4 saved records
- migrated canonical Arc Flash / Scaffold / Forklift / Confined Space / LOTO
- Radiation legacy handling
- notes/timestamps
- no duplicate notebook entries after migration
- no data loss when an old ID is encountered

## F. Standards

Produce:
- total supplied standard-reference occurrences;
- exact resolved occurrences;
- unresolved occurrences;
- unique unresolved sections/families;
- intentionally unmapped records;
- false-match test cases.

Do not treat unresolved mappings as implementation failures if the registry genuinely lacks the standard.

If the existing Standards architecture supports verified citation-only records, missing current Federal OSHA sections may be added with:
- deterministic app ID
- section number
- official title
- official source URL/provenance
- no copied full regulation text

Otherwise leave unresolved and report them.

Environmental EPA topics should remain outside an OSHA-only registry unless the project has intentionally expanded the Standards model beyond OSHA.

## G. Practice

Do not synthesize questions in this phase.

Report:
- hazards with exact/alias Practice matches;
- hazards with no Practice matches;
- deterministic aliases added;
- aliases rejected as ambiguous.

Practice gaps are content-backlog items, not a reason to fabricate questions.

## H. Bilingual / RTL

For every canonical record, test:
- Both
- English
- Arabic

Audit:
- Arabic text wrapping;
- RTL callouts/panels;
- physical scenes remain logically oriented and are not blindly mirrored;
- technical IDs do not overlap bilingual names;
- long Arabic labels do not cover critical scene regions.

## I. Accessibility

Audit:
- keyboard
- Enter/Space
- arrows/Home/End where used
- visible focus
- pressed/selected states
- non-color-only distinction
- meaningful labels
- live descriptions where appropriate
- reduced motion
- touch target sizes
- contrast
- screen-reader description of critical scene meaning

## J. Responsive

Test at minimum:
- wide desktop
- laptop/tablet width
- approximately 390 px mobile width

Check:
- no document horizontal overflow;
- visualization remains readable;
- callouts stack cleanly;
- rail names/IDs do not clip;
- detail panel remains usable;
- category navigation remains reachable.

## K. Regression

Must preserve:
- BodySystemExplorer
- 37 Occupational Health source records
- body-system reverse filtering
- Toxic / Biological source-table behavior
- All Hazards
- category navigation / More
- global search
- Save / notes
- Standards
- Practice
- language modes
- existing approved Phase 3/4 scenes

## L. Validation gate

Run:
- changed-file lint
- full lint
- typecheck
- full tests
- production build
- git diff --check

Clearly distinguish:
- pre-existing failures
- new failures

Required:
- zero new validation failures.

## M. Final audit report

Produce machine-readable audit files for:
- canonical catalog counts
- duplicate/reconciliation results
- standards resolution
- Practice coverage
- scene-template coverage
- source-support counts
- accessibility/component-test coverage

Also produce one human-readable final report.
