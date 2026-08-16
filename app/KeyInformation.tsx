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
      const matchesQuery = !needle || `${chapter.title} ${chapter.takeaways.join(" ")}`.toLowerCase().includes(needle);
      return matchesChapter && matchesQuery;
    });
  }, [query, selectedChapter]);

  return (
    <main className="resource-page key-information-page">
      <section className="library-hero page-width">
        <div>
          <p className="eyebrow"><BookMarked size={16} /> Yates companion notes</p>
          <h1>Key Information</h1>
          <p>Chapter-by-chapter study priorities for fast retrieval before a practice block or exam review.</p>
        </div>
        <div className="library-hero-stat"><strong>{KEY_INFORMATION.length}</strong><span>chapter summaries</span></div>
      </section>

      <section className="page-width key-information-content">
        <p className="reference-note"><CircleHelp size={15} /> Original study notes informed by the supplied <em>Safety Professional&apos;s Reference and Study Guide</em> (W. David Yates, 3rd ed.). They are an independent learning aid; use your licensed copy for the complete source text.</p>
        <div className="key-information-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a topic or concept" aria-label="Search key information" /></label>
          <select value={selectedChapter} onChange={(event) => setSelectedChapter(event.target.value)} aria-label="Filter by chapter">
            <option value="all">All chapters</option>
            {KEY_INFORMATION.map((chapter) => <option key={chapter.chapter} value={chapter.chapter}>Ch. {chapter.chapter}: {chapter.title}</option>)}
          </select>
        </div>
        <p className="key-information-count">{visibleChapters.length} chapter{visibleChapters.length === 1 ? "" : "s"} shown</p>
        <div className="key-information-grid">
          {visibleChapters.map((chapter) => (
            <article className="key-information-card" key={chapter.chapter}>
              <span>CH {String(chapter.chapter).padStart(2, "0")}</span>
              <h2>{chapter.title}</h2>
              <ul>{chapter.takeaways.map((takeaway) => <li key={takeaway}><CheckCircle2 size={16} />{takeaway}</li>)}</ul>
            </article>
          ))}
        </div>
        {!visibleChapters.length && <div className="empty-state"><Search /><h3>No matching chapter notes</h3><p>Try a broader topic or choose all chapters.</p></div>}
      </section>
    </main>
  );
}
