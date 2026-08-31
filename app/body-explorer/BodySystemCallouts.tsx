import { BODY_SYSTEM_BY_ID, type BodySystemId } from "../bodySystems";
import type { OccupationalHealthRecord } from "../hazardData";
import type { ExplorerLanguage } from "../hazardExplorer";
import { Bilingual, ROLE_TEXT } from "./Bilingual";
import type { CSSProperties } from "react";
import { ANATOMY_REGIONS, orderedCalloutTargets } from "./anatomyGeometry";

export function BodySystemCallouts({ record, language, selectedSystem, hoveredSystem, onSelect, onHover }: {
  record?: OccupationalHealthRecord; language: ExplorerLanguage; selectedSystem: BodySystemId | null; hoveredSystem: BodySystemId | null;
  onSelect: (id: BodySystemId) => void; onHover: (id: BodySystemId | null) => void;
}) {
  return <div className="body-system-callouts">
    {orderedCalloutTargets(record?.targets ?? []).map((target) => <button type="button" key={target.systemId}
      data-callout-system={target.systemId} style={{ "--callout-color": ANATOMY_REGIONS[target.systemId].accent } as CSSProperties}
      className={`body-callout is-${target.role}${hoveredSystem === target.systemId ? " is-hovered" : ""}`}
      onClick={() => onSelect(target.systemId)} aria-pressed={selectedSystem === target.systemId}
      onMouseEnter={() => onHover(target.systemId)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(target.systemId)} onBlur={() => onHover(null)}>
      <span className="body-callout-dot" aria-hidden="true" />
      <span><Bilingual className="body-role-label" text={ROLE_TEXT[target.role]} language={language} />
        <Bilingual className="body-callout-name" text={BODY_SYSTEM_BY_ID[target.systemId].text} language={language} /></span>
    </button>)}
    {record && !record.targets.length && <p className="body-source-note"><Bilingual language={language} text={{ en: "Target mapping needs review. See the original record.", ar: "يحتاج ربط الأعضاء إلى مراجعة. انظر السجل الأصلي." }} /></p>}
  </div>;
}
