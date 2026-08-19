"use client";

import { Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import {
  BODY_SYSTEMS,
  getQuestionVisual,
  type BodySystemId,
  type QuestionVisual,
  type VisualKind,
} from "./visualLearning";

type QuestionVisualAidProps = {
  id?: string;
  stem: string;
  topic?: string;
  reveal?: boolean;
  compact?: boolean;
};

export function QuestionVisualAid({
  id,
  stem,
  topic,
  reveal = false,
  compact = false,
}: QuestionVisualAidProps) {
  const visual = getQuestionVisual({ id, stem, topic });
  const [manualAnnotations, setManualAnnotations] = useState<boolean | null>(null);
  const showAnnotations = manualAnnotations ?? reveal;

  return (
    <aside className={`visual-evidence ${compact ? "compact" : ""}`} aria-label={`Visual evidence: ${visual.title}`}>
      <header className="visual-evidence-head">
        <div>
          <span className="visual-eyebrow">Visual evidence</span>
          <h2>{visual.title}</h2>
        </div>
        {reveal ? (
          <button className="visual-label-toggle" type="button" onClick={() => setManualAnnotations((current) => !(current ?? reveal))}>
            {showAnnotations ? <EyeOff size={15} /> : <Eye size={15} />}
            {showAnnotations ? "Hide callouts" : "Show callouts"}
          </button>
        ) : (
          <span className="visual-observe-badge"><Eye size={14} /> Observe first</span>
        )}
      </header>
      <div className="visual-evidence-layout">
        <SceneArtwork visual={visual} showAnnotations={showAnnotations} />
        <div className="visual-evidence-copy">
          <p className="visual-prompt">{showAnnotations ? "Use the numbered evidence to test the decision." : visual.prompt}</p>
          {showAnnotations ? (
            <ol className="visual-callout-list">
              {visual.annotations.map((annotation) => (
                <li key={annotation.number}>
                  <span>{annotation.number}</span>
                  <div><strong>{annotation.label}</strong><p>{annotation.detail}</p></div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="visual-lock-note"><Info size={15} /><span>Answer first. The evidence labels appear with the explanation so the diagram does not give away the decision.</span></div>
          )}
          <p className="visual-caption">{visual.caption}</p>
        </div>
      </div>
    </aside>
  );
}

function SceneArtwork({ visual, showAnnotations }: { visual: QuestionVisual; showAnnotations: boolean }) {
  return (
    <div className={`scene-art scene-${visual.kind}`} role="img" aria-label={visual.caption}>
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="sceneSky" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#edf4f3" /><stop offset="1" stopColor="#dce9e5" /></linearGradient>
          <linearGradient id="sceneFloor" x1="0" x2="1"><stop stopColor="#c4d2d0" /><stop offset="1" stopColor="#e4d9c5" /></linearGradient>
          <pattern id="sceneGrid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" fill="none" stroke="#76949a" strokeOpacity=".16" strokeWidth=".5" /></pattern>
        </defs>
        <rect width="100" height="100" fill="url(#sceneSky)" />
        <rect width="100" height="100" fill="url(#sceneGrid)" opacity=".55" />
        <path d="M0 76H100V100H0Z" fill="url(#sceneFloor)" />
        <SceneSubject kind={visual.kind} />
        {showAnnotations && visual.annotations.map((annotation) => (
          <g key={annotation.number} className="scene-marker" transform={`translate(${annotation.x} ${annotation.y})`}>
            <circle r="4.5" fill="#173647" stroke="#fffdf8" strokeWidth="1.5" />
            <text textAnchor="middle" dominantBaseline="central" fill="#fffdf8" fontSize="4.2" fontWeight="800">{annotation.number}</text>
          </g>
        ))}
      </svg>
      <span className="scene-art-label">Conceptual learning diagram</span>
    </div>
  );
}

function SceneSubject({ kind }: { kind: VisualKind }) {
  const line = { stroke: "#173647", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const person = (x: number, y: number, color = "#315e6f") => <g transform={`translate(${x} ${y})`} fill="none" {...line}><circle cx="0" cy="-8" r="4" fill="#f2c39a" stroke="none" /><path d="M0-4V11M-7 1L0-1 7 3M-5 21L0 11 5 21" stroke={color} strokeWidth="3" /></g>;
  if (kind === "ladder") return <>
    <rect x="8" y="12" width="82" height="64" rx="3" fill="#f7f4ec" stroke="#cbd7d5" />
    <path d="M23 76L48 20M36 76L61 20" {...line} strokeWidth="2.5" /><path d="M31 59H48M35 49H52M39 39H56M43 29H60" {...line} />
    <path d="M62 20H85" {...line} strokeWidth="3" /><path d="M77 20V31" {...line} strokeWidth="2" /><path d="M85 20V48" {...line} strokeWidth="2" />
    <path d="M12 76H90" {...line} stroke="#6c847f" strokeWidth="2" />
    {person(51, 54)}
    <path d="M74 36l7-7m-2 7 2-7m-7 2 7-2" {...line} stroke="#c67658" />
  </>;
  if (kind === "scaffold") return <>
    <path d="M18 78V15M42 78V15M67 78V15M85 78V15M14 22H89M14 48H89M14 76H89" {...line} strokeWidth="2.2" />
    <path d="M18 72L42 48M42 72L18 48M42 48L67 22M67 48L42 22M67 72L85 48M85 72L67 48" {...line} stroke="#4c777a" />
    <path d="M13 18H90M13 12H90M20 16V3M84 16V3" {...line} strokeWidth="1.7" />
    <path d="M8 77H94" {...line} stroke="#6c847f" strokeWidth="2.5" />
    <path d="M26 76L14 51M30 76L20 51M18 67H27M16 60H24" {...line} />
    {person(61, 38)}
  </>;
  if (kind === "crane") return <>
    <path d="M10 76H42L36 69H12Z" fill="#d5a856" stroke="#173647" strokeWidth="1.4" /><path d="M28 70V24M27 25L72 8M29 28L18 17" {...line} strokeWidth="3" />
    <path d="M31 29L72 10M50 76L28 25M72 10L77 22" {...line} stroke="#5d7880" strokeWidth="1" />
    <path d="M63 13V44" {...line} strokeWidth="1.3" /><path d="M60 44Q63 51 67 44" {...line} stroke="#d3655d" />
    <rect x="53" y="49" width="20" height="16" rx="1.5" fill="#dca35d" stroke="#173647" strokeWidth="1.2" /><path d="M54 49L63 44L72 49" {...line} strokeWidth="1" />
    <path d="M49 72H80" stroke="#d3655d" strokeWidth="1.5" strokeDasharray="3 2" />
    {person(84, 69, "#bf7553")}
  </>;
  if (kind === "excavation") return <>
    <path d="M0 45H100" {...line} stroke="#907658" strokeWidth="2" /><path d="M24 45L34 81H72L80 45" fill="#506f75" stroke="#173647" strokeWidth="1.5" />
    <path d="M26 45L34 78M79 45L71 78" {...line} stroke="#dce9e5" strokeWidth="1" /><path d="M8 39Q18 26 29 40" fill="#caa96f" stroke="#907658" strokeWidth="1" />
    <path d="M76 34H93V43H76Z" fill="#d5a856" stroke="#173647" strokeWidth="1.2" /><circle cx="80" cy="46" r="3" fill="#315e6f" /><circle cx="90" cy="46" r="3" fill="#315e6f" />
    <path d="M64 45V70M64 70L72 77M64 70L56 77" {...line} stroke="#e5d7b9" strokeWidth="1.3" />
    {person(49, 68)}
  </>;
  if (kind === "electrical") return <>
    <rect x="12" y="22" width="32" height="49" rx="3" fill="#e6ece9" stroke="#173647" strokeWidth="1.6" /><rect x="18" y="29" width="20" height="29" rx="1" fill="#274e5c" />
    <path d="M29 30L22 44H29L25 56L36 39H29Z" fill="#f3c765" stroke="#f3c765" /><path d="M50 22V76" stroke="#d3655d" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M62 24H88V67H62Z" fill="none" stroke="#629080" strokeWidth="1.5" strokeDasharray="4 2" />
    {person(75, 67)}
    <circle cx="30" cy="67" r="4" fill="#6a947b" stroke="#fffdf8" strokeWidth="1" /><path d="M28 67l2 2 4-5" fill="none" stroke="#fffdf8" strokeWidth="1.4" />
  </>;
  if (kind === "machinery") return <>
    <rect x="15" y="42" width="54" height="29" rx="3" fill="#5c7b7d" stroke="#173647" strokeWidth="1.5" /><rect x="23" y="48" width="38" height="11" rx="2" fill="#d6e4e0" stroke="#173647" strokeWidth="1" />
    {[28, 40, 52].map((x) => <circle key={x} cx={x} cy="54" r="4" fill="#315e6f" />)}
    <path d="M41 42V25H63V42M46 25V34M57 25V34" {...line} stroke="#d3a456" strokeWidth="2" />
    <path d="M66 70H86" {...line} stroke="#d3655d" strokeWidth="2" /><circle cx="71" cy="70" r="4" fill="#d3655d" />
    {person(82, 70, "#bf7553")}
  </>;
  if (kind === "exposure") return <>
    <rect x="12" y="55" width="23" height="22" rx="2" fill="#d6a655" stroke="#173647" strokeWidth="1.4" /><path d="M17 55V41H30V55" {...line} strokeWidth="1.5" />
    <path d="M35 55C47 45 49 32 61 33" fill="none" stroke="#669da0" strokeWidth="2.5" strokeDasharray="2 2" /><path d="M36 61C49 64 52 69 62 69" fill="none" stroke="#d3655d" strokeWidth="2" strokeDasharray="2 2" />
    {person(72, 70)}
    <ellipse cx="73" cy="44" rx="12" ry="9" fill="#a2c7c0" opacity=".6" /><path d="M51 23V49M43 23H59" {...line} stroke="#6a947b" strokeWidth="3" /><path d="M45 26L51 20 57 26" fill="none" stroke="#6a947b" strokeWidth="1.4" />
  </>;
  if (kind === "biological") return <>
    <rect x="12" y="56" width="26" height="20" rx="3" fill="#d9e7e0" stroke="#173647" strokeWidth="1.3" /><path d="M17 55V41H32V55" {...line} strokeWidth="1.5" />
    <path d="M39 52C49 43 51 39 62 40" fill="none" stroke="#9a6eac" strokeWidth="2" strokeDasharray="2 2" />
    {[45, 51, 57].map((x, i) => <circle key={x} cx={x} cy={49 - i * 3} r="2.2" fill="#9a6eac" />)}
    {person(73, 70, "#536f8d")}
    <path d="M59 21H88V50H59Z" fill="#eef4f2" stroke="#5d897f" strokeWidth="1.5" /><path d="M64 38H83" stroke="#5d897f" strokeWidth="2" /><path d="M67 31H80" stroke="#5d897f" strokeWidth="1" />
  </>;
  if (kind === "fire") return <>
    <rect x="13" y="57" width="26" height="19" rx="3" fill="#ca9554" stroke="#173647" strokeWidth="1.4" /><path d="M18 57V43H34V57" {...line} strokeWidth="1.4" />
    <path d="M45 73C38 61 47 58 47 48C55 55 58 59 56 66C62 59 66 64 65 72Z" fill="#e16e43" /><path d="M49 71C45 64 52 60 51 55C57 62 58 65 56 71Z" fill="#f4c55d" />
    <path d="M63 38l4-7m1 10 7-4m-4 10h8" {...line} stroke="#d3655d" strokeWidth="1.6" />
    <path d="M76 74H91" stroke="#6a947b" strokeWidth="2" strokeDasharray="3 2" />
    {person(84, 72, "#315e6f")}
  </>;
  if (kind === "ergonomics") return <>
    <rect x="20" y="60" width="25" height="19" rx="2" fill="#d7a55d" stroke="#173647" strokeWidth="1.4" /><path d="M25 60V48H40V60" {...line} strokeWidth="1.2" />
    <g transform="translate(62 69)" fill="none" {...line}><circle cx="0" cy="-17" r="4" fill="#f2c39a" stroke="none" /><path d="M0-13L-8 1M-8 1L-18 8M-8 1L5 8M-8 1L-3 20M-3 20L7 25" stroke="#315e6f" strokeWidth="3" /></g>
    <path d="M42 52H58" stroke="#d3655d" strokeWidth="1.5" strokeDasharray="3 2" /><path d="M79 38H92V60H79" fill="none" stroke="#6a947b" strokeWidth="2" />
  </>;
  if (kind === "traffic") return <>
    <path d="M0 52H100V83H0Z" fill="#77949a" /><path d="M0 67H100" stroke="#e8d6a5" strokeWidth="1.2" strokeDasharray="6 4" />
    <rect x="18" y="57" width="31" height="15" rx="3" fill="#d3a456" stroke="#173647" strokeWidth="1.3" /><rect x="25" y="52" width="14" height="9" rx="1" fill="#dce9e5" stroke="#173647" strokeWidth="1" /><circle cx="25" cy="73" r="4" fill="#173647" /><circle cx="42" cy="73" r="4" fill="#173647" />
    <path d="M53 45V83" stroke="#d3655d" strokeWidth="1.5" strokeDasharray="3 2" />
    <path d="M72 52V83" stroke="#6a947b" strokeWidth="3" /><path d="M66 55H78M66 65H78M66 75H78" stroke="#6a947b" strokeWidth="1" />
    {person(86, 75, "#bf7553")}
  </>;
  return <>
    <rect x="15" y="19" width="70" height="64" rx="5" fill="#f8f5ed" stroke="#c7d8d5" strokeWidth="1.4" />
    <path d="M28 35H45M55 35H73M50 50H70M28 67H46M50 50L45 35M50 50L62 35M50 50L38 67M50 50L65 67" stroke="#6b9890" strokeWidth="1.4" />
    {[{ x: 28, y: 35, c: "#d3655d" }, { x: 62, y: 35, c: "#d3a456" }, { x: 50, y: 50, c: "#315e6f" }, { x: 65, y: 67, c: "#6a947b" }].map((item) => <circle key={`${item.x}-${item.y}`} cx={item.x} cy={item.y} r="6" fill={item.c} />)}
    <path d="M28 77H73" stroke="#d9e4df" strokeWidth="1" strokeDasharray="2 2" />
  </>;
}

export function HazardBodyMap({
  activeSystems,
  selectedSystem,
  onSelect,
}: {
  activeSystems: readonly BodySystemId[];
  selectedSystem: BodySystemId | null;
  onSelect: (system: BodySystemId) => void;
}) {
  const active = new Set(activeSystems);
  return (
    <section className="hazard-body-map" aria-label="Interactive body-system map">
      <div className="body-map-canvas">
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <defs><linearGradient id="bodyFill" x1="0" x2="1"><stop stopColor="#e6efeb" /><stop offset="1" stopColor="#f5eee2" /></linearGradient></defs>
          <circle cx="50" cy="17" r="10" fill="url(#bodyFill)" stroke="#7f9793" strokeWidth="1.1" />
          <path d="M39 31C35 39 36 46 39 53L35 76L43 94H49V68H51V94H57L65 76L61 53C64 45 65 39 61 31C57 28 43 28 39 31Z" fill="url(#bodyFill)" stroke="#7f9793" strokeWidth="1.1" />
          <path d="M39 35L24 52M61 35L76 52" fill="none" stroke="#7f9793" strokeWidth="6" strokeLinecap="round" />
          <path d="M40 35L25 52M60 35L75 52" fill="none" stroke="#e6efeb" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="17" r="5" fill={active.has("brain") ? "#8857a6" : "#ccd8d5"} opacity=".9" />
          <ellipse cx="44" cy="37" rx="5" ry="7" fill={active.has("lungs") ? "#438aa3" : "#ccd8d5"} opacity=".9" /><ellipse cx="56" cy="37" rx="5" ry="7" fill={active.has("lungs") ? "#438aa3" : "#ccd8d5"} opacity=".9" />
          <path d="M52 42c-5-6-10 2-2 9 8-7 3-15-2-9-2-2-5-2-5 1 0 3 4 6 7 8" fill={active.has("heart") ? "#d8655d" : "#ccd8d5"} opacity=".95" />
          <path d="M43 50c7-4 14-2 17 3-7 6-14 4-19 1Z" fill={active.has("liver") ? "#b9863a" : "#ccd8d5"} opacity=".9" />
          <ellipse cx="44" cy="59" rx="3.2" ry="4.5" fill={active.has("kidneys") ? "#4e789b" : "#ccd8d5"} /><ellipse cx="56" cy="59" rx="3.2" ry="4.5" fill={active.has("kidneys") ? "#4e789b" : "#ccd8d5"} />
          <path d="M44 65c7-4 15-1 12 7-4 5-12 2-12-3 0-3 8-5 10 0" fill="none" stroke={active.has("digestive") ? "#d17c56" : "#ccd8d5"} strokeWidth="2" />
          <path d="M50 30V65M43 45L56 53M50 57L42 63M50 57L58 63" fill="none" stroke={active.has("blood") ? "#b74e64" : "#ccd8d5"} strokeWidth="1.5" opacity=".9" />
          <path d="M39 31C35 39 36 46 39 53L35 76L43 94H49V68H51V94H57L65 76L61 53C64 45 65 39 61 31C57 28 43 28 39 31Z" fill="none" stroke={active.has("skin") ? "#ce7f75" : "#7f9793"} strokeWidth={active.has("skin") ? "2.4" : "1.1"} />
          {active.has("systemic") && <circle cx="50" cy="52" r="23" fill="none" stroke="#6a947b" strokeWidth="2" strokeDasharray="3 2" />}
        </svg>
        {BODY_SYSTEMS.map((system) => <button key={system.id} type="button" className={`body-hotspot ${active.has(system.id) ? "active" : ""} ${selectedSystem === system.id ? "selected" : ""}`} style={{ left: `${system.x}%`, top: `${system.y}%` }} onClick={() => onSelect(system.id)} aria-pressed={selectedSystem === system.id} aria-label={`Filter hazards by ${system.label}`} disabled={!active.has(system.id)}><span>{BODY_SYSTEMS.findIndex((item) => item.id === system.id) + 1}</span></button>)}
      </div>
      <div className="body-map-legend">
        {BODY_SYSTEMS.map((system) => <button type="button" key={system.id} className={`${active.has(system.id) ? "active" : ""} ${selectedSystem === system.id ? "selected" : ""}`} onClick={() => onSelect(system.id)} disabled={!active.has(system.id)}><i style={{ background: system.color }} />{system.label}</button>)}
      </div>
    </section>
  );
}
