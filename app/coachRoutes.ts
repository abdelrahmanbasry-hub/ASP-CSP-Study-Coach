import { canonicalHazardId } from "./hazardAliases.ts";
import type { SearchTarget } from "./globalSearch";

export type CoachView = SearchTarget["view"];
const views: readonly string[] = ["study", "homework", "practice", "key-information", "library", "hazards", "stats", "review", "standards", "notebook", "mastery"];
export function normalizeCoachTarget(target: SearchTarget): SearchTarget {
  if (target.view === "hazards" || (target.view === "library" && target.libraryTab === "hazards")) return { ...target, view: "hazards", libraryTab: undefined, itemId: target.itemId ? canonicalHazardId(target.itemId) : undefined };
  return target;
}
export function readCoachRoute(url: URL): { view: CoachView; target: SearchTarget | null } {
  const p = url.searchParams;
  const legacy = /^\/library\/hazards\/?$/.test(url.pathname) || (p.get("view") === "library" && (p.get("tab") ?? p.get("libraryTab")) === "hazards");
  const view = legacy || /^\/hazards\/?$/.test(url.pathname) ? "hazards" : views.includes(p.get("view") ?? "") ? p.get("view") as CoachView : "study";
  const tab = p.get("tab"), focus = p.get("focus"), source = p.get("source");
  const target = normalizeCoachTarget({
    view, query: p.get("q") ?? undefined, itemId: p.get("hazard") ?? p.get("itemId") ?? undefined,
    chapterId: p.get("chapter") ?? undefined,
    chapterNumber: p.has("chapterNumber") && Number(p.get("chapterNumber")) > 0 ? Number(p.get("chapterNumber")) : undefined,
    libraryTab: tab === "formulas" || tab === "flashcards" ? tab : undefined,
    category: p.get("category") ?? undefined, deck: p.get("deck") ?? undefined,
    formulaSet: p.get("set") === "frequent" ? "frequent" : undefined,
    reviewSource: source === "chapter" || source === "homework" || source === "adaptive" ? source : undefined,
    practiceFocus: focus && ["balanced", "weak", "unseen", "mistakes", "calculation", "scenario"].includes(focus) ? focus as SearchTarget["practiceFocus"] : undefined,
    ...(p.has("tag") ? { practiceTags: p.getAll("tag") } : {}),
    ...(p.has("question") ? { practiceQuestionIds: p.getAll("question") } : {}),
    ...(p.has("standard") ? { standardIds: p.getAll("standard") } : {}),
  });
  return { view, target };
}
export function coachRouteHref(view: CoachView, target?: SearchTarget | null) {
  const t = target ? normalizeCoachTarget(target) : null;
  const destination = t?.view === "hazards" ? "hazards" : view;
  const p = new URLSearchParams();
  if (destination !== "hazards") p.set("view", destination);
  if (t?.query && !t.itemId) p.set("q", t.query);
  if (t?.itemId) p.set(destination === "hazards" ? "hazard" : "itemId", t.itemId);
  if (t?.libraryTab) p.set("tab", t.libraryTab);
  if (t?.chapterId) p.set("chapter", t.chapterId);
  if (t?.chapterNumber) p.set("chapterNumber", String(t.chapterNumber));
  if (t?.category) p.set("category", t.category);
  if (t?.deck) p.set("deck", t.deck);
  if (t?.formulaSet === "frequent") p.set("set", "frequent");
  if (t?.reviewSource) p.set("source", t.reviewSource);
  if (t?.practiceFocus) p.set("focus", t.practiceFocus);
  t?.practiceTags?.forEach(value => p.append("tag", value));
  t?.practiceQuestionIds?.forEach(value => p.append("question", value));
  t?.standardIds?.forEach(value => p.append("standard", value));
  return `${destination === "hazards" ? "/hazards" : "/"}${p.size ? `?${p}` : ""}`;
}
/** Filter edits replace; explicit sub-tab selections create a Back destination. */
export function updateResourceRoute(target: SearchTarget, push = false) {
  if (typeof window === "undefined") return;
  const href = coachRouteHref(target.view, target);
  if (window.location.pathname + window.location.search === href) return;
  window.history[push ? "pushState" : "replaceState"]({ ...window.history.state, ...(push ? { scrollY: 0 } : {}), coachTarget: target }, "", href);
}
