import { useId, type CSSProperties, type ReactNode } from "react";
import { BODY_SYSTEM_BY_ID, type BodySystemId, type ExposureRouteId } from "../bodySystems";
import type { OccupationalHealthRecord } from "../hazardData";
import { targetRole, type ExplorerLanguage } from "../hazardExplorer";
import { bilingualLabel, ROLE_TEXT } from "./Bilingual";
import { ANATOMY_REGIONS } from "./anatomyGeometry";
import { AnatomyStructure } from "./AnatomyStructure";

const SILHOUETTE = "M160 22C138 22 127 37 127 58L130 83Q134 98 145 105L143 126Q126 134 107 139C91 143 81 155 76 177L62 231L49 278L41 315L35 339L36 358Q39 363 42 356L46 340L46 368Q48 374 51 368L54 343L56 368Q59 374 61 366L62 340L66 360Q70 364 70 356L67 331L71 320L73 337Q78 343 80 335L78 309L85 281L98 243L110 201L117 251L117 294Q108 317 108 344L112 392L121 443L125 493L125 568L119 593Q116 607 133 609L147 606L148 568L153 491L151 447L159 392L161 392L169 447L167 491L172 568L173 606L187 609Q204 607 201 593L195 568L195 493L199 443L208 392L212 344Q212 317 203 294L203 251L210 201L222 243L235 281L242 309L240 335Q242 343 247 337L249 320L253 331L250 356Q250 364 254 360L258 340L259 366Q261 374 264 368L266 343L269 368Q272 374 274 368L274 340L278 356Q281 363 284 358L285 339L279 315L271 278L258 231L244 177C239 155 229 143 213 139Q194 134 177 126L175 105Q186 98 190 83L193 58C193 37 182 22 160 22Z";
const ROUTE_PATHS: Record<ExposureRouteId, string> = {
  inhalation: "M282 71C239 71 230 94 165 95L160 141L160 170L183 198",
  ingestion: "M38 104C92 104 123 103 156 104L158 206Q159 253 184 270",
  "dermal-absorption": "M282 273L246 273",
  percutaneous: "M38 246L65 246L82 252",
};

type Props = {
  record?: OccupationalHealthRecord;
  language: ExplorerLanguage;
  selectedSystem: BodySystemId | null;
  hoveredSystem: BodySystemId | null;
  onHover: (id: BodySystemId | null) => void;
  onSelect: (id: BodySystemId) => void;
  routes?: readonly ExposureRouteId[];
  showCallouts?: boolean;
};

export function HumanBodySvg({ record, language, selectedSystem, hoveredSystem, onHover, onSelect, routes, showCallouts }: Props) {
  const instance = useId().replace(/:/g, "");
  const titleId = `${instance}-title`;
  function region(id: BodySystemId, children: ReactNode) {
    const role = targetRole(record, id);
    const system = BODY_SYSTEM_BY_ID[id];
    const label = bilingualLabel(system.text, language);
    const appearance = ANATOMY_REGIONS[id];
    return <g key={id} role="button" tabIndex={0} data-system-id={id} data-target-role={role}
      style={{ "--organ-tone": appearance.tone, "--region-accent": appearance.accent, "--organ-fill": `url(#${instance}-${id}-rest)`, "--organ-active-fill": `url(#${instance}-${id}-active)` } as CSSProperties}
      className={`body-region body-region-${id} is-${role}${selectedSystem === id ? " is-selected" : ""}${hoveredSystem === id ? " is-hovered" : ""}`}
      aria-label={`${language === "ar" ? "تصفية حسب" : "Filter hazards by"} ${label}: ${bilingualLabel(ROLE_TEXT[role], language)}`}
      aria-pressed={selectedSystem === id} onClick={() => onSelect(id)}
      onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(id)} onBlur={() => onHover(null)}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(id); } }}>
      <title>{label} — {bilingualLabel(ROLE_TEXT[role], language)}</title>{children}
    </g>;
  }
  return <svg className="human-body-svg" viewBox="24 16 272 514" role="group" aria-labelledby={titleId}>
    <title id={titleId}>{language === "ar" ? "خريطة الجسم التفاعلية؛ اختر جهازًا لتصفية المخاطر" : "Interactive anatomy; select a body system to filter hazards"}</title>
    <defs>
      <linearGradient id={`${instance}-skin`} x1="0" x2="1"><stop stopColor="#e6c3a5" stopOpacity=".46" /><stop offset=".25" stopColor="#f1dcca" stopOpacity=".45" /><stop offset=".5" stopColor="#fff7ea" stopOpacity=".4" /><stop offset=".8" stopColor="#ead0b9" stopOpacity=".46" /><stop offset="1" stopColor="#d9b595" stopOpacity=".5" /></linearGradient>
      {Object.entries(ANATOMY_REGIONS).map(([id, appearance]) => <g key={id}>
        <linearGradient id={`${instance}-${id}-rest`} x1="0" x2="1" y1="0" y2=".7"><stop stopColor={`color-mix(in srgb, ${appearance.tone} 65%, white)`} /><stop offset=".5" stopColor={appearance.tone} /><stop offset="1" stopColor={`color-mix(in srgb, ${appearance.tone} 85%, #6d4d43)`} /></linearGradient>
        <linearGradient id={`${instance}-${id}-active`} x1="0" x2="1" y1="0" y2=".7"><stop stopColor={`color-mix(in srgb, ${appearance.accent} 75%, white)`} /><stop offset=".6" stopColor={appearance.accent} /><stop offset="1" stopColor={`color-mix(in srgb, ${appearance.accent} 85%, #173042)`} /></linearGradient>
      </g>)}
      <marker id={`${instance}-arrow`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="var(--body-route)" /></marker>
    </defs>
    <ellipse cx="160" cy="617" rx="58" ry="5" className="body-ground" />
    {region("systemic", <path className="region-organ systemic-field" d={SILHOUETTE} />)}
    {region("skin", <path className="region-organ skin-silhouette" d={SILHOUETTE} style={{ fill: `url(#${instance}-skin)` }} />)}
    <AnatomyStructure />
    {region("musculoskeletal", <g className="region-organ skeleton-organ"><path d="M160 160V321M131 365L136 430M189 365L184 430M135 464L137 559M185 464L183 559M106 159L84 226M214 159L236 226" /><path d="M117 330Q132 320 147 337L159 366L173 337Q189 320 203 330" /></g>)}
    {region("brain", <g><path className="region-organ" d="M158 37C145 31 132 42 131 55C127 63 132 75 141 77L156 75L160 71L164 75L179 77C188 75 193 63 189 55C188 42 175 31 162 37L160 42Z" /><path className="organ-detail brain-folds" d="M160 41V71M154 39Q147 38 146 44Q146 50 139 49Q133 47 134 57Q143 55 144 60Q144 67 136 68M149 43Q156 43 156 50L151 53Q146 58 151 61Q157 64 154 70M137 42Q142 41 142 45M131 61L136 62Q142 64 139 72M146 69Q149 66 148 63M166 39Q173 38 174 44Q174 50 181 49Q187 47 186 57Q177 55 176 60Q176 67 184 68M171 43Q164 43 164 50L169 53Q174 58 169 61Q163 64 166 70M183 42Q178 41 178 45M189 61L184 62Q178 64 181 72M174 69Q171 66 172 63" /></g>)}
    {region("ears", <g className="region-organ"><path d="M126 72Q116 66 122 88Q127 97 132 89L129 77ZM194 72Q204 66 198 88Q193 97 188 89L191 77Z" /></g>)}
    {region("eyes", <g><path className="region-organ" d="M137 84Q145 78 152 84Q146 89 137 84ZM168 84Q175 78 183 84Q174 89 168 84Z" /><circle className="organ-detail" cx="145" cy="84" r="2" /><circle className="organ-detail" cx="175" cy="84" r="2" /></g>)}
    {region("respiratory", <path className="region-outline respiratory-outline" d="M153 120L153 159C138 148 115 158 109 185L105 236Q115 255 146 246L160 231L174 246Q205 255 215 236L211 185C205 158 182 148 167 159L167 120Z" />)}
    {region("upper-respiratory", <g><path className="region-organ" d="M157 93L166 96L166 108L163 119L165 161L177 171L171 180L160 170L149 180L143 171L155 161L155 116L150 111L155 102Z" /><path className="organ-detail" d="M156 131H164M156 140H164M156 149H164" /></g>)}
    {region("lungs", <g><path className="region-organ" d="M146 155C136 153 124 168 117 185Q110 202 109 233Q109 246 119 247Q134 245 150 238L154 209L151 178Q153 158 146 155ZM174 155C184 153 196 168 203 185Q210 202 211 233Q211 246 201 247Q186 245 172 238L174 225Q156 214 168 192L169 178Q167 158 174 155Z" /><path className="organ-detail lung-branches" d="M151 171L139 191L131 204L126 226M140 190L126 184M139 192L146 205L145 223M134 201L119 208M131 211L141 228M126 224L117 232M169 171L181 191L191 205L198 227M180 190L194 184M184 196L178 210M192 210L203 214M195 220L182 233M113 220Q132 220 150 210M174 231L208 206" /></g>)}
    {region("heart", <g><path className="region-organ" d="M166 204C155 193 146 206 150 219Q153 234 174 241Q187 224 180 210L176 205L175 189L166 190Z" /><path className="organ-detail" d="M165 207Q166 226 177 235M155 216L165 221" /></g>)}
    {region("liver", <g><path className="region-organ" d="M115 253Q125 244 145 247L163 250L195 250Q194 259 179 268L158 272Q142 278 132 288Q121 296 115 284Q110 271 115 253Z" /><path className="organ-detail" d="M153 249Q150 263 154 273M118 258Q130 252 146 255M121 278Q134 268 149 267M160 254L182 255" /></g>)}
    {region("digestive", <g><path className="region-organ" d="M168 261Q171 279 180 271Q183 260 192 267Q203 273 195 290Q191 304 177 305Q161 304 157 292Q160 285 169 290Q181 294 180 284L165 273Z" /><path className="organ-detail" d="M186 272Q197 282 185 294Q179 299 169 294" /><path className="region-organ gut-outline" d="M129 359Q121 347 125 321L128 312Q152 307 176 312Q192 307 195 321L193 350Q185 365 168 357L161 375" /><path className="region-organ gut-coils" d="M139 320C147 313 158 317 156 324C154 331 132 326 134 335C136 343 155 330 161 333C173 342 139 339 140 347C143 354 163 343 168 349L165 358M165 319C181 314 190 325 179 330C170 333 161 324 163 322M171 335C184 329 191 337 184 343L174 347" /><path className="organ-detail gut-segments" d="M123 324L130 325M123 334L130 335M124 344L131 345M126 352L133 350M134 311L135 318M145 309L145 316M156 309L156 316M168 309L168 316M183 310L182 317M191 321L198 322M190 332L197 333M189 343L196 344M180 358L183 351M169 357L170 350" /></g>)}
    {region("kidneys", <g><path className="region-organ" d="M125 287C113 282 111 297 115 309Q119 320 127 315Q136 310 128 304L128 299Q136 292 125 287ZM195 285C207 280 209 295 205 307Q201 318 193 313Q184 308 192 302L192 297Q184 290 195 285Z" /><path className="organ-detail" d="M122 290Q115 298 122 309M198 288Q205 296 198 307M129 305Q142 315 141 342M191 303Q178 315 179 342" /></g>)}
    {region("blood", <g className="blood-distribution" data-distributed-system="blood">
      {/* Disconnected, bilateral tissue highlights identify a distributed system without implying an exposure pathway. */}
      <path className="region-organ blood-site" d="M148 114L153 115L152 133L146 136Z" />
      <path className="region-organ blood-site" d="M172 114L167 115L168 133L174 136Z" />
      <path className="region-organ blood-site" d="M91 188Q87 205 79 226L85 230Q96 206 98 189Z" />
      <path className="region-organ blood-site" d="M229 188Q233 205 241 226L235 230Q224 206 222 189Z" />
      <path className="region-organ blood-site" d="M76 260L65 290L71 293L83 263Z" />
      <path className="region-organ blood-site" d="M244 260L255 290L249 293L237 263Z" />
      <path className="region-organ blood-site" d="M121 388Q122 407 127 423L133 421L128 389Z" />
      <path className="region-organ blood-site" d="M199 388Q198 407 193 423L187 421L192 389Z" />
      <path className="organ-detail" d="M92 195L82 223M228 195L238 223M78 266L69 288M242 266L251 288M125 396L130 418M195 396L190 418" />
    </g>)}
    {region("reproductive", <g><path className="region-organ" d="M149 369Q160 376 171 369L174 378L166 388L160 399L154 388L146 378Z" /><path className="region-outline" d="M150 377Q139 364 132 373M170 377Q181 364 188 373" /><ellipse className="region-organ" cx="132" cy="374" rx="6" ry="4" /><ellipse className="region-organ" cx="188" cy="374" rx="6" ry="4" /></g>)}
    {region("bone-marrow", <g className="marrow-distribution" data-distributed-system="bone-marrow">
      <path className="region-organ marrow-site" data-marrow-site="sternum" d="M158 159Q160 157 162 159L162 216L160 223L158 216Z" />
      <path className="region-organ marrow-site" data-marrow-site="pelvis" d="M124 323Q116 327 121 341L137 348L148 362L145 346L138 336L136 327Z M196 323Q204 327 199 341L183 348L172 362L175 346L182 336L184 327Z" />
      <path className="region-organ marrow-site" data-marrow-site="left-proximal-femur" d="M133 359Q127 357 127 364L133 375L134 396L138 396L137 374L142 369Q145 364 140 362Z" />
      <path className="region-organ marrow-site" data-marrow-site="right-proximal-femur" d="M187 359Q193 357 193 364L187 375L186 396L182 396L183 374L178 369Q175 364 180 362Z" />
    </g>)}
    {region("immune", <g className="region-organ lymph-organ"><path d="M140 122L122 160L109 181M180 122L198 160L211 181M137 326L140 344M183 326L180 344" /><circle cx="138" cy="125" r="5" /><circle cx="182" cy="125" r="5" /><circle cx="114" cy="177" r="6" /><circle cx="206" cy="177" r="6" /><circle cx="138" cy="338" r="5" /><circle cx="182" cy="338" r="5" /></g>)}
    {showCallouts && record?.targets.map((target) => {
      const { anchor: [x, y], accent } = ANATOMY_REGIONS[target.systemId];
      return <g className={`body-target-pin is-${target.role}${hoveredSystem === target.systemId ? " is-hovered" : ""}${selectedSystem === target.systemId ? " is-selected" : ""}`} key={target.systemId} aria-hidden="true" style={{ color: accent }}>
        <circle className="body-pin-halo" cx={x} cy={y} r="17" /><circle className="body-pin-ring" data-region-anchor={target.systemId} cx={x} cy={y} r="5" />
        {selectedSystem === target.systemId && <circle className="body-pin-focus" cx={x} cy={y} r="11" />}
      </g>;
    })}
    {routes?.map((route, index) => <g key={route} className="body-entry-route" data-exposure-route={route} aria-hidden="true">
      <path d={ROUTE_PATHS[route]} markerEnd={`url(#${instance}-arrow)`} />
      <circle cx={route === "inhalation" || route === "dermal-absorption" ? 282 : 38} cy={route === "inhalation" ? 71 : route === "ingestion" ? 104 : route === "percutaneous" ? 246 : 273} r="11" />
      <text x={route === "inhalation" || route === "dermal-absorption" ? 282 : 38} y={(route === "inhalation" ? 71 : route === "ingestion" ? 104 : route === "percutaneous" ? 246 : 273) + 4}>{index + 1}</text>
    </g>)}
  </svg>;
}
