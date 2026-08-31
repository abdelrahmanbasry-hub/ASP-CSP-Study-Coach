"use client";

import { Accessibility, CircleHelp, HeartPulse, Route, X } from "lucide-react";
import { useId, useRef, useState, type CSSProperties } from "react";
import { BODY_SYSTEMS, BODY_SYSTEM_BY_ID, type BodySystemId } from "../bodySystems";
import type { OccupationalHealthRecord } from "../hazardData";
import type { ExplorerLanguage, ExplorerMode } from "../hazardExplorer";
import { Bilingual, bilingualLabel, ROLE_TEXT } from "./Bilingual";
import { HumanBodySvg } from "./HumanBodySvg";
import { BodySystemCallouts } from "./BodySystemCallouts";
import { ExposureRouteView, RouteLabel } from "./ExposureRouteView";
import { HealthEffectsView } from "./HealthEffectsView";
import { BodySystemConnectors } from "./BodySystemConnectors";
import { ANATOMY_REGIONS } from "./anatomyGeometry";
import "./body-explorer.css";

const MODES = [
  { id: "systems", text: { en: "Body Systems", ar: "أجهزة الجسم" }, icon: Accessibility },
  { id: "routes", text: { en: "Exposure Route", ar: "مسار التعرض" }, icon: Route },
  { id: "effects", text: { en: "Health Effects", ar: "الآثار الصحية" }, icon: HeartPulse },
] as const;

export function BodySystemExplorer({ record, language, selectedSystem, onSelect, onClear }: {
  record?: OccupationalHealthRecord; language: ExplorerLanguage; selectedSystem: BodySystemId | null; onSelect: (id: BodySystemId) => void; onClear: () => void;
}) {
  const [mode, setMode] = useState<ExplorerMode>("systems");
  const [hoveredSystem, setHoveredSystem] = useState<BodySystemId | null>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const primary = record?.targets.find((target) => target.role === "primary");
  return <section className="body-system-explorer" aria-label="Body system explorer" data-language={language}
    style={{ "--body-primary": primary ? ANATOMY_REGIONS[primary.systemId].accent : "#008d78" } as CSSProperties}>
    <header className="body-explorer-heading">
      <div><h3>{record ? <Bilingual text={record.hazardDisease} language={language} /> : <Bilingual text={{ en: "Explore a body system", ar: "استكشف أحد أجهزة الجسم" }} language={language} />}</h3></div>
      {record && mode === "systems" && <div className="body-route-summary"><span className="body-role-label"><Bilingual text={{ en: "Exposure route", ar: "مسار التعرض" }} language={language} /></span>
        {record.exposureRoutes.length ? record.exposureRoutes.map((route) => <div key={route}><RouteLabel route={route} language={language} /></div>) : <Bilingual text={{ en: "See source wording", ar: "راجع نص المصدر" }} language={language} />}</div>}
    </header>
    {selectedSystem && <div className="body-filter-banner"><Bilingual text={{ en: `Filtering: ${BODY_SYSTEM_BY_ID[selectedSystem].label}`, ar: `تصفية: ${BODY_SYSTEM_BY_ID[selectedSystem].text.ar}` }} language={language} /><button type="button" onClick={onClear}><X size={14} aria-hidden="true" /><Bilingual text={{ en: "Clear filter", ar: "مسح التصفية" }} language={language} /></button></div>}
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${mode}`} className={`body-explorer-stage mode-${mode}`} ref={stageRef}>
      <div className="body-anatomy"><HumanBodySvg record={record} language={language} selectedSystem={selectedSystem} hoveredSystem={hoveredSystem}
        onSelect={onSelect} onHover={setHoveredSystem} showCallouts={mode !== "routes"} routes={mode === "routes" ? record?.exposureRoutes : undefined} />
        <p className="body-anatomy-caption"><Bilingual text={{ en: "Schematic anatomy · not to scale", ar: "رسم تشريحي مبسّط · غير مقياسي" }} language={language} /></p>
      </div>
      <div className="body-explorer-context">
        {mode === "systems" && <BodySystemCallouts record={record} language={language} selectedSystem={selectedSystem} hoveredSystem={hoveredSystem} onSelect={onSelect} onHover={setHoveredSystem} />}
        {mode === "routes" && record && <ExposureRouteView record={record} language={language} />}
        {mode === "effects" && record && <HealthEffectsView record={record} language={language} selectedSystem={selectedSystem} hoveredSystem={hoveredSystem} onSelect={onSelect} onHover={setHoveredSystem} />}
        {!record && <p className="body-source-note"><Bilingual text={{ en: "No matching hazards. Choose another system or clear the filter.", ar: "لا توجد مخاطر مطابقة. اختر جهازًا آخر أو امسح التصفية." }} language={language} /></p>}
      </div>
      {mode !== "routes" && record && <BodySystemConnectors key={mode} stageRef={stageRef} targets={record.targets} hoveredSystem={hoveredSystem} selectedSystem={selectedSystem} />}
    </div>
    <div className="body-explorer-tabs" role="tablist" aria-label="Explorer modes">{MODES.map((item, index) => {
      const Icon = item.icon;
      return <button type="button" role="tab" id={`${id}-${item.id}`} key={item.id} aria-selected={mode === item.id} aria-controls={`${id}-panel`} tabIndex={mode === item.id ? 0 : -1}
        ref={(element) => { tabs.current[index] = element; }} onClick={() => setMode(item.id)}
        onKeyDown={(event) => {
          const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : null;
          if (next !== null) { event.preventDefault(); setMode(MODES[next].id); tabs.current[next]?.focus(); }
        }}><Icon size={17} aria-hidden="true" /><Bilingual text={item.text} language={language} /></button>;
    })}</div>
    <div className="body-explorer-legend">{(["primary", "secondary", "inactive"] as const).map((role) => <span key={role}><i className={`body-legend-symbol is-${role}`} aria-hidden="true" /><Bilingual text={ROLE_TEXT[role]} language={language} /></span>)}
      <span><i className="body-legend-symbol is-selected" aria-hidden="true" /><Bilingual text={{ en: "Selected system", ar: "الجهاز المحدد" }} language={language} /></span>
    </div>
    <p className="body-explorer-help"><CircleHelp size={14} aria-hidden="true" /><Bilingual text={{ en: "Select a region to find hazards affecting that system.", ar: "اختر منطقة لعرض المخاطر التي تؤثر في ذلك الجهاز." }} language={language} /></p>
    <details className="body-system-index"><summary><Accessibility size={15} aria-hidden="true" /><Bilingual text={{ en: "Browse all 17 body systems", ar: "تصفح أجهزة الجسم الـ١٧" }} language={language} /></summary>
      <div>{BODY_SYSTEMS.map((system) => <button type="button" key={system.id} aria-label={bilingualLabel(system.text, language)} aria-pressed={selectedSystem === system.id} onClick={() => onSelect(system.id)}><Bilingual text={system.text} language={language} /></button>)}</div>
    </details>
    <details className="body-mapping-note"><summary><Bilingual text={{ en: "How to read the highlights", ar: "كيفية قراءة التمييز" }} language={language} /></summary><Bilingual text={{ en: "Primary: named in the source target column. Secondary: explicitly mentioned in the source effects. These labels describe the source, not clinical severity. Unlisted systems are not proof of no effect. Blood uses distributed tissue highlights; marrow is shown within the sternum, pelvis and upper femurs. These are simplified representative regions, not complete anatomical maps.", ar: "رئيسي: مذكور في عمود الأعضاء المستهدفة. ثانوي: مذكور صراحة ضمن آثار المصدر. تصف التسميات المصدر لا الشدة السريرية. غياب الجهاز لا يثبت عدم تأثره. يُمثَّل الدم بتظليل موزَّع في الأنسجة، ونخاع العظم داخل القص والحوض وأعلى عظمَي الفخذ. هذه مناطق تمثيلية مبسَّطة وليست خرائط تشريحية كاملة." }} language={language} /></details>
  </section>;
}
