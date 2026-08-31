# CSP / ASP Coach — full UI/UX audit

Date: August 31, 2026  
Audited revision: `4aa2298` — Add standalone hazards navigation and route handling  
Overall assessment: **6.4 / 10**

## Executive assessment

The product has a recognizable identity, substantial learning content, and several thoughtful interactions. Navy, warm off-white, gold, and restrained teal suit a professional learning tool. The redesigned Hazards workspace is the strongest main tab; Key Information is the strongest conventional reading experience.

The largest opportunity is not a new visual theme. It is making the existing features behave like one connected learning product. Some links lose their topic, the main Practice tab maintains a separate progress model, and several screens spend too much space introducing themselves before presenting useful work. Mobile generally avoids horizontal overflow, but often requires excessive scrolling.

Three priorities would make the biggest difference:

1. Repair task flows: empty Practice selections, chapter-to-resource links, question-entry scroll position, and mobile chapter actions.
2. Establish a readable, accessible shared interface: text contrast, type scale, selected states, labels, and focus management.
3. Replace repeated promotional headers with compact working headers, clear next actions, and honest empty states.

This is an expert heuristic assessment, not a user-research result or accessibility certification. Scores reflect the inspected implementation, including first-use states—not a prediction of learner outcomes.

## Scope and method

I used all three requested skills:

- Repository **ui-ux-pro-max**: task clarity, interaction feedback, accessibility, responsive behavior, and empty-state criteria.
- Repository **frontend-design**: visual hierarchy, distinctive but coherent presentation, typography, and production-quality composition.
- Personal **frontend-design**: deliberate visual direction and truthful, specific interface copy. Its stylistic guidance was used to evaluate consistency, not to justify an unrelated rebrand.

I inspected the running local production application and its source. All eight main tabs were checked at **1440 × 1000 desktop** and **390 × 844 mobile**. Both Library sub-tabs were inspected separately. Chapter Mastery, Notebook, and Standards were also inspected on desktop and mobile; Search was checked on desktop/tablet, and Hazards additionally at **1024 × 900**.

The browser was signed out, using CSP, with no recorded attempts or saved resources. I tested navigation, filters, a no-result Practice start, chapter connections, Search, and entry into a Practice question. No answers were submitted, bookmarks changed, notes edited, progress reset, or application code modified. There are **28 screenshot captures** accompanying this report.

Evidence labels used below:

- **Observed:** reproduced in the browser or measured from rendered elements.
- **Source-confirmed:** established from implementation, without creating learner data to reproduce the populated state.
- **Recommendation:** a design judgment requiring validation with users.

Limitations: no real-device, screen-reader, browser-zoom, authenticated cloud-sync, slow-network, or longitudinal learner testing. Populated Analytics/Review, complete assessment results, onboarding submission, and the full calculator workflow were not exercised. Onboarding and session setup received source-level review only. Internal authoring/admin pages, content accuracy, legal applicability, psychometric validity, and performance benchmarking are outside this audit. The supplied older screenshots are context; current scores apply to the running post-redesign project.

## Scorecard

Each dimension is scored out of 10. Overall tab scores use: visual hierarchy/readability 25%, task flow 30%, connectedness/consistency 15%, accessibility 15%, and mobile usability 15%. The project score is the mean of the eight unrounded main-tab scores, rounded to one decimal. Supporting screens do not change that average.

| Main tab | Visual / readability | Task flow | Connectedness | Accessibility | Mobile | Overall |
|---|---:|---:|---:|---:|---:|---:|
| Study | 7.5 | 6.0 | 5.5 | 5.5 | 5.5 | **6.2** |
| Homework | 7.0 | 7.0 | 6.0 | 6.5 | 5.5 | **6.6** |
| Practice | 7.0 | 5.5 | 4.5 | 5.5 | 5.5 | **5.7** |
| Key Info | 7.5 | 8.0 | 5.5 | 7.0 | 7.0 | **7.2** |
| Library | 7.0 | 7.0 | 5.0 | 6.0 | 6.5 | **6.5** |
| Hazards | 8.5 | 8.0 | 7.0 | 8.0 | 7.0 | **7.8** |
| Analytics | 7.0 | 5.5 | 4.5 | 5.5 | 5.5 | **5.7** |
| Review | 6.5 | 5.5 | 4.5 | 5.5 | 6.0 | **5.7** |

Interpretation: 9–10 exceptional; 8 strong with minor gaps; 7 good but inconsistent; 6 usable with material friction; 5 significant task-flow problems. A polished appearance cannot compensate for an action that silently fails or opens the wrong resource.

## Main-tab findings and recommendations

### 1. Study — 6.2 / 10

**Keep:** the daily plan, clear readiness caveat, domain overview, and links into the learning system. Showing “Insufficient evidence” instead of manufacturing a readiness score is a good decision.

**Issues:**

- **Observed/source-confirmed:** the plan says “Review 1 mistakes” with zero attempts. The count is forced to at least one. Elsewhere, Repair misses correctly stays disabled when there are no errors.
- **Observed:** the heading promises “One focused hour. Twenty consequential decisions,” while the visible plan mixes ten questions, mistake review, flashcards, and Homework. The fixed promise does not explain the actual work.
- **Observed:** the mobile page is approximately 4,715 px long. Connected resources begin around 2,068 px and the drill-room heading around 2,981 px. Important destinations sit below repeated status and explanatory material.
- **Recommendation:** “Comfort is not the objective” and “Weak-domain attack” may feel punitive, especially before the learner has supplied evidence. The interface can be rigorous without treating a new user as underperforming.

**Improve:**

1. Put one primary “Continue” or “Start diagnostic” action in the first screen. Show a compact readiness summary beside or beneath it.
2. Generate tasks from real eligible queues. With no mistakes, say “No mistakes to review yet” and offer a suitable first activity.
3. Use plain, verifiable plan copy: “Today: 10 questions, 5 flashcards, and one chapter.” Only show a time estimate if it is calculated or clearly approximate.
4. Collapse detailed domain status and advanced drill modes. Keep the daily plan and connected resources easy to reach.
5. Label manual task check-offs as personal planning completion, distinct from assessed learning evidence.

Evidence: [Study implementation](D:/csp-coach/csp-coach/app/AdaptiveCoach.tsx:1424), [forced mistake count](D:/csp-coach/csp-coach/app/AdaptiveCoach.tsx:1466), [mobile screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/01-study-mobile.png).

### 2. Homework — 6.6 / 10

**Keep:** source references, available-versus-planned separation, chapter status, and the explicit option to skip the retrieval warm-up. The core assignment model is understandable.

**Issues:**

- **Observed:** 36 chapter cards are presented as a long, equally weighted catalog, without a chapter search or status filter.
- **Observed:** at 390 px, the first Start chapter button begins around **1,102 px** down the page; the complete page is about **12,184 px** tall.
- **Observed:** repeated large gold buttons give every chapter the same priority. Returning learners must hunt for the relevant chapter.
- **Observed/source-confirmed:** chapter numbering differs across surfaces: Legal Aspects appears as CH-02 in Homework but chapter 1 in the mastery/planning model. Different source sequences are legitimate, but their labels need to be explicit.

**Improve:**

1. Add a compact “Continue Homework” row followed by search and filters: All, Not started, In progress, Completed, Needs review.
2. Use dense chapter rows on mobile with title, status, last result, and one action; offer cards as an optional desktop view.
3. Distinguish “Course chapter” from “Source chapter/page” everywhere. Define a shared crosswalk rather than displaying competing unlabeled numbers.
4. Give repeated actions contextual accessible names, such as “Start Ventilation homework.”
5. Keep missing source material visible, but collapse the planned-content section by default.

Evidence: [chapter catalog](D:/csp-coach/csp-coach/app/HomeworkHub.tsx:182), [mobile screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/02-homework-mobile.png).

### 3. Practice — 5.7 / 10

**Keep:** the three-step builder, chapter selection, confidence capture, source-check disclosure, and option-by-option explanations. These are useful learning features, not decorative additions.

**Issues:**

- **Observed:** selecting Mistakes only with an empty mistake history leaves Start practice enabled. Clicking it produces no session and no explanation, alert, or status message.
- **Observed:** after clicking Start practice on mobile, the new question retained `scrollY = 562`; its heading began at approximately **−112 px relative to the viewport**. The learner enters partway through the question.
- **Source-confirmed/visible disclosure:** this tab stores separate browser progress and does not update the main Analytics/Review evidence or cloud synchronization. That boundary is disclosed, but conflicts with the expectation of a single study account and a single Practice tab.
- **Observed:** selected chapter mode, length, and focus use visual active classes without programmatic selected/pressed states.
- **Source-confirmed:** Finish exits the runner back to the builder; there is no session-level wrap-up in this runner.

**Improve:**

1. Show the eligible question count before starting. If zero, explain why and offer “Use Balanced” or “Choose another chapter.”
2. On session/question entry, scroll and move focus to a predictable reading start below sticky controls.
3. Provide an activity overview that includes Chapter Practice, Homework, and adaptive work with clearly labeled evidence sources. **Do not merge uncalibrated practice results into readiness calculations indiscriminately.**
4. Use radio groups or correctly announced segmented selections for mutually exclusive settings and answer choices.
5. Add a useful completion screen: answered count, accuracy, high-confidence misses, concepts to revisit, and a next action. Clearly explain what is saved locally and what syncs.
6. On mobile, shorten setup and keep the session summary/start action reachable without obscuring the form or question.

Evidence: [start/filter logic](D:/csp-coach/csp-coach/app/PracticeV2View.tsx:50), [builder and storage notice](D:/csp-coach/csp-coach/app/PracticeV2View.tsx:79), [runner finish behavior](D:/csp-coach/csp-coach/app/PracticeV2View.tsx:105), [mobile runner screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/03b-practice-runner-mobile.png).

### 4. Key Info — 7.2 / 10

**Keep:** the focused reader, source-page references, numbered points, chapter search, match highlighting, mobile chapter selector, and previous/next chapter controls. This screen has a clear primary task.

**Issues:**

- **Observed:** on mobile, the first source point begins around **808 px**, almost beyond the initial screen. The hero, source notice, search, count, and selector consume most of the first viewport.
- **Observed:** some desktop index labels and supporting metadata are much smaller than the reading text, and long chapter titles are truncated.
- **Source-confirmed:** there is no direct save-point, personal-note, or contextual Practice action in the reader.
- **Source-confirmed:** local chapter selection is not written into the URL, making exact reading positions harder to share or restore.

**Improve:**

1. Reduce the hero to a compact title with chapter/point counts in secondary text. Keep provenance available without repeating a large banner.
2. Preserve the existing **16 px mobile source-point text**; use it as a baseline for other reading experiences.
3. Add “Save this point,” “Add a note,” and genuinely mapped related practice, without modifying controlled source wording.
4. Put chapter and relevant point/search state in the URL; restore reading position on Back.
5. Clarify whether “Source verified” means faithful transcription, source checking, or current regulatory review. Do not let a status badge imply a broader verification than was performed.

Evidence: [reader and focus behavior](D:/csp-coach/csp-coach/app/KeyInformation.tsx:42), [mobile screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/04-key-info-mobile.png).

### 5. Library — 6.5 / 10

#### Flashcards — 6.6 / 10

**Keep:** deck/concept search, due/scheduled/mastered counts, reveal-before-rating, and spaced-repetition choices.

**Improve:**

- Make the review session explicit: “10 due cards” with progress and a finish state, rather than a large queue that feels open-ended.
- When nothing is due, celebrate completion and offer optional free review. The source currently falls back from an empty due queue to all filtered cards.
- Increase the readability of small deck, progress, and rating metadata.
- Use “Tap or press Enter to reveal” where appropriate, rather than mouse-only wording.

#### Formula sheet — 6.5 / 10

**Keep:** category filters, the scoped frequently-used set, expandable worked examples, units, common errors, provenance, and **24-card initial pagination**. The implementation does not render all 106 formulas by default.

**Improve:**

- Add an explicit search label and make the active filters and result count easier to scan.
- Offer a compact formula index on mobile; the first 24 collapsed cards still produce a page around 5,477 px tall with the current header.
- Preserve the selected sub-tab and filters in the URL when clicked. Switching to Formula sheet currently leaves `?view=library` unchanged.
- Fix related-practice links to pass mapped topics/question references. A formula-name query alone is not consumed by the current Practice builder.
- Render complex equations consistently and verify long expressions at narrow widths and increased text size.

**Shared issue:** repeated hero content delays both tools. “Reference records” is less useful than “80 flashcards · 106 formulas.” More importantly, the chapter hub’s Formulas action currently opens the unfiltered flashcard queue; see the priority register.

Evidence: [Library and flashcard queue](D:/csp-coach/csp-coach/app/StudyLibrary.tsx:16), [formula filtering and pagination](D:/csp-coach/csp-coach/app/StudyLibrary.tsx:53), [mobile formula screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/05b-library-formulas-mobile.png).

### 6. Hazards — 7.8 / 10

**Keep:** its standalone navigation, compact working toolbar, recognizable category icons, real counts, searchable explorer, large scene, numbered markers, scene modes, structured explanations, controls hierarchy, source disclosure, and explicit unmapped-standard state. It is the closest screen to the supplied visual direction.

**Observed strengths:** all six sampled scene markers measured **44 × 44 px**. Selected language, category, and mode states are programmatically exposed. No page-level horizontal overflow was detected at desktop, mobile, or the sampled tablet size.

**Remaining issues:**

- **Observed:** the mobile scene begins around **651 px**. The toolbar, category strip, subcategories, and hazard selector still delay the central learning asset.
- **Observed:** in Both mode, explanatory English text is 14 px on mobile while corresponding Arabic is approximately **12.32 px**. Arabic is visibly secondary in a supposedly bilingual reading mode.
- **Source-confirmed/observed:** category/subcategory Arabic labels are hidden in Both mode. This is a density trade-off that should be intentional and clearly understood, not accidental inconsistency.
- **Recommendation:** the center and detail column repeat the hazard title. Marker explanation and general explanation can also compete for attention.
- **Observed:** the selected Industrial trucks filter shows 5 of 14 Material Handling hazards. The count is honest, but the active filtering could be more obvious to a returning learner.

**Improve:**

1. On mobile, combine category/subcategory selection into a compact explorer control so the scene arrives earlier. Keep the full explorer available on demand.
2. Give Arabic its own legibility baseline and test equivalent prominence in Both mode. Do not merely scale it down relative to English.
3. Use one primary title, with the detail column beginning at “What is it?” or the selected marker’s explanation.
4. Add a compact, obvious “Industrial trucks · 5 of 14 · Clear” context line.
5. Prioritize the selected marker’s explanation, then controls, then standards/practice/provenance. Keep unmapped links honest; do not invent connections for visual completeness.
6. Validate keyboard marker order, Arabic-only layout, long translations, and zoom in a follow-up accessibility pass. Those were not exhaustively tested here.

Evidence: [premium layout and bilingual sizing](D:/csp-coach/csp-coach/app/hazard-library/hazard-premium.css:17), [mobile type rules](D:/csp-coach/csp-coach/app/hazard-library/hazard-premium.css:193), [desktop screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/06-hazards-desktop.png), [mobile screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/06-hazards-mobile.png).

### 7. Analytics — 5.7 / 10

**Keep:** the explicit evidence threshold, domain matrix, distinction between readiness and raw accuracy, and explanation that readiness is not an exam-result prediction.

**Issues:**

- **Observed:** with no answers, readiness says Insufficient evidence while Raw accuracy says **0%**. No evidence and zero correct performance are different states.
- **Observed/source-confirmed:** “Start today’s session” navigates to Study; it does not start a session.
- **Source-confirmed:** the chart normalizes bar height against the highest recent score, while the 80% reference line uses a fixed percentage of a different-height container. Bars and threshold do not share a reliable 0–100 coordinate system. This finding was not tested with fabricated attempt data.
- **Observed:** five vertically stacked KPI panels push the mobile domain-matrix heading to about **1,036 px**. Repeated “not enough evidence” displays occupy space without supplying a next action.
- **Source-confirmed:** this is not an overview of all activity in the product; Chapter Practice is excluded despite being the main Practice tab.

**Improve:**

1. Display “— · No answers yet” for raw accuracy until evidence exists.
2. Rename the CTA to “Go to study plan,” or make it open the intended session setup.
3. Use a fixed 0–100 scale and one plot coordinate system for bars and threshold. Provide a readable data alternative and explain sample sizes.
4. Separate “Learning activity” from “Readiness evidence” with source labels and filters. Preserve the evidence rules.
5. Make domain rows actionable: “Needs more evidence → Start a relevant block.”
6. On mobile, show readiness first, then a compact metric grid and prioritized domain actions; move blueprint allocation to expandable reference information.

Evidence: [Analytics implementation](D:/csp-coach/csp-coach/app/AdaptiveCoach.tsx:1836), [chart calculation](D:/csp-coach/csp-coach/app/AdaptiveCoach.tsx:1848), [chart geometry](D:/csp-coach/csp-coach/app/globals.css:428), [mobile screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/07-analytics-mobile.png).

### 8. Review — 5.7 / 10

**Keep:** filtering by outcome/domain/session and the implementation’s answer-specific rationales, confidence context, and mistake classification. These support reflection rather than just displaying scores.

**Issues:**

- **Observed:** the first-use screen says “No matching attempts,” implying a filter problem even when there has never been an attempt.
- **Observed/source-confirmed:** “Search every submitted response” overstates its scope; Chapter Practice submissions are maintained separately.
- **Observed/source-confirmed:** “New adaptive block” only sends the learner to Study.
- **Observed:** an empty-state coaching banner and filters occupy considerable space before the actual empty-state explanation. The search field lacks an explicit meaningful label; outcome selection is visual only.

**Improve:**

1. Distinguish first use, no filter matches, and no remaining mistakes. Give each state a relevant action.
2. State the evidence source in the heading/filter area. Ultimately offer a unified review entry point with separate source filters.
3. Add a direct “Review mistakes” queue with a clear end, then prioritize high-confidence errors and repeated concepts where supported by data.
4. Label search and expose the selected outcome to assistive technology.
5. Replace the large marketing-style heading with “Review” plus a useful count and scope description. Reveal coach-pattern content after enough classified errors exist.

Evidence: [Review implementation](D:/csp-coach/csp-coach/app/AdaptiveCoach.tsx:1887), [Review CTA/copy](D:/csp-coach/csp-coach/app/AdaptiveCoach.tsx:1926), [desktop screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/08-review-desktop.png).

## Supporting experiences

Supporting scores are holistic heuristic ratings because their available states and audit coverage differ from the main-tab rubric.

| Experience | Rating | Main assessment | Most valuable improvement |
|---|---:|---|---|
| Chapter Mastery | **5.8 / 10** | Useful cross-resource concept, weakened by broken routing and hidden mobile actions | Open the selected chapter’s actions inline or in an accessible sheet; repair resource targets |
| My Study Notebook | **6.0 / 10** | Clear saved-resource concept, but acts as a collection of copies rather than a navigable study hub | Add Open original, visible save status, and undo for removal |
| Standards Explorer | **7.0 / 10** | Clear citation-first detail, actual catalog count, and official-source link | Compact header, labeled search, reliable contextual connections |
| Global Search | **6.3 / 10** | Valuable cross-resource retrieval; keyboard and dialog semantics need work | Stable dialog name, focus lifecycle, accessible result navigation |

### Chapter Mastery

**Observed:** selecting Ventilation and clicking “Formulas · 4 related cards” opened the general Flashcard queue, starting with an unrelated OSHA card. In the source, Formulas and Hazards & flashcards both call the generic Library destination without selecting the intended sub-tab.

**Observed:** on mobile, selecting the first chapter leaves its detail panel after all 40 tiles. The panel starts at approximately **3,238 px**, while the viewport remained near the top (`scrollY = 168`). The selection appears to do little unless the learner scrolls far down.

Add chapter search and status sorting; show the selected chapter beside or immediately below its tile on small screens. Split Hazards and Flashcards into distinct, correctly mapped actions. Preserve chapter context in URLs. Make labels distinguish course chapter numbering from source numbering.

Evidence: [chapter map and resource actions](D:/csp-coach/csp-coach/app/StudySystem.tsx:27), [mobile selected chapter](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/09-mastery-mobile.png).

### My Study Notebook

The empty state is understandable, but should offer direct entry to resources that can be saved. The resource-type selector needs an accessible label.

**Source-confirmed:** saved cards have note editing and removal but no Open original action. Notes save on each change without a local visible saving/saved indicator. Removing an entry immediately removes the note too, without an undo step in this component. The shared saved-resource toggle can also remove the saved note with the bookmark.

Add source navigation, an explicit local/synced save indicator, and recoverable removal. Test saved-note states separately; I did not create or delete user notes to verify them.

Evidence: [Notebook](D:/csp-coach/csp-coach/app/StudySystem.tsx:53), [shared bookmark removal](D:/csp-coach/csp-coach/app/StudySystem.tsx:73).

### Standards Explorer

The six-record scope and official-source link are honest and useful. Separate key numbers and definitions are easy to understand. Preserve the caveat that summaries are study aids, not applicability determinations.

Improve the oversized mobile hero, persistent search labeling, selected-result semantics, and connected Library targets. Expose the selected standard in the URL. If the data model supports it, show source edition/review date without inventing currency claims. Horizontal result browsing on mobile is reasonable, but needs a clear cue that more records are available.

Evidence: [Standards Explorer](D:/csp-coach/csp-coach/app/StudySystem.tsx:62), [mobile screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/11-standards-mobile.png).

### Global Search

**Observed:** after entering “ventilation,” the dialog still references `smart-search-title`, but that element no longer exists because the heading is only rendered in welcome/empty states. After closing Search, focus was on the document body rather than the triggering control.

**Source-confirmed:** the input changes a selected result with arrow keys but does not expose that active result through a complete combobox/listbox relationship. Escape handling is attached to the input, not the entire dialog. No application-level focus-trapping or background-inert implementation was found in the Search component. The limited keyboard checks did not establish a reliable full focus loop, so this needs dedicated verification rather than a claim of completed screen-reader testing.

Keep the useful suggestions and cross-resource search. Add a stable dialog heading, robust focus entry/return, correctly announced selection, scrolling of the active result into view, and resource-type filters. Consider whether answer-bearing excerpts should be shown for an unattempted question; make that an explicit learning-mode choice.

Evidence: [Search component](D:/csp-coach/csp-coach/app/GlobalSmartSearch.tsx:69), [result-list rendering](D:/csp-coach/csp-coach/app/GlobalSmartSearch.tsx:115), [screenshot](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/12-search-desktop.png).

### Onboarding, adaptive/mock setup, and question tools — provisional, not scored

Source review shows useful onboarding features: optional exam date, searchable completed-chapter selection, bulk selection, and announced counts. However, the reopened setup has no obvious Cancel control in the component, and its focus lifecycle needs testing. Reuse one accessible dialog pattern across setup and Search.

Adaptive/mock setup clearly states count, time allowance, and when rationales unlock. Those distinctions should remain. Reduce dense allocation copy on mobile and validate that the primary action remains visible with text zoom and the on-screen keyboard.

Question tools preserve calculator state after first mount and explicitly return focus on close—good patterns worth reusing. The mobile Practice screen places a sticky tools row above a long question, so test that it never obscures the reading/focus target. Calculator accuracy, full assessment completion, and exam resumption were not validated in this audit.

Evidence: [onboarding and tools](D:/csp-coach/csp-coach/app/StudySystem.tsx:89), [session setup](D:/csp-coach/csp-coach/app/AdaptiveCoach.tsx:1598).

## Priority register

P1 = fix before calling the experience consistently premium; P2 = next usability pass; P3 = refinement. These are product/UX priorities, not security severity ratings.

| ID | Priority | Finding | Evidence | Acceptance criterion |
|---|---|---|---|---|
| UX-01 | P1 | Practice silently does nothing when no questions match | Observed; Practice start logic | Every zero-result combination explains the reason and offers a recovery action |
| UX-02 | P1 | Chapter/resource links lose or misroute context | Observed Ventilation → Formulas; source-confirmed generic query handling | Each connected action opens the promised resource type and relevant topic; reload/Back preserve it |
| UX-03 | P1 | Starting mobile Practice leaves the question’s beginning above the viewport | Observed heading at −112 px | Every new session enters at a visible, focused question start below sticky UI |
| UX-04 | P1 | Mobile Mastery actions appear after all 40 tiles | Observed panel at ~3,238 px | Selecting a tile immediately reveals reachable actions without hunting down the page |
| UX-05 | P1 | Progress scope is inconsistent with broad product labels | Visible disclosure and source-confirmed data boundaries | Learners can identify where each activity is saved, reviewed, and included in readiness |
| UX-06 | P1 | Shared secondary text fails normal-text contrast on sampled solid backgrounds | Measured color pairs | All normal interface text reaches 4.5:1 on its actual backgrounds |
| UX-07 | P1 | Search naming/focus and selected-state semantics are incomplete | Observed missing dialog label target/body focus; source review | Stable dialog name, meaningful active result, correct focus return, and full keyboard tests |
| UX-08 | P1 | Analytics bars and threshold use inconsistent scales | Source-confirmed, populated chart not browser-tested | 0%, 50%, 80%, and 100% all align with one fixed plot scale |
| UX-09 | P2 | Empty states and calls to action misrepresent the available task | Observed zero-history Study/Analytics/Review | No phantom mistake count, no 0% for no evidence, and CTA wording matches its action |
| UX-10 | P2 | Large repeated heroes delay learning, particularly on mobile | Measured task positions | Core action/content appears in or near the first mobile screen for the default state |
| UX-11 | P2 | Saved notes can be removed without component-level recovery | Source-confirmed; not destructively tested | Removal provides undo/recovery and clearly states whether the note is also removed |
| UX-12 | P2 | Bilingual hierarchy reduces Arabic legibility | Observed 14 px English / 12.32 px Arabic | Both-language reading is comfortable and equivalent in prominence at mobile widths |
| UX-13 | P2 | Chapter numbers and resource naming vary by surface | Observed/source-confirmed | Course and source identifiers are explicitly labeled and consistently mapped |
| UX-14 | P3 | Repeated borders, shadows, badges, and decorative copy dilute hierarchy | Visual assessment | Shared component patterns reduce competing emphasis without hiding important evidence |

## Shared design-system recommendations

### Keep the identity; standardize its application

Retain navy for structure, warm off-white for the reading surface, teal for selection, and gold for a limited number of high-priority actions. Reserve red/orange for meaningful warnings and hazard semantics. Avoid making every chapter action gold.

Use one compact page-header component for working tabs, with title, scope/count, and primary action. Keep a larger welcome area only where it helps first-time orientation. Hazards demonstrates the useful principle of a working toolbar, but its three-column layout should not be copied onto every task.

Define shared tokens for page widths, spacing, border radius, elevation, selected states, and focus outlines. Consolidate these deliberately rather than adding another layer of page-specific CSS overrides. Use a consistent body/UI font; reserve the existing serif treatment for a clearly defined reading/editorial role, if retained.

### Readability and contrast

Suggested starting typography targets—not WCAG minimum font-size rules:

| Role | Suggested baseline |
|---|---|
| Long-form reading and question options | 16–18 px, approximately 1.5–1.7 line height |
| Standard controls and meaningful labels | 14–16 px |
| Secondary metadata | 12–13 px where practical; avoid 7–10 px operational text |
| Working-page title | 28–36 px desktop; 24–30 px mobile |
| Arabic reading | Independently tuned at comparable readability, not a blanket 0.88× reduction |

Measured shared color pairs:

| Text / background | Contrast ratio | Assessment for normal text |
|---|---:|---|
| `#687b86` on `#f7f4ed` | 4.01:1 | Below 4.5:1 |
| `#bb7c17` on `#f7f4ed` | 3.18:1 | Below 4.5:1 |
| `#687b86` on `#fffdf8` | 4.33:1 | Below 4.5:1 |

The Review page’s rendered secondary text and eyebrow used the first two foreground colors; the background values come from shared paper/card tokens. These are specific solid-color checks, not a full gradient, image, state, or component contrast audit. Darken semantic secondary-text tokens and test every real combination. Small text alone is not automatically a WCAG failure, but these sampled color pairs miss the normal-text threshold. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### Accessibility and navigation

- Add a Skip to main content link and predictable route/session focus management.
- Expose the current page for every main-navigation item, not only Hazards. Use real links where navigation semantics and opening in a new tab are useful.
- Use radio/checkbox/pressed/selected semantics appropriate to each control. An active CSS class is not an accessible state.
- Give inputs and selectors explicit labels; do not rely on an icon or placeholder alone.
- Reuse a tested modal pattern with a stable accessible name, contained keyboard navigation, Escape handling, and focus return. [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
- Keep existing reduced-motion support and strong Hazards focus styling. Audit the much fainter shared focus outline on light surfaces.
- Aim for 44–48 px touch targets for comfortable frequent actions. WCAG 2.2 AA’s minimum target-size criterion is 24 CSS px with defined exceptions; 44 px is a design target here, not a claim that every smaller control automatically fails AA. The sampled button/input/select rectangles did not show a dimension below 24 px, but spacing exceptions and every interactive state were not exhaustively audited. [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Reconcile desktop “Study” with mobile “Today,” and make secondary destinations discoverable without expanding the primary navigation indefinitely.

## Recommended delivery order

### Pass 1 — correctness and accessibility

Fix UX-01 through UX-08. Add integration tests for connected targets, zero-result starts, fresh-history states, and session focus/scroll entry. Establish shared contrast and form-state tokens. Confirm progress/evidence scope with the product owner before changing data aggregation.

### Pass 2 — mobile task compression

Compact repeated heroes. Add Homework search/continue controls, immediate Mastery actions, a compact Analytics overview, and a streamlined mobile Hazard explorer. Keep bottom navigation from covering actions or reading targets. Check 390 px and narrower layouts with text enlargement and long labels.

### Pass 3 — connected learning

Build durable chapter/resource URLs and a consistent return path. Add Notebook source navigation and recoverable removal. Add Practice completion summaries and clear flashcard session completion. Unify the activity entry point while retaining separate evidence models where required.

### Pass 4 — polish and user validation

Normalize icons, saved-state language, typography, borders, shadows, and microcopy. Run short task-based sessions with learners, including Arabic-first and keyboard users. Measure successful task completion and wrong-destination rates before declaring the redesign successful. Dark mode, more animation, and additional decorative assets should follow—not precede—these fixes.

Suggested validation tasks:

1. Start a relevant ten-question session from a chapter, without searching for the same topic again.
2. Recover from an empty Mistakes-only filter without assistance.
3. Open a chapter’s formulas and return to the same chapter.
4. Save a hazard, add a note, reopen the original, and recover an accidental removal.
5. Explain why Chapter Practice activity does or does not affect readiness.
6. Find and understand a hazard in Both/Arabic mode on a phone.
7. Complete Search and modal interactions using only the keyboard.

## Measurement and screenshot appendix

Document heights are measurements of the inspected default states, not load-time or performance metrics. Long pages are not inherently wrong; the concern is the position and discoverability of the next useful action.

| Screen | Desktop document height | Mobile document height | Notable mobile position |
|---|---:|---:|---|
| Study | 2,450 px | 4,715 px | Connected resources heading ~2,068 px |
| Homework | 4,495 px | 12,184 px | First Start chapter ~1,102 px |
| Practice builder | 1,191 px | 1,406 px | Start practice ~1,010 px |
| Key Info | 1,564 px | 2,434 px | First source point ~808 px |
| Library / Flashcards | 1,174 px | 1,255 px | Queue heading ~502 px |
| Library / Formulas | 2,921 px | 5,477 px | Initial page contains 24 cards |
| Hazards / Forklift Tip-Over | 1,492 px | 3,469 px | Scene begins ~651 px |
| Analytics | 1,689 px | 2,826 px | Domain matrix heading ~1,036 px |
| Review | 1,018 px | 1,394 px | First-use and filtered-empty states are not distinct |

No page-level horizontal overflow was detected in these captured states. That does not establish every interaction, translation, zoom level, or device as overflow-free.

### Main-tab captures

| Tab | Desktop | Mobile |
|---|---|---|
| Study | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/01-study-desktop.png) | [Mobile](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/01-study-mobile.png) |
| Homework | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/02-homework-desktop.png) | [Mobile](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/02-homework-mobile.png) |
| Practice | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/03-practice-desktop.png) | [Builder](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/03-practice-mobile.png), [Runner](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/03b-practice-runner-mobile.png) |
| Key Info | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/04-key-info-desktop.png) | [Mobile](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/04-key-info-mobile.png) |
| Library / Flashcards | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/05-library-flashcards-desktop.png) | [Mobile](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/05-library-flashcards-mobile.png) |
| Library / Formulas | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/05b-library-formulas-desktop.png) | [Mobile](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/05b-library-formulas-mobile.png) |
| Hazards | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/06-hazards-desktop.png) | [Mobile](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/06-hazards-mobile.png), [Tablet](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/06-hazards-tablet.png) |
| Analytics | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/07-analytics-desktop.png) | [Mobile](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/07-analytics-mobile.png) |
| Review | [Desktop](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/08-review-desktop.png) | [Mobile](D:/csp-coach/csp-coach/reports/ui-ux-audit-2026-08-31/08-review-mobile.png) |

Additional captures in this report directory cover Mastery, Notebook, Standards, Search, and the mobile menu. This audit changed only report artifacts; it did not implement the recommendations.
