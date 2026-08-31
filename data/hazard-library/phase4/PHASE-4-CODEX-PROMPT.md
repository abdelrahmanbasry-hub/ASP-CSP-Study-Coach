PHASE 4 — POPULATE CORE PHYSICAL HAZARD FAMILIES

Phase 3 is approved and frozen.

ATTACH:
- current Phase 3 screenshots
- phase4-hazard-master-dataset.json
- phase4-source-authority-notes.md
- optional phase4-hazard-audit.csv

GOAL
Populate exactly:
- Electrical: 10
- Falls & Work at Height: 14
- Machinery & Tools: 14
- Material Handling: 14
Total: 52 records.

SOURCE OF TRUTH
The attached JSON is the controlled content source.
Do not invent, merge, split, rename, or rewrite canonical hazard content.

ARCHITECTURE
Reuse the existing visualization engines:
- body-system
- worker-scene
- equipment-scene
- process-diagram
- concept-diagram

Do not add another engine.
Do not build a bespoke React page/component per hazard.

VISUALS
Use visualization.engine, template, overlays, and markers from the dataset.
You may add polished reusable scene assets/templates required by Phase 4.
Match the approved Phase 3 visual language.
Do not use crude boxes, stick figures, or low-quality schematic art as final scenes.

CONTENT
Use the supplied bilingual:
- name
- summary
- mechanisms
- consequences
- high-risk work
- controls
- work contexts
- search terms
- Practice tags

Do not freely author safety/regulatory content.

STANDARDS
Resolve relatedStandards[].number to the existing standards catalog/registry.
Do not duplicate OSHA text.
Do not invent registry IDs.
If a referenced standard is missing, report it as unresolved and keep the hazard record functional without a fake mapping.
Preserve `relation` distinctions such as direct, related, general-related, or direct-system-criteria where the schema allows.

SOURCE METADATA
Preserve Yates source metadata and `yatesSupport`.
Do not convert indirect/supplemented records into claims of direct Yates wording.

PRACTICE
Use supplied Practice tags to connect/filter the existing Practice system.
Do not duplicate questions.

SEARCH
Ensure all 52 records are searchable by:
- English/Arabic name
- category/subcategory
- mechanism/consequence
- high-risk work
- work context
- controls
- Practice tags
- standard number/reference

SAVED HAZARDS / BILINGUAL / ACCESSIBILITY
Preserve the existing unified save mechanism, Both/English/Arabic modes, RTL, keyboard support, visible focus, non-color-only states, reduced motion, and responsive behavior.

TESTS
Add/update tests for:
- exactly 52 Phase 4 records
- counts 10/14/14/14
- unique IDs
- valid category/subcategory mappings
- valid engine/template mappings
- standards resolution and unresolved behavior without fake IDs
- Practice integration
- search/save/bilingual rendering
- engine reuse
- no regression in Occupational Health or the six Phase 3 references

VALIDATION
Run changed-file lint, full lint, typecheck, tests, and production build.
Separate pre-existing failures from new failures.
Phase 4 must introduce zero new validation failures.

FINAL REPORT
Report files added/modified, imported counts, new reusable scene templates/assets, standards resolved/unresolved, Practice integration, search/index changes, tests, lint/typecheck/test/build results, pre-existing issues, and known limitations.

STOP after Phase 4.
Do not begin Phase 5.
