# ASP/CSP Study Coach — Final Hazard Library Package (Phases 5–9)

This package combines the remaining population phases and final QA.

## New canonical records in this package

- Phase 5: 35
- Phase 6: 37
- Phase 7: 41
- Phase 8: 18
- Total: 131

## Expected final visible catalog

- Existing Occupational Health: 37
- Phase 4 canonical: 52
- Phase 5–8 canonical: 131
- Expected total after reference reconciliation: 220

## Files

- `final-hazard-master-dataset.json` — combined source of truth for all 131 final-population records
- `phase5-hazard-master-dataset.json` — 35 records
- `phase6-hazard-master-dataset.json` — 37 records
- `phase7-hazard-master-dataset.json` — 41 records
- `phase8-hazard-master-dataset.json` — 18 records
- `FINAL-SOURCE-AUTHORITY-NOTES.md` — Yates/current-authority guardrails
- `FINAL-QA-REQUIREMENTS.md` — Phase 9 acceptance gate
- `FINAL-CODEX-PROMPT.md` — ready-to-send implementation prompt
- `MANIFEST.json` — file checksums

## Critical rules

- Do not add a sixth visualization engine.
- Do not create one image/page/component per hazard.
- Do not invent standards IDs or regulatory numbers.
- Preserve source `direct` / `indirect` / `supplemented` distinctions.
- Environmental laws are not forced into an OSHA-only registry.
- OSHA's Heat Injury and Illness Prevention rule is still proposed as of 2026-08-31; do not treat it as a final Federal OSHA standard.
- Final visible catalog target is 220 canonical hazards.
