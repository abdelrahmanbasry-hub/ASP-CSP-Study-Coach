"use client";

import { Eye, EyeOff, Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { BODY_SYSTEMS, getQuestionScene, type BodySystemId, type QuestionScene, type QuestionSceneKind } from "./visualLearning";

export function QuestionVisualAid({ id, reveal = false, compact = false }: { id?: string; stem?: string; topic?: string; reveal?: boolean; compact?: boolean }) {
  const scene = getQuestionScene(id);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [ladderBase, setLadderBase] = useState(5);
  const [sidePull, setSidePull] = useState(false);
  const [airflow, setAirflow] = useState(false);
  const [showLabels, setShowLabels] = useState(reveal);
  if (!scene) return null;
  const focused = scene.hotspots.find((spot) => spot.id === focusedId);
  const labels = reveal && showLabels;
  return <aside className={`question-scene ${compact ? "compact" : ""}`} aria-label={`${scene.title} interactive visual`}>
    <header className="question-scene-head">
      <div><span>Question scene</span><h2>{scene.title}</h2></div>
      <div className="question-scene-actions">
        {scene.kind === "ladder-rule" && <label className="scene-range"><span>Base {ladderBase} ft</span><input type="range" min="0" max="10" value={ladderBase} onChange={(event) => setLadderBase(Number(event.target.value))} aria-label="Set ladder base distance in feet" /></label>}
        {scene.kind === "crane-side-pull" && <button type="button" className={sidePull ? "active" : ""} onClick={() => setSidePull((value) => !value)}>{sidePull ? "Side pull on" : "Test side pull"}</button>}
        {scene.kind === "biosafety-cabinet" && <button type="button" className={airflow ? "active" : ""} onClick={() => setAirflow((value) => !value)}>{airflow ? "Airflow on" : "Trace airflow"}</button>}
        {reveal && <button type="button" onClick={() => setShowLabels((value) => !value)}>{labels ? <EyeOff size={15} /> : <Eye size={15} />}{labels ? "Hide answer links" : "Show answer links"}</button>}
      </div>
    </header>
    <div className="question-scene-layout">
      <SceneCanvas scene={scene} ladderBase={ladderBase} sidePull={sidePull} airflow={airflow} labels={labels} focusedId={focusedId} onFocus={setFocusedId} />
      <div className="question-scene-inspector">
        <p className="scene-instruction">{labels ? scene.afterPrompt : scene.beforePrompt}</p>
        {focused ? <div className="scene-observation"><span>{scene.hotspots.findIndex((spot) => spot.id === focused.id) + 1}</span><div><strong>{focused.label}</strong><p>{focused.observation}</p></div></div> : <div className="scene-observation empty"><Info size={16} /><span>Select a marker in the exact scenario to inspect evidence.</span></div>}
        {labels && <div className="scene-answer-link"><strong>Why it matters</strong><p>{scene.answerConnection}</p></div>}
        <p className="scene-disclaimer">Interactive study scene based on this question’s stated facts; it is not a substitute for the site-specific plan, procedure, or standard.</p>
      </div>
    </div>
  </aside>;
}

function SceneCanvas({ scene, ladderBase, sidePull, airflow, labels, focusedId, onFocus }: { scene: QuestionScene; ladderBase: number; sidePull: boolean; airflow: boolean; labels: boolean; focusedId: string | null; onFocus: (id: string) => void }) {
  return <div className={`question-scene-canvas scene-${scene.kind}`}>
    <svg viewBox="0 0 100 100" role="img" aria-label={`${scene.title} diagram`}>
      <defs>
        <linearGradient id="sceneGlow" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#dbece9" /><stop offset=".55" stopColor="#f9f4e9" /><stop offset="1" stopColor="#e4eceb" /></linearGradient>
        <linearGradient id="sceneMetal" x1="0" x2="1"><stop stopColor="#6d8990" /><stop offset=".5" stopColor="#dce9e6" /><stop offset="1" stopColor="#54727b" /></linearGradient>
        <filter id="softShadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#183746" floodOpacity=".2" /></filter>
      </defs>
      <rect width="100" height="100" rx="5" fill="url(#sceneGlow)" />
      <path d="M0 82H100V100H0Z" fill="#d5d4c8" />
      <SceneSubject kind={scene.kind} ladderBase={ladderBase} sidePull={sidePull} airflow={airflow} />
      {scene.hotspots.map((spot, index) => <g key={spot.id} className={`scene-hotspot ${focusedId === spot.id ? "focused" : ""} ${labels ? "revealed" : ""}`} transform={`translate(${spot.x} ${spot.y})`} onClick={() => onFocus(spot.id)} role="button" tabIndex={0} aria-label={`Inspect ${spot.label}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onFocus(spot.id); } }}>
        <circle r="4.6" /><text textAnchor="middle" dominantBaseline="central">{index + 1}</text>{labels && <text className="scene-hotspot-label" x="6" y="-5">{spot.label}</text>}
      </g>)}
    </svg>
    <span className="scene-canvas-note">Select markers to inspect the evidence</span>
  </div>;
}

function SceneSubject({ kind, ladderBase, sidePull, airflow }: { kind: QuestionSceneKind; ladderBase: number; sidePull: boolean; airflow: boolean }) {
  const stroke = { stroke: "#183b49", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const person = (x: number, y: number, color = "#325e70") => <g transform={`translate(${x} ${y})`} filter="url(#softShadow)"><circle cx="0" cy="-9" r="4.2" fill="#e4b38d" /><path d="M0-4V12M-7 2L0-1 7 3M-5 23L0 12 5 23" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" /></g>;
  if (kind === "ladder-rule") { const baseX = 67 - ladderBase * 3.2; return <><path d="M73 16V81" stroke="#4b6570" strokeWidth="2" /><path d={`M${baseX} 80L73 16M${baseX + 7} 80L80 16`} {...stroke} strokeWidth="2.2" /><path d={`M${baseX + 5} 68H${baseX + 14}M${baseX + 10} 56H${baseX + 20}M${baseX + 15} 44H${baseX + 27}M${baseX + 20} 32H${baseX + 33}`} {...stroke} strokeWidth="1.2" /><path d={`M${baseX + 3} 85H73`} stroke="#b17b2d" strokeWidth="1.2" strokeDasharray="2 2" /><text x={(baseX + 73) / 2} y="90" textAnchor="middle" fill="#825f2e" fontSize="4" fontWeight="700">{ladderBase} ft</text><text x="78" y="49" fill="#496d76" fontSize="4" fontWeight="700">20 ft</text></>; }
  if (kind === "ladder-platform") return <><path d="M14 75H44V56H14Z" fill="#6f9290" stroke="#183b49" strokeWidth="1.2" /><path d="M14 56H44M18 56V43M40 56V43M18 43H40" {...stroke} strokeWidth="1.4" /><path d="M19 75L15 88M39 75L43 88" {...stroke} strokeWidth="2" />{person(29, 57)}<path d="M63 79L77 27M70 79L84 27M68 65H80M72 52H84M76 39H88" {...stroke} strokeWidth="2" /><path d="M80 27H93" {...stroke} strokeWidth="2" />{person(80, 58, "#ad6b48")}<rect x="84" y="65" width="10" height="8" rx="1" fill="#d39e4e" stroke="#183b49" strokeWidth=".8" /><text x="18" y="23" fill="#496d76" fontSize="4" fontWeight="700">stable work position</text><text x="62" y="23" fill="#9b6746" fontSize="4" fontWeight="700">access ladder</text></>;
  if (kind === "crane-vault" || kind === "crane-side-pull") return <><path d="M7 79H40L35 70H12Z" fill="#cf9d52" stroke="#183b49" strokeWidth="1.1" /><path d="M25 71V20M25 22L71 8M26 26L14 15" {...stroke} strokeWidth="3" /><path d="M28 27L71 10M46 79L25 23" stroke="#7c9ba0" strokeWidth="1" /><path d="M61 13V48" {...stroke} strokeWidth="1.2" />{kind === "crane-side-pull" && sidePull ? <><path d="M61 48L77 62" stroke="#bd5f51" strokeWidth="1.4" /><path d="M61 57H76" stroke="#bd5f51" strokeWidth="1.5" strokeDasharray="3 2" /><path d="M74 58l4 4-5 1" fill="none" stroke="#bd5f51" strokeWidth="1.3" /></> : <path d="M61 48V63" {...stroke} strokeWidth="1.2" />}<rect x={kind === "crane-side-pull" && sidePull ? "69" : "52"} y="63" width="18" height="12" rx="1.5" fill="#d3a35b" stroke="#183b49" strokeWidth="1" />{kind === "crane-vault" && <><path d="M46 81H86V94H46Z" fill="#667d86" stroke="#314f5a" strokeWidth="1" /><path d="M50 86H82M55 82V93M68 82V93" stroke="#b4c9c7" strokeWidth=".8" /><path d="M12 83H35M16 78V85M31 78V85" stroke="#b47b2e" strokeWidth="2" /></>}{person(89, 77, "#a4644a")}</>;
  if (kind === "excavation-rain" || kind === "excavation-wall") return <>{kind === "excavation-wall" ? <><path d="M8 15H29V76H8Z" fill="#b7a28c" stroke="#4b5760" strokeWidth="1.2" /><path d="M8 26H29M8 38H29M8 50H29M18 15V26M18 38V50M18 62V76" stroke="#7d6d60" strokeWidth=".7" /><path d="M24 76L42 93" stroke="#596d75" strokeWidth="3" /></> : <><path d="M13 40Q21 24 33 40" fill="#c9ad73" stroke="#846c50" strokeWidth="1" /><path d="M74 15l-4 7m13-4-4 7m13-3-4 7" stroke="#4f8695" strokeWidth="1.3" /><path d="M35 20l5 9m-1-12 6 5" stroke="#bd6559" strokeWidth="1.2" /></>}<path d="M30 43L41 84H75L87 43" fill="#526f75" stroke="#183b49" strokeWidth="1.3" /><path d="M33 44L42 80M84 44L73 80" stroke="#d9e8e5" strokeWidth="1" />{kind === "excavation-rain" && <><path d="M7 42H33" stroke="#c49b63" strokeWidth="4" /><path d="M7 38H32" stroke="#c49b63" strokeWidth="4" /></>}{person(57, 74)}<path d="M64 44V68M64 68L72 78M64 68L56 78" stroke="#e9dec7" strokeWidth="1.3" /></>;
  if (kind === "biosafety-cabinet") return <><rect x="15" y="17" width="70" height="67" rx="4" fill="#f7fbf9" stroke="#537b79" strokeWidth="2" /><rect x="26" y="39" width="42" height="29" rx="2" fill="#c5dcd7" stroke="#537b79" strokeWidth="1" /><rect x="69" y="25" width="10" height="45" rx="1" fill="#8bb5a6" /><path d="M26 68H68M34 76H74" stroke="#527e78" strokeWidth="2" />{airflow && <><path d="M29 60C42 51 52 56 61 43S70 28 75 28" fill="none" stroke="#477d9a" strokeWidth="1.8" strokeDasharray="2 2" /><path d="M33 64C42 58 48 65 55 55" fill="none" stroke="#477d9a" strokeWidth="1.5" strokeDasharray="2 2" /><circle cx="39" cy="62" r="2" fill="#9a62a8" /><circle cx="48" cy="58" r="1.6" fill="#9a62a8" /></>}<text x="70" y="20" fill="#416e69" fontSize="3.4" fontWeight="800">HEPA</text>{person(47, 81, "#507074")}</>;
  if (kind === "bio-routes") return <><path d="M40 18C30 25 31 39 37 45L31 81H45V94H55V81H69L63 45C69 39 70 25 60 18C55 14 45 14 40 18Z" fill="#e8ded0" stroke="#7a8b89" strokeWidth="1.2" /><circle cx="50" cy="25" r="10" fill="#efd1b6" stroke="#7a8b89" strokeWidth="1" /><path d="M45 33Q50 38 55 33M50 35V50" stroke="#92665b" strokeWidth="1" fill="none" /><path d="M44 50C39 43 36 53 41 61M56 50C61 43 64 53 59 61" fill="#69a3b4" opacity=".8" /><path d="M39 55L27 63M61 55L73 63" stroke="#bc6660" strokeWidth="2" strokeDasharray="2 2" /><path d="M36 31L29 26M55 31L62 25M51 39L57 46" stroke="#8756a4" strokeWidth="1.5" /></>;
  if (kind === "cadmium-kidney") return <><path d="M16 18H84V82H16Z" fill="#eff5f1" stroke="#9ebbb3" strokeWidth="1" /><path d="M41 31C27 31 25 53 38 66C48 75 57 65 54 55C51 45 57 33 41 31Z" fill="#a45662" filter="url(#softShadow)" /><path d="M59 31C73 31 75 53 62 66C52 75 43 65 46 55C49 45 43 33 59 31Z" fill="#a45662" filter="url(#softShadow)" /><path d="M47 37C37 44 39 57 49 62M53 37C63 44 61 57 51 62" fill="none" stroke="#e6a0a0" strokeWidth="1.2" /><path d="M48 61V79M52 61V79" stroke="#b48545" strokeWidth="1.5" /><path d="M31 22H69" stroke="#baa16e" strokeWidth="1" strokeDasharray="2 2" /><text x="33" y="18" fill="#8e7341" fontSize="3.6" fontWeight="700">chronic exposure</text></>;
  return <><path d="M20 22C11 35 17 60 35 69C45 75 55 75 65 69C83 60 89 35 80 22" fill="#c7e1de" opacity=".7" /><path d="M33 29C22 33 24 56 39 65M67 29C78 33 76 56 61 65" fill="#5d9cb0" opacity=".85" /><path d="M30 46C43 38 57 38 70 46" stroke="#b35d61" strokeWidth="2" strokeDasharray="2 2" /><path d="M17 55L31 49M69 31L82 21" stroke="#c27655" strokeWidth="2" strokeDasharray="2 2" /><text x="13" y="61" fill="#966649" fontSize="4" fontWeight="700">asbestos</text><text x="69" y="19" fill="#966649" fontSize="4" fontWeight="700">tobacco smoke</text></>;
}

export function HazardSystemModel({ activeSystems, selectedSystem, onSelect }: { activeSystems: readonly BodySystemId[]; selectedSystem: BodySystemId; onSelect: (system: BodySystemId) => void }) {
  const [layer, setLayer] = useState<"surface" | "inside">("surface");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const active = new Set(activeSystems);
  const selected = BODY_SYSTEMS.find((system) => system.id === selectedSystem) ?? BODY_SYSTEMS[1];
  return <section className="organ-model" aria-label="Interactive body-system study model">
    <header><div><span>System model</span><h3>{selected.label}</h3></div><div className="organ-model-controls"><button className={layer === "surface" ? "active" : ""} type="button" onClick={() => setLayer("surface")}>Surface</button><button className={layer === "inside" ? "active" : ""} type="button" onClick={() => setLayer("inside")}>Layer view</button><button type="button" onClick={() => setRotation({ x: 0, y: 0 })} aria-label="Reset model view"><RotateCcw size={14} /></button></div></header>
    <div className="organ-stage" onPointerMove={(event) => { if (event.buttons === 1) setRotation({ x: Math.max(-10, Math.min(10, rotation.x - event.movementY / 3)), y: Math.max(-13, Math.min(13, rotation.y + event.movementX / 3)) }); }}>
      <div className="organ-art" style={{ transform: `perspective(850px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}><OrganArtwork system={selectedSystem} layer={layer} color={selected.color} /></div>
      <span>Drag to inspect</span>
    </div>
    <nav className="organ-selector" aria-label="Body systems">{BODY_SYSTEMS.map((system) => <button key={system.id} type="button" className={`${system.id === selectedSystem ? "selected" : ""} ${active.has(system.id) ? "" : "muted"}`} disabled={!active.has(system.id)} onClick={() => onSelect(system.id)}><i style={{ background: system.color }} />{system.shortLabel}</button>)}</nav>
  </section>;
}

function OrganArtwork({ system, layer, color }: { system: BodySystemId; layer: "surface" | "inside"; color: string }) {
  if (system === "lungs") return <svg viewBox="0 0 100 100" role="img" aria-label="Lung study model"><defs><radialGradient id="lungTone"><stop stopColor="#e99084" /><stop offset="1" stopColor="#b65052" /></radialGradient></defs><path d="M48 18V43M52 18V43" stroke="#c9d6d4" strokeWidth="5" strokeLinecap="round" /><path d="M47 36C25 22 19 43 26 67C32 86 46 85 49 65V42Z" fill="url(#lungTone)" stroke="#7e4149" strokeWidth="1" /><path d="M53 36C75 22 81 43 74 67C68 86 54 85 51 65V42Z" fill="url(#lungTone)" stroke="#7e4149" strokeWidth="1" />{layer === "inside" && <path d="M50 25V67M50 39L34 54M50 39L66 54M43 47L35 65M57 47L65 65M42 57L32 72M58 57L68 72" stroke="#f9ddd0" strokeWidth="1.4" fill="none" strokeLinecap="round" />}<circle cx="50" cy="16" r="6" fill="#b8d2d0" /><path d="M42 88Q50 92 58 88" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" /></svg>;
  if (system === "brain") return <svg viewBox="0 0 100 100" role="img" aria-label="Brain study model"><path d="M24 51C16 40 23 25 37 27C42 17 57 20 61 27C78 23 85 39 75 50C82 63 71 78 59 73C52 83 39 80 36 72C22 76 16 62 24 51Z" fill="#c283a0" stroke="#754d74" strokeWidth="1.2" />{["M30 39Q38 32 43 40T55 39T68 38", "M29 51Q37 45 44 53T57 52T71 50", "M32 63Q39 56 47 64T61 63T68 61"].map((path) => <path key={path} d={path} fill="none" stroke="#edbfd0" strokeWidth="2" strokeLinecap="round" />)}<path d="M52 29V73" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" /></svg>;
  if (system === "kidneys") return <svg viewBox="0 0 100 100" role="img" aria-label="Kidney study model"><path d="M42 20C19 22 20 60 38 78C54 89 67 73 62 57C58 43 67 20 42 20Z" fill="#ae5464" stroke="#6f3e51" strokeWidth="1.2" /><path d="M58 20C81 22 80 60 62 78C46 89 33 73 38 57C42 43 33 20 58 20Z" fill="#ae5464" stroke="#6f3e51" strokeWidth="1.2" />{layer === "inside" && <><path d="M46 29Q31 44 48 68M54 29Q69 44 52 68" fill="none" stroke="#eda5a5" strokeWidth="2" /><path d="M48 67V87M52 67V87" stroke="#d2a94f" strokeWidth="2" /></>}<path d="M48 87H52" stroke={color} strokeWidth="4" /></svg>;
  if (system === "liver") return <svg viewBox="0 0 100 100" role="img" aria-label="Liver study model"><path d="M17 48C27 22 75 20 85 39C91 52 75 68 54 74C36 80 12 71 17 48Z" fill="#b36c4f" stroke="#71483c" strokeWidth="1.2" />{layer === "inside" && <path d="M28 45Q45 34 70 42M27 56Q46 46 76 52M38 68Q53 55 70 62" fill="none" stroke="#e0aa80" strokeWidth="1.5" />}</svg>;
  if (system === "heart") return <svg viewBox="0 0 100 100" role="img" aria-label="Heart study model"><path d="M50 80C20 59 23 29 38 28C46 27 50 35 50 39C50 35 54 27 62 28C77 29 80 59 50 80Z" fill="#c65d5b" stroke="#7b3b46" strokeWidth="1.3" /><path d="M47 27V14M55 31V14M42 18H61" stroke="#8fa9aa" strokeWidth="4" strokeLinecap="round" />{layer === "inside" && <path d="M50 40V70M38 47L48 57M62 47L52 57" stroke="#f0b4ad" strokeWidth="2" />}</svg>;
  if (system === "skin") return <svg viewBox="0 0 100 100" role="img" aria-label="Skin study model"><rect x="15" y="18" width="70" height="65" rx="8" fill="#e6aa8c" stroke="#9d675d" strokeWidth="1.2" />{layer === "inside" && <><path d="M15 43H85" stroke="#f8d5bb" strokeWidth="8" /><path d="M15 55H85" stroke="#c87569" strokeWidth="10" /><path d="M20 68Q30 55 40 69T60 67T80 68" fill="none" stroke="#9a5064" strokeWidth="2" /></>}<path d="M25 29Q35 25 46 30T68 29" fill="none" stroke="#f7c8aa" strokeWidth="2" /></svg>;
  return <svg viewBox="0 0 100 100" role="img" aria-label="Whole-body system study model"><circle cx="50" cy="20" r="12" fill="#e7d8c8" stroke="#879b99" strokeWidth="1" /><path d="M38 35C31 47 35 62 38 72L32 91H45V68H55V91H68L62 72C65 62 69 47 62 35Z" fill="#e7d8c8" stroke="#879b99" strokeWidth="1" />{layer === "inside" && <><ellipse cx="43" cy="45" rx="5" ry="8" fill="#4f91a8" /><ellipse cx="57" cy="45" rx="5" ry="8" fill="#4f91a8" /><path d="M50 47C43 40 39 51 50 59C61 51 57 40 50 47Z" fill="#cb6163" /><path d="M42 61H59" stroke="#bd8840" strokeWidth="6" /></>}<circle cx="50" cy="20" r="6" fill={color} opacity=".85" /></svg>;
}
