"use client";

import { AlertTriangle, Atom, Biohazard, BookMarked, Calculator, CheckCircle2, FlaskConical, Gauge, HardHat, Lightbulb, Search, ShieldCheck, Volume2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { KEY_INFORMATION, type KeyInformationChapter } from "./keyInformationData";
import { FORMULA_ENTRIES } from "./studyLibraryData";

type TopicGroup = { id: string; title: string; chapters: number[]; icon: ReactNode; takeaway: string };

const GROUPS: TopicGroup[] = [
  { id: "chemical", title: "Chemical Hazards", chapters: [4, 5, 6], icon: <FlaskConical />, takeaway: "Identify the agent, exposure pathway, and affected system." },
  { id: "physical", title: "Physical Hazards", chapters: [7, 8, 10, 11, 14], icon: <Volume2 />, takeaway: "Recognize the energy, measure it, then select controls." },
  { id: "biological", title: "Biological Hazards", chapters: [9], icon: <Biohazard />, takeaway: "Understand transmission and break the exposure pathway." },
  { id: "recognition", title: "Hazard Recognition", chapters: [20, 23, 24, 25], icon: <Search />, takeaway: "Look systematically before choosing a response." },
  { id: "assessment", title: "Exposure Assessment", chapters: [6, 13, 24, 32], icon: <Gauge />, takeaway: "Use evidence, measurement, and uncertainty together." },
  { id: "controls", title: "Controls", chapters: [7, 12, 17, 29, 33], icon: <ShieldCheck />, takeaway: "Use the most effective feasible control first." },
];

export default function KeyInformation() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const chapterMap = useMemo(() => new Map(KEY_INFORMATION.map((chapter) => [chapter.chapter, chapter])), []);
  const groups = useMemo(() => GROUPS.map((group) => ({ ...group, records: group.chapters.map((chapter) => chapterMap.get(chapter)).filter(Boolean) as KeyInformationChapter[] })).filter((group) => {
    const haystack = `${group.title} ${group.records.flatMap((record) => [record.title, ...record.points]).join(" ")}`.toLowerCase();
    return (filter === "all" || filter === group.id) && (!query.trim() || haystack.includes(query.trim().toLowerCase()));
  }), [chapterMap, filter, query]);
  const formulaPreview = FORMULA_ENTRIES.slice(0, 5);
  const trapPreview = FORMULA_ENTRIES.filter((entry) => entry.commonError).slice(0, 5);
  const definitionPreview = KEY_INFORMATION.slice(3, 8);

  return <main className="resource-page key-information-page detailed-key-info">
    <section className="key-info-layout page-width">
      <div className="key-info-main">
        <section className="key-info-hero">
          <div><p className="eyebrow"><BookMarked size={15} /> Source-backed study reference</p><h1>Key Information Library</h1><p>Your compact reference for high-yield ASP study points. Search the supplied chapters and avoid guessing what is not in the source.</p>
            <label className="key-info-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search key topics, formulas, definitions..." aria-label="Search key information" /></label>
          </div>
          <div className="reference-illustration" aria-hidden="true"><span className="reference-book">ASP</span><Lightbulb /><Atom /></div>
          <nav className="key-info-filters" aria-label="Topic filters"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}><Search size={14} /> All Topics</button>{GROUPS.slice(0, 5).map((group) => <button className={filter === group.id ? "active" : ""} onClick={() => setFilter(group.id)} key={group.id}>{group.icon}{group.title.replace(" Hazards", "")}</button>)}</nav>
        </section>
        <section className="key-info-category-grid">
          {groups.map((group) => <article className={`key-info-category-card ${group.id}`} key={group.id}>
            <header><span>{group.icon}</span><h2>{group.title}</h2><small>{group.records.length} chapters</small></header>
            <ul>{group.records.flatMap((record) => record.points.slice(0, Math.max(1, Math.ceil(6 / group.records.length))).map((point) => ({ point, chapter: record.chapter }))).slice(0, 6).map(({ point, chapter }) => <li key={`${chapter}:${point}`}><CheckCircle2 /><span>{point}</span></li>)}</ul>
            <footer><Lightbulb /><strong>Key Takeaway:</strong><span>{group.takeaway}</span><button onClick={() => setFilter(group.id)}>View <span aria-hidden>→</span></button></footer>
          </article>)}
          {!groups.length && <div className="empty-state"><Search /><h3>No matching reference topics</h3><p>Try a broader source term.</p></div>}
        </section>
      </div>
      <aside className="key-info-aside">
        <section><h2>Quick Access Tools</h2><div className="quick-tools-grid"><div><HardHat /><strong>Regulations</strong><span>Source chapters</span></div><div><Calculator /><strong>Formula Sheet</strong><span>{FORMULA_ENTRIES.length} records</span></div><div><Biohazard /><strong>Hazards</strong><span>Reference library</span></div><div><Gauge /><strong>Conversions</strong><span>Formula category</span></div></div></section>
        <section className="common-formulas"><h2>Common Formulas</h2>{formulaPreview.map((entry) => <div key={entry.id}><strong>{entry.name}</strong><span>{entry.formula}</span></div>)}<p>Values shown are taken from the imported formula library.</p></section>
      </aside>
    </section>
    <section className="key-info-bottom page-width">
      <article className="common-traps"><h2><AlertTriangle /> Common Formula Traps <small>(Watch Out!)</small></h2><div>{trapPreview.map((entry) => <section key={entry.id}><strong>{entry.name}</strong><p>{entry.commonError}</p></section>)}</div></article>
      <article className="definitions-aids"><h2><Lightbulb /> Definitions &amp; Memory Aids</h2><div>{definitionPreview.map((chapter) => <section key={chapter.chapter}><strong>{chapter.title}</strong><p>{chapter.points[0]}</p></section>)}</div></article>
    </section>
  </main>;
}
