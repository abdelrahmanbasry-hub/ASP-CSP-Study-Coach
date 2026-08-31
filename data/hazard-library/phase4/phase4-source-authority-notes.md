# Phase 4 source and authority notes

## Controlled scope
This package contains exactly 52 canonical records:
- Electrical: 10
- Falls & Work at Height: 14
- Machinery & Tools: 14
- Material Handling: 14

## Study-source policy
The study framing is grounded in David Yates, *Safety Professional’s Reference and Study Guide*, 4th edition.

Each record carries `yatesSupport`:
- `direct` — the named Yates section/topic directly supports the concept.
- `indirect` — the broader topic is present, but the exact canonical record label is a product-taxonomy choice.
- `supplemented` — retained as a useful canonical library concept; do not represent it as an exact Yates statement.

## Regulatory policy
Current Federal OSHA is the authority for standards mapping.
Do not copy regulatory text into hazard records.
The JSON stores section-level standard numbers only. Codex must resolve them against the app's existing standards catalog.

Current OSHA families/sections checked for this package include:
- Electrical: 1910 Subpart S; 1910.303/.304/.305/.333/.335; 1926 Subpart K including 1926.404/.405/.416.
- General-industry falls: 1910.22/.23/.25/.27/.28/.29 and 1910.140.
- Construction falls: 1926.451/.453/.454; 1926.501/.502; 1926.1052/.1053.
- Machinery/tools: 1910 Subpart O, especially 1910.212/.215/.219; 1910.242/.243; construction conveyors 1926.555.
- Materials handling: 1910.176/.178/.179/.184; construction 1926.251/.602 and applicable crane requirements.

## Guardrails for Codex
- Do not rewrite the controlled safety content.
- Do not invent standards registry IDs.
- If a referenced standard is absent from the app catalog, report it as unresolved.
- Do not invent regulatory thresholds or numeric requirements to fill UI space.
- Preserve Phase 3 visualization engines.
- New scene templates/assets are allowed; a new visualization engine is not.
- Preserve the distinction between direct, indirect, and supplemented source support.
