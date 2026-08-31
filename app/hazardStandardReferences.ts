import { OSHA_STANDARDS, type StandardRecord } from "./standardsData.ts";
import type { HazardRecord } from "./hazardTypes";

export type SuppliedStandardReference = { number: string; scope: string; relation: string };
/** Strict CFR grammar. Paragraph case matters: (i) is not (I). No fuzzy/prefix matching. */
export function normalizeStandardNumber(value: string): string | null {
  const input = value.normalize("NFKC").trim().replace(/^OSHA\s+/i, "")
    .replace(/^29\s*C\.?\s*F\.?\s*R\.?\s*/i, "")
    .replace(/^(?:Part\s+|Section\s+|§\s*)/i, "");
  const subpart = /^(19\d{2})[\s.-]+Subpart[\s-]+([A-Za-z]{1,3})$/i.exec(input);
  if (subpart) return `${subpart[1]} Subpart ${subpart[2].toUpperCase()}`;
  const section = /^(19\d{2})\s*[.-]\s*(\d+)((?:\s*\([A-Za-z0-9]+\))*)$/.exec(input);
  return section ? `${section[1]}.${section[2]}${section[3].replace(/\s/g, "")}` : null;
}
function catalogNumber(standard: StandardRecord) {
  // A parseable citation is authoritative. An ID is a fallback only for an opaque citation.
  const citation = normalizeStandardNumber(standard.citation);
  if (citation) return citation;
  if (/C\.?\s*F\.?\s*R\.?/i.test(standard.citation)) return null;
  return normalizeStandardNumber(standard.id);
}
export function resolveHazardStandards(references: readonly SuppliedStandardReference[], catalog: readonly StandardRecord[] = OSHA_STANDARDS): NonNullable<HazardRecord["standardReferences"]> {
  return references.map(({ number, scope, relation }) => {
    const reference = { number, scope, relation };
    const normalized = normalizeStandardNumber(number);
    if (!normalized) return { ...reference, resolution: "unresolved", reason: "invalid-reference" };
    const exact = catalog.filter(standard => catalogNumber(standard) === normalized);
    // Only explicit paragraph ancestry is safe without a vetted subpart-membership table.
    // Never infer subpart membership or link by shared part, title, topic or numeric prefix.
    const parents = catalog.filter(standard => {
      const parent = catalogNumber(standard);
      return parent && !parent.includes("Subpart") && normalized.startsWith(`${parent}(`);
    });
    const mostSpecific = Math.max(0, ...parents.map(standard => catalogNumber(standard)!.length));
    const matches = exact.length ? exact : parents.filter(standard => catalogNumber(standard)!.length === mostSpecific);
    if (matches.length !== 1) return { ...reference, resolution: "unresolved", reason: matches.length ? "ambiguous-catalog-match" : "not-in-catalog" };
    return { ...reference, resolution: "resolved", standardId: matches[0].id, matchMethod: exact.length ? "exact" : "parent-section" };
  });
}

/** Machine-readable, deterministic audit. Supplied wording survives even when unresolved. */
export function buildMissingStandardsReport(records: readonly HazardRecord[], catalog: readonly StandardRecord[] = OSHA_STANDARDS) {
  const references = records.flatMap(record => resolveHazardStandards(record.standardReferences ?? [], catalog).map(reference => ({ hazardId: record.id, ...reference })));
  const missing = references.filter(reference => reference.resolution === "unresolved");
  const grouped = new Map<string, typeof missing>();
  for (const reference of missing) {
    const key = normalizeStandardNumber(reference.number) ?? reference.number;
    grouped.set(key, [...(grouped.get(key) ?? []), reference]);
  }
  return {
    schemaVersion: 1, catalog: catalog.map(({ id, citation }) => ({ id, citation })),
    summary: { totalOccurrences: references.length, resolvedOccurrences: references.length - missing.length, missingOccurrences: missing.length, missingUniqueReferences: grouped.size },
    resolved: references.filter(reference => reference.resolution === "resolved"),
    missing: [...grouped].sort(([a], [b]) => a.localeCompare(b)).map(([normalizedNumber, occurrences]) => ({ normalizedNumber, suppliedNumbers: [...new Set(occurrences.map(reference => reference.number))], reason: occurrences[0].reason, occurrences })),
  };
}
