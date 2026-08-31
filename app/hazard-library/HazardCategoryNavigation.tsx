import { Accessibility, ArrowUpFromLine, ChevronDown, Ear, Flame, FlaskConical, Forklift, Gauge, Grid2X2, Leaf, LockKeyhole, MoreHorizontal, Radiation, Settings, ShieldCheck, Shovel, SquareDashed, Thermometer, Wind, Workflow, X, Zap } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { HAZARD_CATEGORIES, HAZARD_CATEGORY_BY_ID, HAZARD_NAVIGATION, type HazardCategorySelection } from "../hazardCategories";
import { Bilingual } from "../body-explorer/Bilingual";
import type { ExplorerLanguage } from "../hazardExplorer";

const ICONS = { lungs: Wind, flask: FlaskConical, zap: Zap, flame: Flame, height: ArrowUpFromLine, gear: Settings, forklift: Forklift, person: Accessibility, radiation: Radiation, space: SquareDashed, lock: LockKeyhole, gauge: Gauge, ear: Ear, temperature: Thermometer, shovel: Shovel, workflow: Workflow, leaf: Leaf, shield: ShieldCheck };

export function HazardCategoryNavigation({ selected, onSelect, language }: { selected: HazardCategorySelection; onSelect: (category: HazardCategorySelection) => void; language: ExplorerLanguage }) {
  const [moreOpen, setMoreOpen] = useState(false);
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
    const Icon = ICONS[category.icon];
    return <button type="button" data-category-button data-category-id={category.id} key={category.id} aria-pressed={selected === category.id} onKeyDown={keyboard}
      onClick={() => { select(category.id); if (category.placement === "more") moreButton.current?.focus(); }} aria-label={category.name[language === "ar" ? "ar" : "en"]}>
      <Icon size={23} aria-hidden="true" /><Bilingual text={category.name} language={language} />
    </button>;
  };
  return <nav className="hazard-category-navigation" aria-label={language === "ar" ? "فئات المخاطر" : "Hazard categories"} dir={language === "ar" ? "rtl" : "ltr"}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMoreOpen(false); }}>
    <div className="hazard-category-strip">
      <button type="button" data-category-button data-category-id="all" onKeyDown={keyboard} aria-label={HAZARD_NAVIGATION.all[language === "ar" ? "ar" : "en"]} aria-pressed={selected === "all"} onClick={() => select("all")}><Grid2X2 size={23} aria-hidden="true" /><Bilingual text={HAZARD_NAVIGATION.all} language={language} /></button>
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
