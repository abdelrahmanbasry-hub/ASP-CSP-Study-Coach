// The shared translucent musculoskeletal underlay is independent of the hazard.
export function AnatomyStructure() {
  return <g className="anatomy-structure" aria-hidden="true">
    <g className="anatomy-muscles">
      {[false, true].map((mirror) => <g key={String(mirror)} transform={mirror ? "translate(320 0) scale(-1 1)" : undefined}>
        <path d="M143 107Q143 128 134 143L148 155L154 143L149 114Z" />
        <path d="M105 143Q84 144 80 176L91 194L103 174L119 151Z" />
        <path d="M88 185Q75 206 71 236L77 251L86 230L99 199Z" />
        <path d="M70 253L53 305L60 319L68 290L79 261Z" />
        <path d="M111 259Q119 284 113 313L131 326L145 291L141 263Z" />
        <path d="M116 362Q117 404 128 439L139 435L139 390L132 370Z" />
        <path d="M146 370Q153 405 143 441L137 430L139 389Z" />
        <path d="M128 464Q124 503 132 550L140 541L143 479Z" />
      </g>)}
    </g>
    <g className="anatomy-bones">
      {[false, true].map((mirror) => <g key={String(mirror)} transform={mirror ? "translate(320 0) scale(-1 1)" : undefined}>
        <path d="M155 151Q141 137 122 142L108 146Q103 153 110 155L127 150Q143 147 153 159Z" />
        <path d="M109 154Q94 149 91 163Q91 171 98 176L79 230Q73 235 76 242Q84 249 89 240L105 181Q115 174 116 165Z" />
        <path d="M79 246L62 299Q56 302 58 310L64 313L83 251Z" />
        <path d="M87 246L70 308L73 314L92 250Z" />
        <path d="M124 318Q111 324 117 345L137 354L150 372L156 367L151 346L143 333L140 322Z" />
        <path d="M136 356Q124 350 124 363Q122 370 129 376L131 429Q124 438 131 443L140 442Q146 437 139 429L139 377L145 370Q148 362 143 359Z" />
        <path d="M132 458Q125 458 129 473L132 558Q127 564 133 570L140 569L140 560L138 471Q143 457 132 458Z" />
        <path d="M143 464L145 472L143 553L141 563L140 550Z" />
        <ellipse cx="135" cy="449" rx="6" ry="8" />
        {[0, 1, 2, 3].map((finger) => <path key={finger} d={`M${54 + finger * 5} 316L${48 + finger * 5} ${339 + (finger % 2) * 5}L${47 + finger * 5} ${355 + (finger % 2) * 5}`} />)}
      </g>)}
      <path d="M156 153Q160 149 164 153L163 221L160 229L157 221Z" />
      {Array.from({ length: 20 }, (_, index) => <rect key={index} x={index < 5 ? 157 : 155} y={114 + index * 10.4} width={index < 5 ? 6 : 10} height="6.5" rx="2" />)}
      {[0, 1, 2, 3, 4, 5, 6].map((rib) => <g key={rib} className="anatomy-rib">
        <path d={`M157 ${168 + rib * 10}C${128 - rib} ${151 + rib * 10} ${108 - rib * .5} ${164 + rib * 9} ${116 + rib * .8} ${180 + rib * 9}Q133 ${190 + rib * 9} 155 ${183 + rib * 9}`} />
        <path d={`M163 ${168 + rib * 10}C${192 + rib} ${151 + rib * 10} ${212 + rib * .5} ${164 + rib * 9} ${204 - rib * .8} ${180 + rib * 9}Q187 ${190 + rib * 9} 165 ${183 + rib * 9}`} />
      </g>)}
      <path d="M143 339Q149 331 160 332Q171 331 177 339L170 358L160 370L150 358Z" />
      <path d="M137 83Q132 93 143 102L152 105L156 117L164 117L168 105L177 102Q188 93 183 83L176 91L167 94L164 91L160 92L156 91L153 94L144 91Z" />
    </g>
    <g className="anatomy-contours">
      <path d="M132 68Q134 36 159 34Q185 36 188 68M140 107Q160 122 180 107M155 84L154 98L162 99L166 96M149 106Q160 108 171 106M146 102L147 111M151 103L152 113M156 103V114M161 103V114M166 103L165 113M171 102L170 111" />
      <path d="M112 177Q104 231 114 263M208 177Q216 231 206 263M120 289Q131 312 146 320M200 289Q189 312 174 320M151 391L146 440M169 391L174 440" />
    </g>
  </g>;
}
