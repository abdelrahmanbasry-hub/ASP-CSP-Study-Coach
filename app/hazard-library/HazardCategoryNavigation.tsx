import { ChevronDown, MoreHorizontal, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { HAZARD_CATEGORIES, HAZARD_CATEGORY_BY_ID, HAZARD_NAVIGATION, type HazardCategorySelection } from "../hazardCategories";
import { Bilingual } from "../body-explorer/Bilingual";
import type { ExplorerLanguage } from "../hazardExplorer";
import { HazardIcon } from "./hazardIcons";
import { HAZARD_LIBRARY_RECORDS } from "../hazardLibraryData";

export const hazardCategoryCounts = Object.fromEntries(HAZARD_CATEGORIES.map(category => [category.id, HAZARD_LIBRARY_RECORDS.filter(record => record.categoryId === category.id).length]));

export function HazardCategoryNavigation({ selected, onSelect, language }: { selected: HazardCategorySelection; onSelect: (category: HazardCategorySelection) => void; language: ExplorerLanguage }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const button = strip.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (button && strip.current) {
      // Scroll only this strip, never the document or the physical scene.
      const rail = strip.current.getBoundingClientRect();
      const bounds = button.getBoundingClientRect();
      strip.current.scrollBy?.({ left: bounds.left - rail.left - (rail.width - bounds.width) / 2, behavior: "instant" });
    }
  }, [selected, language]);
  const moreButton = useRef<HTMLButtonElement>(null);
  const morePanel = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const moreSelected = selected !== "all" && HAZARD_CATEGORY_BY_ID[selected].placement === "more";
  const select = (category: HazardCategorySelection) => { onSelect(category); setMoreOpen(false); };
  const keyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && moreOpen) { setMoreOpen(false); moreButton.current?.focus(); event.stopPropagation(); return; }
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    const buttons = [...(event.currentTarget.closest("nav")?.querySelectorAll<HTMLButtonElement>("[data-category-button]") ?? [])].filter((button) => !button.closest("[hidden]"));
    const index = buttons.indexOf(event.target as HTMLButtonElement);
    if (index < 0) return;
    const direction = (event.key === "ArrowRight" ? 1 : -1) * (language === "ar" ? -1 : 1);
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + direction + buttons.length) % buttons.length;
    event.preventDefault(); buttons[next]?.focus();
  };
  const categoryButton = (category: (typeof HAZARD_CATEGORIES)[number]) => {
    return <button type="button" data-category-button data-category-id={category.id} key={category.id} aria-pressed={selected === category.id} onKeyDown={keyboard}
      onClick={() => { select(category.id); if (category.placement === "more") moreButton.current?.focus(); }} aria-label={category.name[language === "ar" ? "ar" : "en"]}>
      <HazardIcon categoryId={category.id} size={26} /><span className="hazard-category-copy"><Bilingual text={category.name} language={language} /><small>{hazardCategoryCounts[category.id]}</small></span>
    </button>;
  };
  return <nav className="hazard-category-navigation" aria-label={language === "ar" ? "فئات المخاطر" : "Hazard categories"} dir={language === "ar" ? "rtl" : "ltr"}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMoreOpen(false); }}>
    <div className="hazard-category-strip" ref={strip}>
      <button type="button" data-category-button data-category-id="all" onKeyDown={keyboard} aria-label={HAZARD_NAVIGATION.all[language === "ar" ? "ar" : "en"]} aria-pressed={selected === "all"} onClick={() => select("all")}><HazardIcon categoryId="all" size={26} /><span className="hazard-category-copy"><Bilingual text={HAZARD_NAVIGATION.all} language={language} /><small>{HAZARD_LIBRARY_RECORDS.length}</small></span></button>
      {HAZARD_CATEGORIES.filter((category) => category.placement === "primary").map(categoryButton)}
    </div>
    <div className="hazard-more-navigation">
      <button type="button" data-category-button ref={moreButton} aria-label={HAZARD_NAVIGATION.more[language === "ar" ? "ar" : "en"]} aria-expanded={moreOpen} aria-controls={panelId} className={moreSelected ? "is-active" : ""}
        onClick={() => setMoreOpen((current) => !current)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setMoreOpen(true); window.requestAnimationFrame(() => morePanel.current?.querySelector<HTMLButtonElement>("[data-category-id]")?.focus()); } else keyboard(event); }}>
        <MoreHorizontal size={20} aria-hidden="true" /><Bilingual text={HAZARD_NAVIGATION.more} language={language} /><ChevronDown size={14} aria-hidden="true" />
      </button>
      <div id={panelId} ref={morePanel} hidden={!moreOpen} className="hazard-more-panel"><div className="hazard-more-heading"><Bilingual text={{ en: "More categories", ar: "فئات أخرى" }} language={language} /><button type="button" aria-label={language === "ar" ? "إغلاق الفئات" : "Close categories"} onKeyDown={keyboard} onClick={() => { setMoreOpen(false); moreButton.current?.focus(); }}><X size={18} aria-hidden="true" /></button></div>{HAZARD_CATEGORIES.filter((category) => category.placement === "more").map(categoryButton)}</div>
    </div>
  </nav>;
}
