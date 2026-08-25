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
