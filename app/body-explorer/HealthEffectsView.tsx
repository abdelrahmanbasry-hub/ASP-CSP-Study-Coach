import type { CSSProperties } from "react";
import { BODY_SYSTEM_BY_ID, type BodySystemId } from "../bodySystems";
import type { OccupationalHealthRecord } from "../hazardData";
import type { ExplorerLanguage } from "../hazardExplorer";
import { Bilingual, ROLE_TEXT } from "./Bilingual";
import { ANATOMY_REGIONS, orderedCalloutTargets } from "./anatomyGeometry";

export function HealthEffectsView({ record, language, selectedSystem, hoveredSystem, onSelect, onHover }: {
  record: OccupationalHealthRecord; language: ExplorerLanguage; selectedSystem: BodySystemId | null; hoveredSystem: BodySystemId | null;
  onSelect: (id: BodySystemId) => void; onHover: (id: BodySystemId | null) => void;
}) {
  const sharedEffects = record.targets.filter((target) => target.effectsScope === "source-row").length > 1;
  return <div className="health-effects-view">
    <h4><Bilingual text={{ en: "Health effects by target", ar: "الآثار الصحية حسب الجهاز المستهدف" }} language={language} /></h4>
    {orderedCalloutTargets(record.targets).map((target) => <section key={target.systemId}
      className={`body-effect-card is-${target.role}${hoveredSystem === target.systemId ? " is-hovered" : ""}${selectedSystem === target.systemId ? " is-selected" : ""}`}
      style={{ "--callout-color": ANATOMY_REGIONS[target.systemId].accent } as CSSProperties}>
      <button type="button" data-callout-system={target.systemId} aria-pressed={selectedSystem === target.systemId}
        onClick={() => onSelect(target.systemId)} onMouseEnter={() => onHover(target.systemId)} onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(target.systemId)} onBlur={() => onHover(null)}>
        <span className="body-callout-dot" aria-hidden="true" />
        <span><Bilingual text={ROLE_TEXT[target.role]} language={language} className="body-role-label" />
          <Bilingual text={BODY_SYSTEM_BY_ID[target.systemId].text} language={language} className="body-callout-name" /></span>
      </button>
      {target.effectsScope === "source-row" && sharedEffects
        ? <small className="body-effect-shared-link"><Bilingual text={{ en: "Shared source effects below", ar: "آثار المصدر المشتركة أدناه" }} language={language} /></small>
        : <p className="body-effect-text"><Bilingual text={target.effects} language={language} /></p>}
    </section>)}
    {sharedEffects && <section className="body-effect-summary">
      <h4><Bilingual text={{ en: "Shared source effects", ar: "آثار المصدر المشتركة" }} language={language} /></h4>
      <p><Bilingual text={record.mainConsequences} language={language} /></p>
    </section>}
    <p className="body-source-note"><Bilingual text={{ en: "Original row summary. The source does not assign each effect to an individual organ unless explicitly indicated.", ar: "ملخص الصف الأصلي. لا يربط المصدر كل أثر بعضو منفرد إلا عند ذكر ذلك صراحة." }} language={language} /></p>
  </div>;
}
