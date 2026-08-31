FINAL IMPLEMENTATION — COMBINE PHASES 5 THROUGH 9

Phase 1–4 architecture and visual language are approved.

This is the final controlled Hazard Library population and integration run.

ATTACH / USE:
- final-hazard-master-dataset.json
- phase5-hazard-master-dataset.json
- phase6-hazard-master-dataset.json
- phase7-hazard-master-dataset.json
- phase8-hazard-master-dataset.json
- FINAL-SOURCE-AUTHORITY-NOTES.md
- FINAL-QA-REQUIREMENTS.md
- current approved Hazard Library screenshots
- Phase 3/4 visual references if helpful

SOURCE OF TRUTH

`final-hazard-master-dataset.json` is the controlled source of truth for the 131 canonical records being added in this run.

Do not freely invent, merge, split, rename, or rewrite canonical hazard content.

The phase-specific files are provided for auditability and checkpoint validation.

FINAL TARGET

The final visible Hazard Library should contain:

37 existing Occupational Health records
+ 52 Phase 4 canonical records
+ 131 Phase 5–8 canonical records
= 220 visible canonical hazards

There must be no visible Phase 3 prototype/reference duplicates after final reconciliation.

IMPORTANT EXECUTION RULE

Work through the checkpoints below SEQUENTIALLY.

Do not stop and wait for user approval between checkpoints.

At the end of each checkpoint:
1. run the relevant targeted tests;
2. verify counts/IDs;
3. fix any new failure before continuing.

If a genuine repository blocker prevents safe continuation, stop and report the blocker instead of improvising.

==================================================
CHECKPOINT 0 — PRE-FINAL CATALOG CLEANUP
==================================================

Inspect the current repo before changing anything.

If Phase 4.1 cleanup has already been completed, preserve it.

If it has NOT been completed, reconcile these Phase 3 prototypes with their existing canonical Phase 4 records:

- Arc Flash -> HL-ELEC-001
- Scaffold Fall -> HL-FALL-007
- Forklift Tip-Over -> HL-MAT-004

Requirements:
- canonical HL-* record remains the visible hazard;
- preserve/reuse approved polished scene assets;
- preserve search/save/note compatibility using a deterministic alias/migration if needed;
- do not show both reference and canonical records;
- do not delete reusable assets.

Also inspect existing Standards normalization and retain any legitimate improvements already made.

==================================================
CHECKPOINT A — PHASE 5 SPECIALIZED HIGH-RISK
==================================================

Import exactly:

- Excavation & Trenching: 8
- Confined Spaces: 9
- LOTO / Hazardous Energy: 10
- Pressure / Hydraulic / Pneumatic: 8

Total: 35.

Reuse existing engines.

Expected reusable visual direction:
- excavation-trench
- confined-space-vessel
- loto-energy-machine
- pressure-vessel-hose

Canonicalize:
- old Oxygen-Deficient Confined Space reference -> HL-CONF-001
- old Unexpected Startup / LOTO reference -> HL-LOTO-001

Preserve their approved Phase 3 scenes and interactions.

Do not leave duplicate visible records.

Validate Phase 5 count: 35.

==================================================
CHECKPOINT B — PHASE 6 CHEMICAL / FIRE / PROCESS
==================================================

Import exactly:

- Chemical & HazMat: 15
- Fire & Explosion: 12
- Process Safety: 10

Total: 37.

Use the dataset engine/template assignments.

Prioritize reuse of:
- chemical-process-containment
- chemical-storage
- fire-process-area
- combustible-dust-process
- hot-work-worker
- pressure-vessel-hose
- forklift-battery-charging
- fire-protection-system
- fire-extinguisher-use

Do not create one image or component per hazard.

PROCESS SAFETY

Use the existing process-diagram architecture.

1910.119 mappings are conditional on covered processes.
Do not display PSM as a universal requirement for every chemical operation.

Preserve source qualifiers:
- direct
- indirect
- supplemented

Validate Phase 6 count: 37.

==================================================
CHECKPOINT C — PHASE 7 EXPOSURE / HUMAN FACTORS
==================================================

Import exactly:

- Ergonomics / Human Factors: 12
- Noise: 8
- Thermal Stress: 10
- Radiation: 11

Total: 41.

Reuse / create polished reusable templates such as:
- ergonomic-worker-lift
- ergonomic-workstation
- noise-source-worker
- thermal-worker-environment
- radiation-source-shield-worker
- laser-worker

ERGONOMICS

Do not invent a hazard-specific Federal OSHA ergonomics standard where one does not exist.

NOISE

Use genuine registry mappings for 1910.95 / applicable construction references when available.

THERMAL STRESS

OSHA's Heat Injury and Illness Prevention rule remains a PROPOSED rule as of the package verification date.

Do NOT:
- create a fake final heat-standard ID;
- present the proposal as an enforceable final Federal OSHA standard.

RADIATION

Populate all 11 canonical radiation records.

The old Phase 3 `Radiation Exposure` record is a broad educational prototype.

After the RAD family is available:
- remove that old reference from the VISIBLE catalog;
- retain/reuse its polished scene/template/assets;
- do NOT arbitrarily alias it to Gamma, X-ray, or another single subtype.

If old saved-state compatibility is needed:
- use a hidden legacy compatibility mechanism that does not appear in category counts/search results;
- preserve notes without misleadingly changing the hazard meaning.

Validate Phase 7 count: 41.

==================================================
CHECKPOINT D — PHASE 8 ENVIRONMENTAL / SECURITY
==================================================

Import exactly:

- Environmental: 10
- Security / Emergency: 8

Total: 18.

Recommended reusable templates:
- environmental-release-pathways
- chemical-storage
- chemical-process-containment
- facility-security-scene
- emergency-response-scene

ENVIRONMENTAL

Environmental statutes/regulations are primarily EPA/state authority.

Do not force:
- RCRA
- Clean Air Act
- Clean Water Act
- FIFRA
- UST requirements
or other EPA topics into an OSHA-only standards registry.

Keep the OSHA-related standards field empty where the dataset intentionally provides no OSHA mapping.

SECURITY

Do not invent hazard-specific Federal OSHA standards for:
- workplace violence
- active attack
- unauthorized access
- general site security

Use 1910.38 only where the emergency-action-plan relationship is genuine.

Validate Phase 8 count: 18.

==================================================
CHECKPOINT E — CANONICALIZATION / FINAL COUNTS
==================================================

Audit all legacy reference hazards.

Final visible catalog must not contain duplicate Phase 3 prototype entries for:

- Arc Flash
- Scaffold Fall
- Forklift Tip-Over
- Oxygen-Deficient Confined Space
- Unexpected Startup / LOTO
- Radiation Exposure

Expected final visible total:

220 canonical hazards.

Do not count hidden compatibility aliases as visible catalog records.

All global-search results must point to canonical records.

All category totals must count canonical visible records only.

==================================================
CHECKPOINT F — STANDARDS / PRACTICE / SEARCH / SAVE
==================================================

STANDARDS

Inspect the existing standards registry before adding anything.

For supplied standard numbers:

1. normalize exact formatting differences safely;
2. resolve existing real records;
3. do not use fuzzy legal matching;
4. do not invent IDs;
5. retain unresolved numbers in metadata/search.

If the existing Standards architecture supports verified citation-only additions,
you MAY add missing current Federal OSHA citation records using current OSHA.gov data with:
- deterministic app ID
- exact standard number
- official title
- official source/provenance
- no copied full regulation text

If the architecture does not support this cleanly:
- keep them unresolved;
- report them.

Do not expand an OSHA-only registry into EPA law in this task.

PRACTICE

Use supplied Practice tags.

Do not synthesize new questions.

Deterministic exact aliases are allowed only when semantically equivalent.

Report Practice gaps.

SEARCH

Search all canonical records across:
- English name
- Arabic name
- category/subcategory
- mechanism
- consequences
- high-risk work
- controls
- work contexts
- Practice tags
- standard numbers
- unresolved standards references

Legacy prototype records must not appear as duplicate visible search results.

SAVE / NOTES

Preserve:
- OH saved records
- Phase 3/4 saved records
- notes
- timestamps

Migrate or alias old reference IDs without data loss and without showing duplicate hazards.

==================================================
CHECKPOINT G — PHASE 9 FINAL QA
==================================================

Follow FINAL-QA-REQUIREMENTS.md completely.

This checkpoint adds NO new hazard families.

Final architecture must still use only:

- body-system
- worker-scene
- equipment-scene
- process-diagram
- concept-diagram

Do not introduce a sixth visualization engine.

VISUAL QUALITY

Match the approved Phase 3/4 visual quality.

The final 131-record package references only 21 template names across Phases 5–8.

Do NOT create 131 scene images.

Use:
polished reusable base scene
+
data-driven semantic overlays
+
markers
+
callouts

Avoid:
- crude stick figures
- generic placeholder boxes
- low-quality flowcharts used as final scenes
- baked-in English/Arabic text inside base images

BILINGUAL

Preserve:
- Both
- English
- Arabic
- RTL

Physical scene orientation should not be blindly mirrored for Arabic.

ACCESSIBILITY

Preserve/test:
- keyboard
- Enter/Space
- visible focus
- pressed/selected states
- non-color-only distinctions
- accessible labels/descriptions
- reduced motion
- mobile touch targets
- responsive layout

REGRESSION

Do not regress:
- BodySystemExplorer
- 37 OH records
- reverse body-system filtering
- Toxic/Biological source data
- All Hazards
- category navigation
- More
- search
- Save/notes
- Standards
- Practice
- language modes
- approved Phase 3/4 scenes

VALIDATION

Run:
- changed-file lint
- full lint
- typecheck
- full tests
- production build
- git diff --check

Separate:
PRE-EXISTING FAILURES
from
NEW FAILURES

Required:
ZERO new validation failures.

==================================================
FINAL REPORT
==================================================

Provide one final human-readable report plus machine-readable audit files.

Report:

1. final visible canonical catalog total
2. imported counts for all Phase 5–8 categories
3. legacy references reconciled
4. compatibility aliases/migrations
5. files added
6. files modified
7. visualization templates reused
8. new reusable scene templates/assets
9. asset count and total optimized size
10. standards supplied
11. standards resolved
12. standards unresolved
13. intentionally unmapped/environmental records
14. Practice matches
15. Practice gaps
16. search/index changes
17. Save/notes migration behavior
18. source-support counts:
    - direct
    - indirect
    - supplemented
19. bilingual/RTL checks
20. accessibility checks
21. responsive checks
22. performance checks
23. tests added/updated
24. changed-file lint
25. full lint
26. typecheck
27. tests
28. build
29. git diff --check
30. pre-existing issues
31. remaining known limitations

STOP when the final Phase 9 QA gate is complete.

Do not start any new hazard-family phase after this.
