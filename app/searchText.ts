// Shared normalization for the existing Library and global search. Preserve Arabic.
export function normalizeSearchText(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f\u064b-\u065f\u0670\u06d6-\u06ed]/g, "")
    .replace(/\u0640/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي")
    .replace(/[’‘]/g, "'").toLowerCase().replace(/[^\p{L}\p{N}.%+/'°²³-]+/gu, " ").replace(/\s+/g, " ").trim();
}

export function matchesSearchText(text: string, query: string) {
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean);
  const haystack = normalizeSearchText(text);
  return tokens.every((token) => haystack.includes(token));
}
