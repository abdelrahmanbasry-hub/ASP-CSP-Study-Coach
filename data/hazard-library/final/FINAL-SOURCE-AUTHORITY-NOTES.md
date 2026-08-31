# Final Hazard Library — Source and Authority Notes

## Scope

This package combines Phases 5 through 8 into one controlled population package, followed by a Phase 9 integration/QA gate.

New canonical records:
- Excavation & Trenching: 8
- Confined Spaces: 9
- LOTO / Hazardous Energy: 10
- Pressure / Hydraulic / Pneumatic: 8
- Chemical & HazMat: 15
- Fire & Explosion: 12
- Process Safety: 10
- Ergonomics / Human Factors: 12
- Noise: 8
- Thermal Stress: 10
- Radiation: 11
- Environmental: 10
- Security / Emergency: 8

Total new canonical records in this combined package: 131.

Expected final visible catalog after all Phase 3 reference reconciliation:
- 37 existing Occupational Health records
- 52 Phase 4 canonical records
- 131 Phase 5–8 canonical records
- 0 visible Phase 3 prototype/reference duplicates
= 220 visible canonical hazards.

## Primary study source

David Yates, *Safety Professional’s Reference and Study Guide*, 4th edition, is the primary study-source basis.

The package uses Yates for the study taxonomy, mechanisms, and source framing where directly supported. It does not treat the book as the current regulatory authority.

Examples of direct source support used in this package include:
- excavation hazards, protective systems, changing conditions, utilities, water, surcharge loads, competent-person evaluation, and access/egress;
- permit-required confined-space definitions, hazardous atmospheres, oxygen deficiency/enrichment, engulfment, internal configuration, isolation, entry permits, attendants, supervisors, training, and rescue;
- LOTO / control-of-hazardous-energy concepts and stored/residual energy;
- hazardous-material physical hazards, HazCom/GHS physical-hazard classes, and overpressurization;
- fire tetrahedron, flammable liquids, static electricity, welding/cutting/hot-work fire prevention, extinguishers, and fire-protection systems;
- management of change and ASP/CSP chemical process-safety coverage;
- ergonomics, lifting, posture and human-factor principles;
- OSHA hearing-conservation / noise concepts;
- heat and cold stressors and heat-related disorders;
- ionizing and non-ionizing radiation topics, including time, distance and shielding;
- environmental management, RCRA/waste/UST/air topics;
- site security, workplace violence, bomb threats, emergency management and continuity.

## Source-status rule

Every record carries `source.yatesSupport`.

- `direct`: Yates directly supports the concept or named hazard family.
- `indirect`: Yates supports the broader mechanism/family, while the exact product taxonomy title is a library-design choice.
- `supplemented`: retained as a useful study concept using current authoritative context in addition to Yates. Do not portray it as an exact Yates statement.

Codex must preserve these qualifiers.

## Current Federal OSHA verification

Current OSHA section-level mappings were checked against OSHA.gov on 2026-08-31 where OSHA is relevant.

Important mapped families include:
- Hazard Communication: 1910.1200 and mandatory physical-hazard criteria.
- Flammable liquids: 1910.106.
- Compressed gases: 1910.101.
- HAZWOPER: 1910.120.
- Process Safety Management: 1910.119.
- Welding/cutting/hot work: 1910.252 and 1926.352.
- Fire protection: 1910 Subpart L, including 1910.157, .159, .160, .164 and .165 as applicable.
- Occupational noise: 1910.95; construction noise references may use 1926.52 where the app registry supports it.
- Ionizing radiation: 1910.1096; construction 1926.53.
- RF/microwave: 1910.97 is a related Federal OSHA standard, but OSHA itself notes that the exposure-limit language is not enforceable for Federal OSHA. Do not overstate it.
- Emergency action plans: 1910.38.

## Important OSHA cautions

- OSHA's Heat Injury and Illness Prevention rule is still a PROPOSED rule as of 2026-08-31. Do not create a fake final Federal OSHA heat-standard record or present the proposal as an enforceable final rule.
- Many ergonomics hazards do not have a hazard-specific Federal OSHA standard. Do not invent one.
- Combustible dust does not have a single comprehensive Federal OSHA combustible-dust standard. Do not invent one.
- Environmental legal topics are primarily EPA/state environmental authorities. Do not force Clean Air Act, RCRA, Clean Water Act, FIFRA, UST, stormwater, etc. into an OSHA-only standards registry.
- Workplace violence, active attack, general site-security, and unauthorized-access topics do not automatically have a hazard-specific Federal OSHA standard. Use emergency-action-plan links only where genuinely applicable.
- Do not treat a general or conditional standard as though it universally applies to every record in the family.

## Regulatory-number rule

Generated images and mockups are NOT regulatory sources.

Do not introduce or copy:
- exposure limits,
- approach distances,
- fire-protection quantities,
- storage quantities,
- radiation dose limits,
- heat thresholds,
- noise numbers,
- pressure values,
- chemical classification thresholds,
or any other regulatory number unless it is already in a verified app source or is explicitly re-verified from an authoritative source during implementation.

## Standards registry integration

`relatedStandards[].number` contains a section/family reference, not an invented app ID.

Codex must:
1. normalize exact deterministic formatting differences;
2. resolve to existing catalog IDs when they genuinely match;
3. never use fuzzy matching that could create a false legal link;
4. never invent registry IDs;
5. retain unresolved numbers in searchable/source metadata;
6. optionally add a minimal verified standard citation record only if the existing Standards architecture already supports curated citation-only additions from current OSHA.gov sources.

Do not copy full regulatory text into hazard records.

## Phase 3 reference reconciliation

The final catalog should not display duplicate prototype/reference hazards.

Canonical targets:
- Arc Flash -> HL-ELEC-001
- Scaffold Fall -> HL-FALL-007
- Forklift Tip-Over -> HL-MAT-004
- Oxygen-Deficient Confined Space -> HL-CONF-001
- Unexpected Startup / LOTO -> HL-LOTO-001

Radiation is different:
- the old Phase 3 `Radiation Exposure` reference is a broad educational scene, while Phase 7 contains 11 specific canonical radiation hazards;
- remove the old reference from the visible catalog after the RAD family is active;
- keep/reuse its scene asset/template;
- do NOT arbitrarily redirect the legacy record to one specific radiation subtype;
- if saved-state compatibility is needed, use a hidden legacy compatibility record/alias or another non-misleading migration mechanism.

## Visual-content rule

Use the approved Phase 3/4 polished visual language.

The data intentionally reuses shared templates. Do not generate one image per hazard.

Prefer a small reusable scene library with data-driven overlays. In this final package, the 131 records reference 21 scene-template names in total, including existing Phase 3/4 templates.
