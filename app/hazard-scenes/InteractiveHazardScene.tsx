"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Check, Clock3, HeartPulse, Info, Layers, MoveHorizontal, Route, ShieldCheck } from "lucide-react";
import { Bilingual, bilingualLabel } from "../body-explorer/Bilingual";
import type { BilingualText } from "../hazardData";
import type { ExplorerLanguage } from "../hazardExplorer";
import type { SceneMode, SceneOverlay, SceneShape, SceneVisualizationConfig } from "../hazardTypes";
import { ENERGY_LABELS, SCENE_ENGINES, SCENE_ROLES, overlayRoleLabel } from "./sceneLabels";
import { SCENE_TEMPLATES, supportsSceneEngine } from "./sceneTemplates";
import "./hazard-scenes.css";

export interface HazardSceneProps {
  config: SceneVisualizationConfig;
  name: BilingualText;
  language: ExplorerLanguage;
  consequences?: readonly BilingualText[];
  selectedOverlayId?: string | null;
  onSelectOverlay?: (id: string | null) => void;
}
const PRINCIPLE_ICONS = { clock: Clock3, distance: MoveHorizontal, shield: ShieldCheck };

function Shape({ shape, arrowId }: { shape: SceneShape; arrowId: string }) {
  if (shape.type === "ellipse") return <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} className="scene-zone" />;
  if (shape.type === "rect") return <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={12} className="scene-zone" />;
  if (shape.type === "path") return <path d={shape.d} className={shape.fill ? "scene-zone" : "scene-path"} markerEnd={shape.arrow ? `url(#${arrowId})` : undefined} />;
  const points = Array.from({ length: 24 }, (_, i) => {
    const angle = Math.PI * i / 12, radius = shape.radius * (i % 2 ? .32 : 1);
    return `${shape.cx + Math.cos(angle) * radius},${shape.cy + Math.sin(angle) * radius}`;
  }).join(" ");
  return <g className="scene-arc-event"><circle cx={shape.cx} cy={shape.cy} r={shape.radius * 1.45} className="scene-arc-glow" /><polygon points={points} /><circle cx={shape.cx} cy={shape.cy} r={shape.radius * .16} className="scene-arc-core" /></g>;
}

function navigateGroup(event: KeyboardEvent<HTMLElement>) {
  // Explicit activation also supports hosts that forward keyboard events without native defaults.
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.currentTarget.click();
    return;
  }
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  const buttons = Array.from(event.currentTarget.closest('[role="group"]')!.querySelectorAll<HTMLButtonElement>("button"));
  const index = buttons.indexOf(event.target as HTMLButtonElement);
  if (index < 0) return;
  event.preventDefault();
  const rtl = event.currentTarget.closest('[dir="rtl"]') && !event.currentTarget.closest('.scene-stage[dir="ltr"]');
  const backward = event.key === "ArrowUp" || event.key === (rtl ? "ArrowRight" : "ArrowLeft");
  buttons[event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (backward ? -1 : 1) + buttons.length) % buttons.length]?.focus();
}

/** Shared rendering/interaction; all equipment, zones and callouts come from configuration. */
export function InteractiveHazardScene({ config, name, language, consequences = [], selectedOverlayId, onSelectOverlay }: HazardSceneProps) {
  const [landmarkId, setLandmarkId] = useState<string | null>(null);
  const [localSelection, setLocalSelection] = useState<string | null>(null);
  const [mode, setMode] = useState<SceneMode>("scene");
  const [imageFailed, setImageFailed] = useState(false);
  const uid = useId().replace(/:/g, "");
  const selectedId = selectedOverlayId === undefined ? localSelection : selectedOverlayId;
  const landmark = config.landmarks?.find(item => item.id === landmarkId);
  const selected = config.overlays.find((overlay) => overlay.id === selectedId);
  const template = SCENE_TEMPLATES[config.template];
  const engine = SCENE_ENGINES[config.kind];
  const text = (value: BilingualText) => <Bilingual text={value} language={language} />;
  const select = (id: string | null) => { setLandmarkId(null); const next = id === selectedId ? null : id; setLocalSelection(next); onSelectOverlay?.(next); };
  const modes = [
    { id: "scene", label: engine.name, icon: Layers },
    { id: "mechanism", label: engine.mechanism, icon: Route },
    { id: "effects", label: { en: "Health effects", ar: "الآثار الصحية" }, icon: HeartPulse },
  ] as const;
  const isVisible = (overlay: SceneOverlay) => overlay.role !== "inactive" && (!overlay.modes || overlay.modes.includes(mode))
    && (selectedId === overlay.id || mode === "mechanism" || (mode === "effects" ? ["worker", "zone", "condition", "principle"].includes(overlay.semantic) : overlay.semantic !== "path" || config.kind === "process-diagram"));

  if (!template || !supportsSceneEngine(template, config.kind)) return <section className="hazard-scene scene-unavailable" data-visualization-engine={config.kind}>
    <h3>{text({ en: "Scene template unavailable", ar: "قالب المشهد غير متاح" })}</h3><p>{text(config.description)}</p>
  </section>;

  return <section className="hazard-scene" data-visualization-engine={config.kind} data-template={config.template} data-mode={mode} aria-label={bilingualLabel(engine.name, language)}>
    <header className="scene-heading"><div><span className="scene-engine-badge">{text(engine.name)}</span><h3>{text(name)}</h3></div><span className="scene-study-label">{text({ en: "Interactive reference", ar: "مرجع تفاعلي" })}</span></header>
    {config.overlays.some((overlay) => overlay.semantic === "principle") && <div className="scene-principles" role="group" aria-label={language === "ar" ? "المبادئ" : "Principles"}>
      {config.overlays.filter((overlay) => overlay.semantic === "principle").map((overlay) => {
        const Icon = overlay.icon ? PRINCIPLE_ICONS[overlay.icon] : ShieldCheck;
        return <button type="button" key={overlay.id} aria-pressed={selectedId === overlay.id} onClick={() => select(overlay.id)} onKeyDown={navigateGroup}><Icon size={27} aria-hidden="true" />{text(overlay.label)}</button>;
      })}
    </div>}
    <div className="scene-stage" dir="ltr">
      {/* Static optimized WebP is intentional: this Vinext client does not use a Next image service. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {!imageFailed && <img src={template.asset} width={template.width} height={template.height} alt={bilingualLabel(config.description, language)} loading="lazy" decoding="async" onError={() => setImageFailed(true)} />}
      {imageFailed && <p className="scene-image-error">{text({ en: "Illustration unavailable. All scene descriptions remain accessible below.", ar: "الرسم غير متاح. تبقى جميع أوصاف المشهد متاحة أدناه." })}</p>}
      <svg className="scene-overlay-layer" viewBox="0 0 1000 1000" aria-hidden="true">
        <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" /></marker></defs>
        {config.overlays.map((overlay) => <g key={overlay.id} data-overlay-shape={overlay.id} data-role={overlay.role} data-semantic={overlay.semantic} data-selected={selectedId === overlay.id} className={isVisible(overlay) ? "scene-overlay is-visible" : "scene-overlay"}>
          {overlay.shapes.map((shape, index) => <Shape key={index} shape={shape} arrowId={`${uid}-arrow`} />)}
        </g>)}
        {config.overlays.map((overlay) => overlay.marker && <g className="scene-marker-connector" key={overlay.id} data-connector={overlay.id} data-selected={selectedId === overlay.id}>
          <path d={`M${overlay.point[0]} ${overlay.point[1]} L${overlay.marker[0]} ${overlay.marker[1]}`} /><circle cx={overlay.point[0]} cy={overlay.point[1]} r="5" />
        </g>)}
        {landmark && <g className="scene-landmark-focus" data-landmark-focus={landmark.id}>{landmark.shapes.map((shape, index) => <Shape key={index} shape={shape} arrowId={`${uid}-arrow`} />)}<circle cx={landmark.point[0]} cy={landmark.point[1]} r="6" /></g>}
      </svg>
      <div className="scene-markers" role="group" aria-label={language === "ar" ? "نقاط المشهد" : "Scene points"}>
        {config.overlays.map((overlay, index) => {
          const point = overlay.marker ?? overlay.point;
          return <button type="button" key={overlay.id} onKeyDown={navigateGroup} className="scene-marker" style={{ left: `${point[0] / 10}%`, top: `${point[1] / 10}%` }} data-overlay-id={overlay.id} data-role={overlay.role} data-semantic={overlay.semantic} aria-pressed={selectedId === overlay.id} aria-label={`${index + 1}. ${bilingualLabel(overlay.label, language)} — ${bilingualLabel(overlayRoleLabel(overlay), language)}`} onClick={() => select(overlay.id)}><span>{index + 1}</span></button>;
        })}
      </div>
    </div>
    <p className="scene-scale-note">{text({ en: "Illustrative positions and zones · not to scale", ar: "مواضع ومناطق توضيحية · ليست بمقياس رسم" })}</p>
    <div className="scene-modes" role="group" aria-label={language === "ar" ? "أوضاع المشهد" : "Scene modes"}>{modes.map(({ id, label, icon: Icon }) => <button key={id} onKeyDown={navigateGroup} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}><Icon size={18} aria-hidden="true" />{text(label)}</button>)}</div>
    <div className="scene-callout-heading"><h4>{text(mode === "effects" ? { en: "Effects & affected areas", ar: "الآثار والمناطق المتأثرة" } : config.kind === "concept-diagram" ? { en: "Core principles", ar: "المبادئ الأساسية" } : { en: "Explore the scene", ar: "استكشف المشهد" })}</h4>{selected && <button type="button" onClick={() => select(null)}>{text({ en: "Clear selection", ar: "مسح الاختيار" })}</button>}</div>
    {mode === "effects" && <div className="scene-effects" role="status">{text({ en: "Hazard-level effects; select a callout for its specific context.", ar: "آثار على مستوى الخطر؛ اختر تعليقًا لسياقه المحدد." })}{consequences.map((value, i) => <p key={i}>{text(value)}</p>)}</div>}
    <div className="scene-selection-summary" role="status" aria-live="polite">{selected ? <><strong>{text(selected.label)}</strong><p>{text(selected.description)}</p>{mode === "effects" && selected.consequences?.map((value, index) => <p key={index}>{text(value)}</p>)}</> : <p><Info size={15} aria-hidden="true" />{text({ en: "Select a numbered point or callout to focus the scene and related details.", ar: "اختر نقطة مرقمة أو تعليقًا للتركيز على المشهد والتفاصيل المرتبطة." })}</p>}</div>
    <div className="scene-callouts" role="group" aria-label={language === "ar" ? "تعليقات المشهد" : "Scene callouts"} dir={language === "ar" ? "rtl" : "ltr"}>
      {config.overlays.map((overlay, index) => <button type="button" onKeyDown={navigateGroup} className="scene-callout" key={overlay.id} data-callout-id={overlay.id} data-role={overlay.role} data-semantic={overlay.semantic} aria-pressed={selectedId === overlay.id} onClick={() => select(overlay.id)}>
        <span className="scene-callout-number" aria-hidden="true">{index + 1}</span><span className="scene-callout-copy"><strong>{text(overlay.label)}</strong><small>{text(overlayRoleLabel(overlay))}{overlay.energy && <span className="scene-energy">{text(ENERGY_LABELS[overlay.energy])}</span>}</small></span>{selectedId === overlay.id ? <Check size={16} aria-hidden="true" /> : <ArrowUpRight size={15} aria-hidden="true" />}
      </button>)}
    </div>
    {!!config.landmarks?.length && <details className="scene-landmarks" open={Boolean(landmark)}><summary>{text({ en: "Locate scene elements", ar: "تحديد عناصر المشهد" })}</summary><div role="group" aria-label={language === "ar" ? "عناصر المشهد" : "Scene landmarks"} dir={language === "ar" ? "rtl" : "ltr"}>{config.landmarks.map(item => <button type="button" key={item.id} data-landmark-id={item.id} aria-pressed={landmarkId === item.id} onKeyDown={navigateGroup} onClick={() => { setLandmarkId(landmarkId === item.id ? null : item.id); setLocalSelection(null); onSelectOverlay?.(null); }}>{text(item.label)}</button>)}</div>{landmark && <p role="status">{text({ en: "Located element", ar: "العنصر المحدد" })}: <strong>{text(landmark.label)}</strong></p>}</details>}
    {config.note && <p className="scene-config-note">{text(config.note)}</p>}
    <div className="scene-legend" aria-label={language === "ar" ? "مفتاح المشهد" : "Scene legend"}>{Object.entries(SCENE_ROLES).map(([role, label]) => <span key={role} data-role={role}><i aria-hidden="true" />{text(label)}</span>)}</div>
  </section>;
}
