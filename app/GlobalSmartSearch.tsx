"use client";

import {
  AlertTriangle,
  BookMarked,
  BookOpenCheck,
  Calculator,
  FileQuestion,
  FlaskConical,
  History,
  Layers3,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Attempt, CoachQuestion } from "./adaptiveEngine";
import { PRACTICE_V2_QUESTIONS } from "./practiceV2Catalog";
import { buildGlobalSearchIndex, searchGlobalIndex, type SearchKind, type SearchResult } from "./globalSearch";

const KIND_ICON: Record<SearchKind, typeof Search> = {
  chapter: BookOpenCheck,
  question: FileQuestion,
  homework: BookMarked,
  formula: Calculator,
  standard: ShieldCheck,
  hazard: FlaskConical,
  flashcard: Layers3,
  mistake: History,
  library: BookMarked,
};

const SUGGESTIONS = ["ventilation", "1910.95 noise", "unit conversion", "confined space"];

export default function GlobalSmartSearch({
  open,
  examName,
  practiceBank,
  attempts,
  onClose,
  onOpenResult,
}: {
  open: boolean;
  examName: "ASP" | "CSP";
  practiceBank: readonly CoachQuestion[];
  attempts: readonly Attempt[];
  onClose: () => void;
  onOpenResult: (result: SearchResult) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(
    () => buildGlobalSearchIndex({ examName, practiceBank, chapterPractice: PRACTICE_V2_QUESTIONS, attempts }),
    [examName, practiceBank, attempts],
  );
  const results = useMemo(() => searchGlobalIndex(index, query), [index, query]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  if (!open) return null;
  const openResult = (result: SearchResult) => {
    onOpenResult(result);
    setQuery("");
  };

  return (
    <div className="smart-search-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="smart-search-dialog" role="dialog" aria-modal="true" aria-labelledby="smart-search-title">
        <div className="smart-search-input-row">
          <Search size={21} aria-hidden="true" />
          <label htmlFor="global-smart-search" className="sr-only">Search all study resources</label>
          <input
            ref={inputRef}
            id="global-smart-search"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
            onKeyDown={(event) => {
              if (event.key === "Escape") onClose();
              if (event.key === "ArrowDown" && results.length) {
                event.preventDefault();
                setActiveIndex((value) => (value + 1) % results.length);
              }
              if (event.key === "ArrowUp" && results.length) {
                event.preventDefault();
                setActiveIndex((value) => (value - 1 + results.length) % results.length);
              }
              if (event.key === "Enter" && results[activeIndex]) openResult(results[activeIndex]);
            }}
            placeholder="Search chapters, questions, formulas, hazards, OSHA, flashcards…"
            autoComplete="off"
          />
          <button type="button" className="smart-search-close" onClick={onClose} aria-label="Close search"><X size={19} /></button>
        </div>

        <div className="smart-search-body">
          {!query.trim() ? (
            <div className="smart-search-welcome">
              <span className="smart-search-mark"><Search size={24} /></span>
              <p className="eyebrow">One search · every study resource</p>
              <h2 id="smart-search-title">What do you need to understand?</h2>
              <p>Search concepts, standards, calculations, your mistakes, and the study material connected to them.</p>
              <div className="smart-search-suggestions" aria-label="Suggested searches">
                {SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => setQuery(suggestion)}>{suggestion}</button>)}
              </div>
            </div>
          ) : results.length ? (
            <div className="smart-search-results" role="listbox" aria-label={`${results.length} search results`}>
              <div className="smart-search-summary"><strong>{results.length} best matches</strong><span>across {new Set(results.map((result) => result.kind)).size} resource types</span></div>
              {results.map((result, indexValue) => {
                const Icon = KIND_ICON[result.kind];
                return (
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeIndex === indexValue}
                    className={activeIndex === indexValue ? "smart-search-result active" : "smart-search-result"}
                    key={result.id}
                    onMouseEnter={() => setActiveIndex(indexValue)}
                    onClick={() => openResult(result)}
                  >
                    <span className={`smart-search-result-icon ${result.kind}`}><Icon size={18} aria-hidden="true" /></span>
                    <span className="smart-search-result-copy">
                      <span><small>{result.label}</small><em>{result.meta}</em></span>
                      <strong>{result.title}</strong>
                      <p>{result.excerpt}</p>
                    </span>
                    <span className="smart-search-open">Open</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="smart-search-empty">
              <AlertTriangle size={24} />
              <h2 id="smart-search-title">No connected resource found</h2>
              <p>Try a broader concept, a chapter name, or a standard number such as 1910.95.</p>
            </div>
          )}
        </div>
        <footer className="smart-search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></footer>
      </section>
    </div>
  );
}
