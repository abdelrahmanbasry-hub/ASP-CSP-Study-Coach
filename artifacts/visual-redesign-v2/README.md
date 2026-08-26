# Approved visual reference review

This folder contains the fresh browser captures for the second structural fidelity pass.

## Desktop implementation captures

The `implementation` directory contains 1440 × 900 captures for Study, Homework, Practice Setup, Practice Question, Key Information, Flashcards, Formula Sheet, Analytics, Review, and Hazards Home.

## Reference comparisons

The `comparisons` directory contains ten 1440 × 900 plates with the approved reference on the left and the real-data implementation on the right.

## Responsive verification

The `responsive` directory contains dedicated captures at 1280, 1024, 768, and 390 pixels. Study is represented at every requested breakpoint; Key Information and Practice Setup additionally verify the reference shell, mobile drawer, stacked configuration, and bottom navigation.

## Verification results

- `pnpm lint` — passed
- `pnpm exec tsc --noEmit` — passed
- `pnpm test` — passed, 85/85
- `pnpm build` — passed
- `git diff --check` — passed
- Browser console — no warnings or errors during the acceptance pass

## Expected data-driven differences

- Screenshot values are never copied. Readiness, counts, dates, progress, accuracy, and learner activity come from the current application state.
- Homework renders the complete real chapter catalog rather than the eight sample cards in the approved board.
- Practice reports the number of distinct source-backed item families actually available when it is lower than the requested session length.
- Analytics preserves insufficient-evidence states and may contain fewer chart marks than the approved board.
- Hazard Atlas surfaces the 37 imported bilingual source records. Future relationship, workplace, comparison, monitoring, standards, bookmark, guide, and hazard-analytics datasets remain unavailable rather than fabricated.
- Illustrations are original CSS/SVG/icon compositions or existing project assets; the reference artwork was not copied into the product.
