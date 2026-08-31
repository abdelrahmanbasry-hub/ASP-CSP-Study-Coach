/** Reviewed spelling aliases in the existing Practice vocabulary, not broader topic synonyms.
 * These only match a complete contiguous phrase in the question's concept/chapter/stem.
 * Source-location mentions alone are deliberately insufficient for these aliases. */
export const PRACTICE_TAG_ALIASES: Readonly<Record<string, { phrase: string; evidenceQuestionIds: readonly string[] } | undefined>> = {
  "pinch-point": { phrase: "pinch point", evidenceQuestionIds: ["PV2-CORE-CH26-007", "PV2-CORE-CH26-015"] },
  "portable-tool": { phrase: "portable tool", evidenceQuestionIds: ["PV2-CORE-CH16-023"] },
  "stored-energy": { phrase: "stored energy", evidenceQuestionIds: ["PV2-CORE-CH17-008", "PV2-CORE-CH17-016"] },
};
export function matchesPracticeTagAlias(text: string, tag: string) {
  const alias = PRACTICE_TAG_ALIASES[tag.trim().toLowerCase()];
  if (!alias) return false;
  return new RegExp(`(?:^|[^\\p{L}\\p{N}])${alias.phrase}(?:$|[^\\p{L}\\p{N}])`, "iu").test(text.replace(/\s+/g, " "));
}
