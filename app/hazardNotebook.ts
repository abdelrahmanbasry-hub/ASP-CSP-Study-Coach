import { canonicalHazardId } from "./hazardAliases.ts";
import type { NotebookEntry } from "./studySystemState";

/** Presentation-only grouping. Original storage keys, note text and timestamps never migrate.
 * Two previously saved versions share a card but retain independently editable notes. */
export function notebookResourceGroups(notebook: Readonly<Record<string, NotebookEntry>>) {
  const groups = new Map<string, NotebookEntry[]>();
  for (const entry of Object.values(notebook)) {
    const key = entry.kind === "hazard" && entry.id.startsWith("hazard:") ? `hazard:${canonicalHazardId(entry.id.slice(7))}` : entry.id;
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  return [...groups].map(([id, entries]) => ({ id, entries: entries.toSorted((a, b) => b.updatedAt - a.updatedAt) }))
    .sort((a, b) => b.entries[0].updatedAt - a.entries[0].updatedAt);
}
