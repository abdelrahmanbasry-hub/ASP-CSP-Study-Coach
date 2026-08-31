**Phase 4.1 — Canonical record and standards integration cleanup**

Completed Phase 4.1 only. No Phase 5 content, standards entries, Practice questions, new visual engines or replacement artwork were added.

**Duplicate reconciliation and compatibility**

| Old reference ID | Canonical visible ID | Approved scene reused |
| --- | --- | --- |
| `ref-arc-flash` | `HL-ELEC-001` | `HAZARD_SCENES.arc` / electrical-panel-worker |
| `ref-scaffold-fall` | `HL-FALL-007` | `HAZARD_SCENES.scaffold` / scaffold-worker |
| `ref-forklift-tip-over` | `HL-MAT-004` | `HAZARD_SCENES.forklift` / forklift-warehouse |

The visible Library and global search index contain only the canonical HL records for these three hazards. The canonical record names, summaries, mechanisms, consequences, controls, supplied tags, section references, source metadata and controlled import IDs remain unchanged. Their visualization fields reuse the exact approved Phase 3 scene objects, preserving their assets, geometry, callouts, role states and interactions. The original Phase 4 visualization tokens remain in the controlled JSON/import metadata. Original reference objects remain available internally for scene provenance and compatibility; they are not visible Library rows.

The compatibility method is **non-destructive ID aliases**, not an eager storage rewrite:

- Lookups and old search/deep-link IDs resolve to the canonical HL record.
- The canonical Save button recognizes both `hazard:<HL-id>` and its `hazard:<ref-id>` key. Existing legacy saves therefore appear Saved and do not create a second entry.
- Existing notebook entries, notes, titles, timestamps and storage keys are retained unchanged. There is no state-version migration and no read of private live notebook contents was needed.
- New saves, including calls made with an old ref ID, use the canonical HL key.
- Only an explicit Unsave removes matching canonical/legacy keys. When both keys already exist, their separately saved notes remain untouched until that action; they are not silently merged or overwritten.
- Legacy notebook note editing and cross-version persisted/synced ref keys continue to work through the alias-aware Save lookup. Separately existing notebook cards remain historical saved entries; duplicate removal applies to the visible hazard catalog/search, not destructive deduplication of personal notes.

**Visible catalog counts**

| Group | Before | After |
| --- | ---: | ---: |
| Occupational Health | 37 | 37 |
| Controlled Phase 4 records | 52 | 52 |
| Visible Phase 3 references | 6 | 3 |
| **Visible total** | **95** | **92** |
| Electrical category | 11 | 10 |
| Falls & Work at Height category | 15 | 14 |
| Machinery & Tools category | 14 | 14 |
| Material Handling category | 15 | 14 |

The remaining visible references are Oxygen-Deficient Confined Space, Unexpected Startup / LOTO and Radiation Exposure. All 52 HL records and all 37 original Occupational Health records remain available. All 30 scene assets, including the 24 Phase 4 additions, remain untouched.

**Standards inspection and resolution**

Inspected `app/standardsData.ts`, its `StandardRecord` schema, the Standards Explorer consumer, existing resolver, package scripts and repository import scripts. The standards catalog is a manually defined array of six genuine registry records. It has no parent/subpart records, no vetted section-membership metadata and no Federal OSHA source-import mechanism. The Practice importer is a different pipeline and is not a standards importer.

| Resolution classification | Finding |
| --- | --- |
| A — Different formatting of existing entries | The two 1910.147 occurrences already resolve. No additional supplied sections exist under alternate catalog IDs. |
| B — Safe parent/subpart coverage | No applicable parent/subpart records exist. No membership or numeric-range inference was introduced. |
| C — Genuinely absent from this catalog | 108 occurrences covering 38 unique section/subpart references remain missing. |

| Phase 4 standard-reference occurrences | Before | After |
| --- | ---: | ---: |
| Resolved | 2 | 2 |
| Unresolved | 108 | 108 |
| Total | 110 | 110 |

The existing `1910-147` registry ID still resolves the supplied `1910.147` references for `HL-MACH-012` and `HL-MAT-007`; both retain `general-industry` scope and `general-related` relation.

The resolver now accepts exact dot/dash and CFR/section formatting, including `1910.178`, `1910-178`, `29 CFR 1910.178`, `29 C.F.R. § 1910.178` and named subpart formatting. It preserves paragraph case, rejects other CFR titles, ranges and appended prose, and does not use fuzzy titles, topic matching or numeric prefixes. Parseable catalog citations are authoritative over conflicting IDs. Duplicate registry matches remain unresolved as ambiguous.

A supplied paragraph reference can resolve to its most specific genuine catalog ancestor, with `matchMethod: parent-section`. Named subparts resolve only through exact named-subpart entries. Membership of a section in a subpart is never inferred. These parent/subpart behaviors are tested with isolated fixtures; no fixture IDs were added to the real catalog.

Every supplied section number, scope and relation remains on the hazard record even when unresolved. Related OSHA Standards receives only genuine resolved registry IDs. No regulatory text or new catalog entries were created.

Machine-readable missing-standards report: [reports/phase4.1/missing-standards.json](D:/csp-coach/csp-coach/reports/phase4.1/missing-standards.json). It contains the inspected catalog, counts, resolved entries and each missing reference with affected hazard IDs, supplied numbers, scope, relation and reason.

Regenerate from the current catalog with:

```powershell
node --experimental-strip-types scripts/report-hazard-standards.mjs
```

Still missing: `1910.140`, `1910.176`, `1910.178`, `1910.179`, `1910.184`, `1910.212`, `1910.215`, `1910.219`, `1910.22`, `1910.23`, `1910.242`, `1910.243`, `1910.25`, `1910.27`, `1910.28`, `1910.29`, `1910.303`, `1910.304`, `1910.305`, `1910.333`, `1910.334`, `1910.335`, `1910.67`, `1926 Subpart CC`, `1926.1052`, `1926.1053`, `1926.251`, `1926.404`, `1926.405`, `1926.416`, `1926.441`, `1926.451`, `1926.453`, `1926.454`, `1926.501`, `1926.502`, `1926.555`, `1926.602`.

**Practice alias audit**

The existing Practice question schema uses concept/chapter/stem/source vocabulary rather than a separate machinery tag registry. Two spelling aliases are backed by existing question wording:

| Supplied tag | Exact phrase | Record newly matched | Existing questions matched |
| --- | --- | --- | ---: |
| `pinch-point` | pinch point | `HL-MACH-003` | 4 |
| `portable-tool` | portable tool | `HL-MACH-011` | 1 |

Aliases require a complete contiguous phrase in the concept, chapter or stem. Source-location mentions alone do not activate them. Supplied hazard tags were not edited. No broad synonyms such as machinery → machine guarding, nip point → pinch point, or circular saw → circular duct were added. A cutting-point mention in a silica question and a power-tool source mention associated with a bench grinder were rejected as insufficient matches for the currently unmatched hazard contexts.

Records with current Practice matches increased from **45 to 47**; unmatched records decreased from **seven to five**:

| Record | Hazard |
| --- | --- |
| `HL-MACH-004` | Rotating Shaft / Entanglement |
| `HL-MACH-006` | Shear / Cutting Point |
| `HL-MACH-007` | Ejected Material / Flying Object |
| `HL-MACH-009` | Circular-Saw Hazard |
| `HL-MACH-010` | Hand-Tool Misuse / Failure |

The existing empty-result behavior remains for these five. No questions, question IDs or question content changed. Detailed tags and matching existing question IDs: [reports/phase4.1/practice-audit.json](D:/csp-coach/csp-coach/reports/phase4.1/practice-audit.json).

**Regression tests and validation**

Added 15 integration tests covering the 92-record visible catalog; exact reference/canonical aliases; unchanged controlled fields and exact Phase 3 scene reuse; canonical global and Library search destinations; legacy and dual-key saves; serialized reloads; explicit Unsave and canonical new saves; stale bookmark callers; dot/dash/CFR/subpart normalization; paragraph ancestry; foreign-title, prefix and ambiguity rejection; machine-readable gap reporting; and evidence-backed Practice aliases with negative cases.

Updated the earlier Library/Phase 4 tests for canonical destinations and the intentional approved-scene reuse while retaining controlled JSON integrity checks, all 52 record/language rendering tests, body-system regression tests, accessibility, responsive CSS and existing scene-mode tests.

| Validation | Result |
| --- | --- |
| Changed-file ESLint | **PASS — zero errors/warnings** |
| Full `pnpm lint` | **16 pre-existing errors; zero new errors** |
| `pnpm exec tsc --noEmit` | **Two pre-existing errors; zero new errors** |
| `pnpm test` | **PASS — 226 tests, zero failures**, including the actual production-build prerequisite |
| Explicit `pnpm build` | **PASS** |
| `git diff --check` | **PASS**, existing LF/CRLF notices only |

Browser verification confirmed 92 visible records and no retired duplicate IDs. Searching `ref-arc-flash` returned only `HL-ELEC-001` with the approved Arc Flash scene. At 390 × 844 in Arabic, that canonical result remained usable with no horizontal page overflow, RTL callouts, no English scene spans and unchanged LTR physical artwork.

Pre-existing failures are unchanged from Phase 4: 16 CommonJS/unused-variable lint errors in `.agents/skills/brand/scripts` and `.agents/skills/design-system/scripts`; the flatMap/literal-boolean inference error in `app/KeyInformation.tsx:50`; and missing required props in `app/practice-v2/page.tsx:6`. Existing large-bundle and Vinext route-classification build notices remain. **Phase 4.1 introduced zero new validation failures.**

Logs: [reports/phase4.1/changed-lint.log](D:/csp-coach/csp-coach/reports/phase4.1/changed-lint.log), [reports/phase4.1/full-lint.log](D:/csp-coach/csp-coach/reports/phase4.1/full-lint.log), [reports/phase4.1/typecheck.log](D:/csp-coach/csp-coach/reports/phase4.1/typecheck.log), [reports/phase4.1/tests.log](D:/csp-coach/csp-coach/reports/phase4.1/tests.log), [reports/phase4.1/build.log](D:/csp-coach/csp-coach/reports/phase4.1/build.log).

**Files added**

- [app/hazardAliases.ts](D:/csp-coach/csp-coach/app/hazardAliases.ts)
- [app/practiceTagAliases.ts](D:/csp-coach/csp-coach/app/practiceTagAliases.ts)
- [scripts/report-hazard-standards.mjs](D:/csp-coach/csp-coach/scripts/report-hazard-standards.mjs)
- [tests/phase41-integrations.test.mjs](D:/csp-coach/csp-coach/tests/phase41-integrations.test.mjs)

**Files modified from Phase 4**

- [app/hazardLibraryData.ts](D:/csp-coach/csp-coach/app/hazardLibraryData.ts)
- [app/hazardExplorer.ts](D:/csp-coach/csp-coach/app/hazardExplorer.ts)
- [app/hazardStandardReferences.ts](D:/csp-coach/csp-coach/app/hazardStandardReferences.ts)
- [app/hazardTypes.ts](D:/csp-coach/csp-coach/app/hazardTypes.ts)
- [app/practiceV2.ts](D:/csp-coach/csp-coach/app/practiceV2.ts)
- [app/StudySystem.tsx](D:/csp-coach/csp-coach/app/StudySystem.tsx)
- [app/hazard-library/HazardsLibrary.tsx](D:/csp-coach/csp-coach/app/hazard-library/HazardsLibrary.tsx)
- [tests/hazard-library.test.mjs](D:/csp-coach/csp-coach/tests/hazard-library.test.mjs)
- [tests/phase4-hazards.test.mjs](D:/csp-coach/csp-coach/tests/phase4-hazards.test.mjs)

Controlled dataset/package files, body-system data/components, approved scene definitions/assets, the six actual standards catalog entries, Practice questions and dependency files were not changed. Prior unrelated workspace changes were retained.

**Stopped after Phase 4.1. Phase 5 was not started.**
