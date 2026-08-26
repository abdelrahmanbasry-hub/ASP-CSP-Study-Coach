# ASP + CSP // Coach

An original dual-track adaptive study coach for the current BCSP ASP11 and
CSP11 public blueprints. It provides weighted 20-question drills, 200-question
simulations, confidence and pace tracking, evidence-first adaptive selection,
weak-domain prioritization, delayed block rationales, and local progress
persistence. Generated difficulty metadata is presented only as a provisional
authoring level and is a low-weight selection tie-breaker.

Each credential has a 1,200-item bank: 800 adaptive-practice items plus two
sealed 200-item mock forms. Practice and mock pools are isolated, and the app
records first exposure so a repeated form is not presented as a clean readiness
measure.

## Prerequisites

- Node.js `>=22.13.0`

## Dependency build-script policy

pnpm lifecycle scripts are denied unless `pnpm-workspace.yaml` names the
package explicitly. This repository allows only:

- `esbuild`: required by the locked Vite, Wrangler, Drizzle, and TSX toolchain;
  its postinstall selects and validates the matching platform binary.
- `workerd`: required by the locked Cloudflare/Miniflare toolchain; its
  postinstall selects and validates the matching platform binary.

`sharp` is explicitly denied. It is present transitively through Miniflare, but
this application does not use its source-build install hook in the standard
install, lint, type-check, test, or production-build paths. Review this allowlist
whenever the lockfile changes; do not approve all dependency scripts globally.

## Blueprint content traceability

The versioned registry in `app/blueprintRegistry.ts` records every addressable
ASP11 and CSP11 objective from the official `V.2024.04.24` publications. Stable
IDs use `ASP11-A1.01` / `CSP11-D1.01`; lettered source sub-objectives retain both
their own IDs (for example, `ASP11-A2.08a`) and an exact parent-objective link.
Every objective belongs to exactly one versioned domain.

Item mappings are an additive overlay in `app/blueprintMapping.ts`; question-bank
records and saved learner progress are not migrated or rewritten. Each overlay
record contains the credential, blueprint version, primary objective ID,
secondary objective IDs, mapping status, item family ID, source-review status,
and technical-review status. Mapping status is one of `unmapped`, `suggested`,
`reviewed`, or `rejected`.

Automated mappings are structurally restricted to `suggested`. A mapping counts
as reviewed coverage only after a human changes its provenance to `human` and
both its source and technical reviews are `reviewed`. Suggested, rejected,
invalid, and unmapped records never count as proven mastery coverage. At present,
only the existing explicit ASP A1 objective tags are imported as suggestions;
all other items remain unmapped and continue to work normally.

Generate the machine-readable report with:

```bash
pnpm blueprint:coverage
```

The output is `reports/blueprint-coverage.json`. During local development,
`/internal/blueprint-coverage` renders the same audit as a browser
table. The route returns only an unavailable notice in production builds.

## Human item-review workflow

`app/itemReview.ts` defines the additive review record and immutable version
history used to move an item from suggestion to reviewed operational content.
The record keeps blueprint mapping, cognitive level, exact source fields,
answer/distractor/calculation/technical/assessment-writing gates, reviewer
identity, notes, issues, and operational status separate from question content.
All 2,400 existing items begin at version 1 with only `unreviewed` or
`suggested` states.

Controlled changes to the stem, options, keyed answer, rationale, formula,
units, exact source, item family, or objective mapping create a new version.
Previous snapshots and their review records remain available, while the new
version resets approval fields. New learner attempts record the immutable item
version served; older attempts safely resolve to version 1 without rewriting
saved history.

During local development, `/internal/item-review` provides filtering, a
priority queue, item and related-family inspection, exact-source entry, mapping
approval or rejection, review gates, issue flags, notes, immutable-version
creation, and a validated operational action. Review changes persist only under
the separate `asp-csp-item-review-workflow-v1` browser key and can be exported
as JSON. The route returns only an unavailable notice in production.

Generate the baseline review report with:

```bash
pnpm review:report
```

The output is `reports/item-review-report.json`. Generated mappings and family
relationships are candidates only. A confirmed human reviewer and review date
are required for review actions, and operational status cannot be assigned
without all source, answer, technical, version, calculation, and mock-specific
gates passing.

## Quick Start

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
```

## Practice V2 foundation

Practice V2 is a separate, additive question system. Its imported packs live in
`practice-v2/imported`, use the versioned schema at
`practice-v2/schema/practice-v2-question-pack.schema.json`, and store browser
progress only under `asp-csp-practice-v2-progress-v1`. It does not write to the
Homework, legacy Practice, Mock Exam, readiness, authentication, or cloud-sync
models.

Schema version 3 is chapter-first. Each question records its immutable ID and
version, chapter, exam alignments, nested blueprint mappings, concept, item
family, item and cognitive types, exact stem and four options,
the keyed option, correct-answer explanation, one explanation slot per option,
source fields, optional formula and units, operational review status, separate
verification status, authoring origin, content-validation status, and
duplicate/similarity-check status. The correct
option's `incorrectOptionExplanations` slot must be `null`; all three incorrect
slots must be non-empty.

There is no learner-facing ASP/CSP selector and no top-level question
`credential`, `blueprintVersion`, `primaryObjectiveId`, or
`secondaryObjectiveIds`. `chapterId` and `chapterTitle` drive cataloging,
filtering, session construction, and new attempt metadata. A single canonical
question may align to ASP, CSP, or both through `examAlignments` and one nested
`blueprintMappings` record per applicable blueprint. Questions are never copied
into separate credential banks. Practice V2 continues to read the version 1
progress record and its existing question-ID history.

Import a Practice V2 JSON pack with:

```bash
pnpm practice:v2:import <question-file.json>
```

The importer accepts only `schemaVersion: 3`, parses and validates the entire file, checks duplicate question
IDs both within the pack and across all prior imports, and requires valid ASP11
or CSP11 objective ownership. Demo packs may contain only unverified demo
items; content packs cannot contain demo items. Any error rejects the complete
file without copying any questions. Successful imports preserve the supplied JSON text
exactly; the importer never edits, rewrites, or generates question content.
Every attempt writes `reports/practice-v2-import-report.json` with imported,
rejected, duplicate, and error details.

The two records in `practice-v2/demo/demo-questions.json` are visibly marked
structural placeholders. They are available only in local development and are
not approved study content.

Verification is independent of operational review status. Its allowed values
are `unverified`, `source-checked`, and `human-reviewed`; authoring origin is
`human-authored`, `ai-assisted`, or `imported`. AI-assisted production content
must be labeled `source-checked`, never `human-reviewed`. The interface displays
it as **Source-checked · AI-assisted** and includes this disclosure:

> These practice questions were checked against cited study and regulatory
> sources. They are not official BCSP questions and have not necessarily been
> reviewed by an instructor.

A source-checked question enters the production catalog only when its ASP11 or
CSP11 objective is valid, its exact source title and chapter, page, section, or
regulation location are present, it has exactly one valid keyed answer and
feedback for all four options, calculation metadata is complete when applicable,
and both content-validation and duplicate/similarity gates are `passed`.
Human-reviewed content must meet the same technical gates. Unverified questions
remain hidden in production. Verified Practice V2 questions can be selected in
chapter, multi-chapter, and Mistake Review modes, but their separate progress
never contributes to Mock Exam readiness or the Practice Readiness Indicator.
They are not represented as psychometrically calibrated. In production,
`/practice-v2` remains a Coming soon page until eligible content exists.

For a manual local preview, run `pnpm dev`, open `/practice-v2`, select ASP or
CSP, choose the demo chapter, and answer its placeholder. Verify immediate
correct and distractor feedback, then intentionally answer with High confidence
to populate Mistake Review. Clear only the
`asp-csp-practice-v2-progress-v1` browser key to reset this preview.

The content-author handoff bundle is generated and checked in at
`practice-v2/handoff/PRACTICE_V2_CONTENT_HANDOFF.zip`.

Progress is stored in the browser. All scenarios and deterministic variants are
original and are not copied from BCSP, Pocket Prep, or the supplied books. The
product is not affiliated with or endorsed by BCSP or Pocket Prep. Items have
not been psychometrically field-calibrated. The Practice Readiness Indicator is
a coaching estimate based on practice activity, not a prediction of a BCSP
examination result. It remains hidden until the documented minimum evidence
threshold is met.
