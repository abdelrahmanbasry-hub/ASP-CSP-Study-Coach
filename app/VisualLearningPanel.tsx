"use client";

import { BODY_SYSTEMS, type BodySystemId } from "./visualLearning";

export function HazardBodyMap({ activeSystems, selectedSystem, onSelect }: { activeSystems: readonly BodySystemId[]; selectedSystem: BodySystemId | null; onSelect: (system: BodySystemId) => void }) {
  const active = new Set(activeSystems);
  return <section className="hazard-body-map" aria-label="Interactive body-system map">
    <div className="body-map-canvas">
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <defs><linearGradient id="bodyFill" x1="0" x2="1"><stop stopColor="#e6efeb" /><stop offset="1" stopColor="#f5eee2" /></linearGradient></defs>
        <circle cx="50" cy="17" r="10" fill="url(#bodyFill)" stroke="#7f9793" strokeWidth="1.1" />
        <path d="M39 31C35 39 36 46 39 53L35 76L43 94H49V68H51V94H57L65 76L61 53C64 45 65 39 61 31C57 28 43 28 39 31Z" fill="url(#bodyFill)" stroke="#7f9793" strokeWidth="1.1" />
        <path d="M39 35L24 52M61 35L76 52" fill="none" stroke="#7f9793" strokeWidth="6" strokeLinecap="round" /><path d="M40 35L25 52M60 35L75 52" fill="none" stroke="#e6efeb" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="50" cy="17" r="5" fill={active.has("brain") ? "#8857a6" : "#ccd8d5"} opacity=".9" />
        <ellipse cx="44" cy="37" rx="5" ry="7" fill={active.has("lungs") ? "#438aa3" : "#ccd8d5"} opacity=".9" /><ellipse cx="56" cy="37" rx="5" ry="7" fill={active.has("lungs") ? "#438aa3" : "#ccd8d5"} opacity=".9" />
        <path d="M52 42c-5-6-10 2-2 9 8-7 3-15-2-9-2-2-5-2-5 1 0 3 4 6 7 8" fill={active.has("heart") ? "#d8655d" : "#ccd8d5"} opacity=".95" /><path d="M43 50c7-4 14-2 17 3-7 6-14 4-19 1Z" fill={active.has("liver") ? "#b9863a" : "#ccd8d5"} opacity=".9" />
        <ellipse cx="44" cy="59" rx="3.2" ry="4.5" fill={active.has("kidneys") ? "#4e789b" : "#ccd8d5"} /><ellipse cx="56" cy="59" rx="3.2" ry="4.5" fill={active.has("kidneys") ? "#4e789b" : "#ccd8d5"} />
        <path d="M44 65c7-4 15-1 12 7-4 5-12 2-12-3 0-3 8-5 10 0" fill="none" stroke={active.has("digestive") ? "#d17c56" : "#ccd8d5"} strokeWidth="2" /><path d="M50 30V65M43 45L56 53M50 57L42 63M50 57L58 63" fill="none" stroke={active.has("blood") ? "#b74e64" : "#ccd8d5"} strokeWidth="1.5" opacity=".9" />
        <path d="M39 31C35 39 36 46 39 53L35 76L43 94H49V68H51V94H57L65 76L61 53C64 45 65 39 61 31C57 28 43 28 39 31Z" fill="none" stroke={active.has("skin") ? "#ce7f75" : "#7f9793"} strokeWidth={active.has("skin") ? "2.4" : "1.1"} />
        {active.has("systemic") && <circle cx="50" cy="52" r="23" fill="none" stroke="#6a947b" strokeWidth="2" strokeDasharray="3 2" />}
      </svg>
      {BODY_SYSTEMS.map((system) => <button key={system.id} type="button" className={`body-hotspot ${active.has(system.id) ? "active" : ""} ${selectedSystem === system.id ? "selected" : ""}`} style={{ left: `${system.x}%`, top: `${system.y}%` }} onClick={() => onSelect(system.id)} aria-pressed={selectedSystem === system.id} aria-label={`Filter hazards by ${system.label}`} disabled={!active.has(system.id)}><span>{BODY_SYSTEMS.findIndex((item) => item.id === system.id) + 1}</span></button>)}
    </div>
    <div className="body-map-legend">{BODY_SYSTEMS.map((system) => <button type="button" key={system.id} className={`${active.has(system.id) ? "active" : ""} ${selectedSystem === system.id ? "selected" : ""}`} onClick={() => onSelect(system.id)} disabled={!active.has(system.id)}><i style={{ background: system.color }} />{system.label}</button>)}</div>
  </section>;
}
