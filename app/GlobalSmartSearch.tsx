"use client";
import { Search, X, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Attempt, CoachQuestion } from "./adaptiveEngine";
import { PRACTICE_V2_QUESTIONS } from "./practiceV2Catalog";
import { buildGlobalSearchIndex, searchGlobalIndex, type SearchKind, type SearchResult } from "./globalSearch";
import { useDialogFocus } from "./ui/learning-ui";

export default function GlobalSmartSearch({open,examName,practiceBank,attempts,onClose,onOpenResult}:{open:boolean;examName:"ASP"|"CSP";practiceBank:readonly CoachQuestion[];attempts:readonly Attempt[];onClose:()=>void;onOpenResult:(r:SearchResult)=>void}) {
  const dialogRef=useDialogFocus(open,onClose);
  const [query,setQuery]=useState("");
  const [kind,setKind]=useState<SearchKind|"all">("all");
  const [active,setActive]=useState(0);
  const index=useMemo(()=>buildGlobalSearchIndex({examName,practiceBank,chapterPractice:PRACTICE_V2_QUESTIONS,attempts}),[examName,practiceBank,attempts]);
  const results=useMemo(()=>searchGlobalIndex(kind==="all"?index:index.filter(item=>item.kind===kind),query),[index,query,kind]);
  useEffect(()=>{if(open)document.getElementById(`study-search-${active}`)?.scrollIntoView({block:"nearest"});},[active,open]);
  if(!open)return null;
  return <div className="smart-search-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section ref={dialogRef} tabIndex={-1} className="smart-search-dialog" role="dialog" aria-modal="true" aria-labelledby="smart-search-title">
      <h2 id="smart-search-title" className="sr-only">Search study resources</h2>
      <div className="smart-search-input-row"><Search aria-hidden="true"/><label htmlFor="global-smart-search" className="sr-only">Search all study resources</label><input id="global-smart-search" data-dialog-initial-focus role="combobox" aria-autocomplete="list" aria-expanded={Boolean(query.trim())} aria-controls={query.trim() ? "study-search-results" : undefined} aria-activedescendant={results[active]&&query.trim()?`study-search-${active}`:undefined} value={query} onChange={e=>{setQuery(e.target.value);setActive(0);}} placeholder="Chapter, question, formula, hazard, or standard" onKeyDown={e=>{if(e.key==="ArrowDown"&&results.length){e.preventDefault();setActive((active+1)%results.length);}if(e.key==="ArrowUp"&&results.length){e.preventDefault();setActive((active-1+results.length)%results.length);}if(e.key==="Enter"&&query.trim()&&results[active])onOpenResult(results[active]);}}/><button className="smart-search-close" aria-label="Close search" onClick={onClose}><X/></button></div>
      <label className="search-kind-filter">Resource type<select value={kind} onChange={e=>{setKind(e.target.value as SearchKind|"all");setActive(0);}}><option value="all">All resources</option>{(["chapter","question","homework","formula","standard","hazard","flashcard","mistake"] as const).map(k=><option key={k} value={k}>{k}</option>)}</select></label>
      <div className="smart-search-body">
        {!query.trim()?<div className="smart-search-welcome"><h3>What are you studying?</h3><p>Find connected resources by concept or source reference.</p><div className="smart-search-suggestions">{["ventilation","1910.95 noise","unit conversion","confined space"].map(q=><button key={q} onClick={()=>{setQuery(q);setActive(0);}}>{q}</button>)}</div></div>:<><p className="smart-search-summary" role="status">{results.length} matches{kind!=="all"?` · ${kind}`:""}</p><div className="smart-search-results" role="listbox" id="study-search-results" aria-label="Search results">{results.map((result,i)=><button id={`study-search-${i}`} key={result.id} role="option" aria-selected={i===active} tabIndex={-1} className={`smart-search-result ${i===active?"active":""}`} onMouseEnter={()=>setActive(i)} onClick={()=>onOpenResult(result)}><span className="smart-search-result-copy"><span><small>{result.label}</small><em>{result.meta}</em></span><strong>{result.title}</strong><p>{result.kind==="question"||result.kind==="homework"?"Open the question to practice; the answer is not shown here.":result.excerpt}</p></span><ArrowRight aria-hidden="true"/></button>)}</div>{!results.length&&<div className="smart-search-empty"><h3>No matching resources</h3><p>Try a shorter concept, a standard number, or another resource type.</p><button className="secondary-button" onClick={()=>{setKind("all");setQuery("");}}>Clear search</button></div>}</>}
      </div><footer className="smart-search-footer"><span>↑ ↓ Choose</span><span>Enter Open</span><span>Esc Close</span></footer>
    </section>
  </div>;
}
