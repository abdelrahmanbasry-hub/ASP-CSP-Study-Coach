"use client";

import { BookMarked, CheckCircle2, CircleHelp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { KEY_INFORMATION } from "./keyInformationData";

export default function KeyInformation() {
  const [query, setQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("all");
  const visibleChapters = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return KEY_INFORMATION.filter((chapter) => {
      const matchesChapter = selectedChapter === "all" || String(chapter.chapter) === selectedChapter;
      const matchesQuery = !needle || `${chapter.title} ${chapter.points.join(" ")}`.toLowerCase().includes(needle);
      return matchesChapter && matchesQuery;
    });
  }, [query, selectedChapter]);

  return (
    <main className="resource-page key-information-page">
      <section className="library-hero page-width">
        <div>
          <p className="eyebrow"><BookMarked size={16} /> Yates companion notes</p>
          <h1>Key Information</h1>
          <p>Chapter-end source points preserved from the supplied study guide, with their original detail and order.</p>
        </div>
        <div className="library-hero-stat"><strong>{KEY_INFORMATION.length}</strong><span>chapter records</span></div>
      </section>

      <section className="page-width key-information-content">
        <p className="reference-note"><CircleHelp size={15} /> Points marked <strong>Source verified</strong> are transcribed from the supplied <em>Safety Professional&apos;s Reference and Study Guide</em> (W. David Yates, 3rd ed.), preserving the book&apos;s own end-of-chapter format: “Key Information,” “Key Points,” summaries, or standards.</p>
        <div className="key-information-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a topic or concept" aria-label="Search key information" /></label>
          <select value={selectedChapter} onChange={(event) => setSelectedChapter(event.target.value)} aria-label="Filter by chapter">
            <option value="all">All chapters</option>
            {KEY_INFORMATION.map((chapter) => <option key={chapter.chapter} value={chapter.chapter}>Ch. {chapter.chapter}: {chapter.title}</option>)}
          </select>
        </div>
        <p className="key-information-count">{visibleChapters.length} chapter{visibleChapters.length === 1 ? "" : "s"} shown</p>
        <div className="key-information-grid">
          {visibleChapters.map((chapter, index) => (
            <details className="key-information-card" open={index < 6 ? true : undefined} key={chapter.chapter}>
              <summary><span>CH {String(chapter.chapter).padStart(2, "0")}</span><h2>{chapter.title}</h2><small>{chapter.sourceStatus === "verified" ? `${chapter.points.length} source points` : "Source needed"}</small></summary>
              <div className="key-information-card-body">
                {chapter.sourceStatus === "verified" ? <><p className="key-information-source">Source verified · printed pp. {chapter.sourcePages?.join(", ")}</p><ol>{chapter.points.map((point) => <li key={point}><CheckCircle2 size={16} /><span>{point}</span></li>)}</ol></> : <p className="key-information-missing">The supplied edition does not include a chapter-end “Key Information to Remember” section for this chapter. Source material is needed before content can be added faithfully.</p>}
              </div>
            </details>
          ))}
        </div>
        {!visibleChapters.length && <div className="empty-state"><Search /><h3>No matching chapter notes</h3><p>Try a broader topic or choose all chapters.</p></div>}
      </section>
    </main>
  );
}
