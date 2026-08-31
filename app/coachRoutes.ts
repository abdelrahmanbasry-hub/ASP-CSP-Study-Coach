import { canonicalHazardId } from "./hazardAliases.ts";
import type { SearchTarget } from "./globalSearch";

export type CoachView = SearchTarget["view"] | "notebook" | "mastery";
const views: readonly string[] = ["study", "homework", "practice", "key-information", "library", "hazards", "stats", "review", "standards", "notebook", "mastery"];
export function normalizeCoachTarget(target: SearchTarget): SearchTarget {
  if (target.view === "hazards" || (target.view === "library" && target.libraryTab === "hazards")) return { ...target, view: "hazards", libraryTab: undefined, itemId: target.itemId ? canonicalHazardId(target.itemId) : undefined };
  return target;
}
export function readCoachRoute(url: URL): { view: CoachView; target: SearchTarget | null } {
  const params = url.searchParams;
  const legacy = /^\/library\/hazards\/?$/.test(url.pathname) || (params.get("view") === "library" && (params.get("tab") ?? params.get("libraryTab")) === "hazards");
  const view = legacy || /^\/hazards\/?$/.test(url.pathname) ? "hazards" : views.includes(params.get("view") ?? "") ? params.get("view") as CoachView : "study";
  if (view === "notebook" || view === "mastery") return { view, target: null };
  const target = normalizeCoachTarget({ view, query: params.get("q") ?? undefined, itemId: params.get("hazard") ?? params.get("itemId") ?? undefined, libraryTab: params.get("tab") === "formulas" ? "formulas" : undefined });
  return { view, target };
}
export function coachRouteHref(view: CoachView, target?: SearchTarget | null) {
  const normalized = target ? normalizeCoachTarget(target) : null;
  const destination = normalized?.view === "hazards" ? "hazards" : view;
  const params = new URLSearchParams();
  if (destination !== "hazards") params.set("view", destination);
  if (normalized?.query && !normalized.itemId) params.set("q", normalized.query);
  if (normalized?.itemId) params.set(destination === "hazards" ? "hazard" : "itemId", normalized.itemId);
  if (normalized?.libraryTab) params.set("tab", normalized.libraryTab);
  return `${destination === "hazards" ? "/hazards" : "/"}${params.size ? `?${params}` : ""}`;
}
