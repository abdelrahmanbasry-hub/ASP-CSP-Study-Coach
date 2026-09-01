import { ArrowLeftRight, Ban, ChevronDown, ClipboardCheck, HardHat, Settings } from "lucide-react";
import { Bilingual } from "../body-explorer/Bilingual";
import type { ExplorerLanguage } from "../hazardExplorer";
import { CONTROL_LEVELS, type HazardControls as Controls } from "../hazardTypes";
import { HAZARD_UI_COPY } from "../hazardCopy";

const icons = [Ban, ArrowLeftRight, Settings, ClipboardCheck, HardHat];
export function HazardControls({ controls, language }: { controls: Controls; language: ExplorerLanguage }) {
  return <section className="hazard-controls" aria-label={language === "ar" ? "التسلسل الهرمي للضوابط" : "Hierarchy of controls"}>
    <h4><Bilingual language={language} text={HAZARD_UI_COPY.controls} /></h4>
    <div className="hazard-control-steps">{CONTROL_LEVELS.map((level, index) => {
      const Icon = icons[index];
      return <details key={level.id} className="hazard-control-step" data-control-level={level.id}>
        <summary><span className="hazard-control-number">{index + 1}</span><Icon size={16} aria-hidden="true" /><strong><Bilingual text={level.name} language={language} /></strong><ChevronDown size={14} aria-hidden="true" /></summary>
        <div>{controls[level.id].length ? controls[level.id].map((value, i) => <p key={i}><Bilingual text={value} language={language} /></p>) : <p><Bilingual text={HAZARD_UI_COPY.unavailable} language={language} /></p>}</div>
      </details>;
    })}</div>
  </section>;
}
