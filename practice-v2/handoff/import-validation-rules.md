# Practice V2 content import rules

Use schema version 3 and run `pnpm practice:v2:import <question-file.json>`.
The importer validates the complete pack and writes nothing to the imported
catalog when any item fails. It preserves accepted JSON wording exactly.

Questions are chapter-first. `chapterId` and `chapterTitle` are the catalog and
session keys. Do not add top-level `credential`, `blueprintVersion`,
`primaryObjectiveId`, or `secondaryObjectiveIds` fields. Store exam relevance
only in `examAlignments` and nested `blueprintMappings`. One canonical question
may align with ASP, CSP, or both; do not duplicate it into credential banks.

## Status policy

- `unverified` is accepted for development intake but hidden in production.
- `source-checked` is reserved for `ai-assisted` questions and is displayed as
  **Source-checked · AI-assisted**.
- `human-reviewed` is reserved for `human-authored` questions. It is never
  inferred from source checking.
- Verified questions require `reviewStatus: "ready"`, an exact source title,
  an explicit chapter/page/section/regulation location, a valid blueprint
  objective, a valid keyed answer, explanations for all four options, passed
  content validation, and a passed duplicate/similarity check.
- Calculation questions require non-empty `formula` and `units` values. Use a
  truthful value such as `dimensionless` when a calculation has no physical unit.

Question IDs must be unique within the file and across all imported packs. The
importer also rejects normalized stem similarity at or above 0.90, both within
the submitted pack and against previously imported packs.
Options must be four unique non-empty strings. The correct option's slot in
`incorrectOptionExplanations` is `null`; the other three slots are required.
No imported content is used by Mock Exams or readiness calculations.
