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

Progress is stored in the browser. All scenarios and deterministic variants are
original and are not copied from BCSP, Pocket Prep, or the supplied books. The
product is not affiliated with or endorsed by BCSP or Pocket Prep. Items have
not been psychometrically field-calibrated. The Practice Readiness Indicator is
a coaching estimate based on practice activity, not a prediction of a BCSP
examination result. It remains hidden until the documented minimum evidence
threshold is met.
