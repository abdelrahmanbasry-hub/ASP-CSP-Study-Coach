import { Accessibility, GitBranch, Network, Settings2, UserRound } from "lucide-react";
import { BodySystemExplorer } from "../body-explorer/BodySystemExplorer";
import { Bilingual, bilingualLabel } from "../body-explorer/Bilingual";
import type { BodySystemId } from "../bodySystems";
import type { ExplorerLanguage } from "../hazardExplorer";
import type { HazardRecord, PlaceholderVisualizationKind } from "../hazardTypes";
import { WorkerHazardScene } from "../hazard-scenes/WorkerHazardScene";
import { EquipmentHazardScene } from "../hazard-scenes/EquipmentHazardScene";
import { ProcessHazardDiagram } from "../hazard-scenes/ProcessHazardDiagram";
import { ConceptVisualization } from "../hazard-scenes/ConceptVisualization";

const SCENE_ENGINES = { "worker-scene": WorkerHazardScene, "equipment-scene": EquipmentHazardScene, "process-diagram": ProcessHazardDiagram, "concept-diagram": ConceptVisualization };

export const PLACEHOLDER_ENGINES = {
  "worker-scene": { name: { en: "Worker scene", ar: "رسم توضيحي للعامل" }, icon: UserRound },
  "equipment-scene": { name: { en: "Equipment scene", ar: "رسم توضيحي للمعدات" }, icon: Settings2 },
  "process-diagram": { name: { en: "Process diagram", ar: "مخطط العملية" }, icon: GitBranch },
  "concept-diagram": { name: { en: "Concept diagram", ar: "مخطط المفهوم" }, icon: Network },
} as const;

export function PlaceholderVisualization({ kind, language }: { kind: PlaceholderVisualizationKind; language: ExplorerLanguage }) {
  const engine = PLACEHOLDER_ENGINES[kind];
  const Icon = engine.icon;
  return <section className="hazard-visualization-placeholder" data-visualization-engine={kind} aria-label={bilingualLabel(engine.name, language)}>
    <span className="hazard-placeholder-icon"><Icon size={36} aria-hidden="true" /></span>
    <Bilingual className="hazard-reference-badge" text={{ en: "Architecture reference", ar: "نموذج مرجعي للعرض" }} language={language} />
    <h3><Bilingual text={engine.name} language={language} /></h3>
    <p><Bilingual text={{ en: "This visualization engine is ready to receive future content. No scene or safety procedure has been authored for this reference record.", ar: "محرك العرض جاهز لاستقبال المحتوى مستقبلًا. لم يُعدّ أي مشهد أو إجراء سلامة لهذا السجل المرجعي." }} language={language} /></p>
  </section>;
}

export function HazardVisualization({ record, language, selectedSystem, onSelectSystem, onClearSystem, bodyContext = false, selectedOverlayId, onSelectOverlay }: {
  record?: HazardRecord; language: ExplorerLanguage; selectedSystem: BodySystemId | null;
  onSelectSystem: (id: BodySystemId) => void; onClearSystem: () => void; bodyContext?: boolean;
  selectedOverlayId?: string | null; onSelectOverlay?: (id: string | null) => void;
}) {
  if (record?.visualization.kind === "body-system" || (!record && bodyContext)) return <div className="hazard-visualization-body" data-visualization-engine="body-system">
    <BodySystemExplorer record={record?.visualization.kind === "body-system" ? record.visualization.occupationalHealth : undefined}
      language={language} selectedSystem={selectedSystem} onSelect={onSelectSystem} onClear={onClearSystem} />
  </div>;
  if (record?.visualization.status === "implemented") {
    const Engine = SCENE_ENGINES[record.visualization.kind];
    return <Engine key={record.id} config={record.visualization} name={record.name} language={language} consequences={record.consequences} selectedOverlayId={selectedOverlayId} onSelectOverlay={onSelectOverlay} />;
  }
  if (record) return <PlaceholderVisualization kind={record.visualization.kind} language={language} />;
  return <section className="hazard-visualization-placeholder"><Accessibility size={32} aria-hidden="true" /><h3><Bilingual text={{ en: "No matching record", ar: "لا توجد نتيجة مطابقة" }} language={language} /></h3><p><Bilingual text={{ en: "Try another category or clear the search.", ar: "اختر فئة أخرى أو أزل عبارة البحث." }} language={language} /></p></section>;
}
