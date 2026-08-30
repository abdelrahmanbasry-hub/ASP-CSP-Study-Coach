"use client";

import {
  BookMarked,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  ListChecks,
  Search,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import type { SearchTarget } from "./globalSearch";
import { KEY_INFORMATION, type KeyInformationChapter } from "./keyInformationData";

type ChapterMatch = {
  chapter: KeyInformationChapter;
  matchingPoints: readonly string[];
  titleMatches: boolean;
};

function highlightMatch(text: string, query: string) {
  const needle = query.trim();
  if (!needle) return text;

  const start = text.toLocaleLowerCase().indexOf(needle.toLocaleLowerCase());
  if (start < 0) return text;

  return (
    <>
      {text.slice(0, start)}
      <mark>{text.slice(start, start + needle.length)}</mark>
      {text.slice(start + needle.length)}
    </>
  );
}

export default function KeyInformation({ searchTarget }: { searchTarget?: (SearchTarget & { requestKey: number }) | null }) {
  const initialChapter = searchTarget?.chapterNumber ?? KEY_INFORMATION[0]?.chapter ?? 1;
  const initialQuery = searchTarget?.query?.replace(/…$/, "").trimEnd() ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const deferredQuery = useDeferredValue(query);
  const readingTitleRef = useRef<HTMLHeadingElement>(null);

  const chapterMatches = useMemo<readonly ChapterMatch[]>(() => {
    const needle = deferredQuery.trim().toLocaleLowerCase();

    return KEY_INFORMATION.flatMap((chapter) => {
      if (!needle) return [{ chapter, matchingPoints: chapter.points, titleMatches: false }];

      const titleMatches = chapter.title.toLocaleLowerCase().includes(needle);
      const matchingPoints = chapter.points.filter((point) => point.toLocaleLowerCase().includes(needle));
      return titleMatches || matchingPoints.length ? [{ chapter, matchingPoints, titleMatches }] : [];
    });
  }, [deferredQuery]);

  const activeMatch = chapterMatches.find(({ chapter }) => chapter.chapter === selectedChapter) ?? chapterMatches[0] ?? null;
  const activeIndex = activeMatch ? chapterMatches.indexOf(activeMatch) : -1;
  const totalPoints = useMemo(() => KEY_INFORMATION.reduce((sum, chapter) => sum + chapter.points.length, 0), []);
  const activePoints = activeMatch
    ? activeMatch.matchingPoints.length || activeMatch.titleMatches
      ? activeMatch.matchingPoints.length
        ? activeMatch.matchingPoints
        : activeMatch.chapter.points
      : activeMatch.chapter.points
    : [];
  const showingPointMatches = Boolean(deferredQuery.trim() && activeMatch?.matchingPoints.length);

  const chooseChapter = (chapterNumber: number, moveFocus = false) => {
    setSelectedChapter(chapterNumber);
    if (moveFocus) requestAnimationFrame(() => readingTitleRef.current?.focus());
  };

  const moveChapter = (direction: -1 | 1) => {
    const nextMatch = chapterMatches[activeIndex + direction];
    if (nextMatch) chooseChapter(nextMatch.chapter.chapter, true);
  };

  return (
    <main className="resource-page key-information-page">
      <section className="library-hero page-width key-information-hero">
        <div>
          <p className="eyebrow"><BookMarked size={16} aria-hidden="true" /> Yates companion notes</p>
          <h1>Key Information</h1>
          <p>Find the chapter you need, then study its source-backed points in a focused reading view.</p>
        </div>
        <div className="key-information-hero-stats" aria-label={`${KEY_INFORMATION.length} chapters and ${totalPoints} key points`}>
          <div><strong>{KEY_INFORMATION.length}</strong><span>chapters</span></div>
          <div><strong>{totalPoints}</strong><span>key points</span></div>
        </div>
      </section>

      <section className="page-width key-information-content">
        <div className="key-information-source-note">
          <FileCheck2 size={18} aria-hidden="true" />
          <p><strong>Source-backed reference.</strong> These points preserve the supplied <em>Safety Professional&apos;s Reference and Study Guide</em> chapter-end wording and order.</p>
        </div>

        <div className="key-information-search-row">
          <div className="key-information-search">
            <Search size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="key-information-search">Search key information</label>
            <input
              id="key-information-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search standards, formulas, numbers, or concepts"
              type="search"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear key information search">
                <X size={17} aria-hidden="true" />
              </button>
            )}
          </div>
          <p aria-live="polite">
            <strong>{chapterMatches.length}</strong> of {KEY_INFORMATION.length} chapters
          </p>
        </div>

        {chapterMatches.length ? (
          <div className="key-information-reader">
            <aside className="key-information-index" aria-label="Key information chapters">
              <div className="key-information-index-heading">
                <div>
                  <span>Chapter index</span>
                  <strong>Choose a reference</strong>
                </div>
                <ListChecks size={21} aria-hidden="true" />
              </div>

              <label className="key-information-mobile-select">
                <span>Open chapter</span>
                <select
                  value={activeMatch?.chapter.chapter ?? ""}
                  onChange={(event) => chooseChapter(Number(event.target.value))}
                >
                  {chapterMatches.map(({ chapter }) => (
                    <option key={chapter.chapter} value={chapter.chapter}>Ch. {chapter.chapter}: {chapter.title}</option>
                  ))}
                </select>
              </label>

              <nav className="key-information-chapter-list">
                {chapterMatches.map(({ chapter, matchingPoints, titleMatches }) => {
                  const isActive = chapter.chapter === activeMatch?.chapter.chapter;
                  const matchLabel = deferredQuery.trim()
                    ? titleMatches && !matchingPoints.length
                      ? "Title match"
                      : `${matchingPoints.length} matching point${matchingPoints.length === 1 ? "" : "s"}`
                    : `${chapter.points.length} key points`;

                  return (
                    <button
                      type="button"
                      key={chapter.chapter}
                      className={isActive ? "active" : ""}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => chooseChapter(chapter.chapter)}
                    >
                      <span>{String(chapter.chapter).padStart(2, "0")}</span>
                      <span><strong>{chapter.title}</strong><small>{matchLabel}</small></span>
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  );
                })}
              </nav>
            </aside>

            {activeMatch && (
              <article className="key-information-reading-pane">
                <header>
                  <div className="key-information-chapter-number">
                    <span>Chapter</span>
                    <strong>{String(activeMatch.chapter.chapter).padStart(2, "0")}</strong>
                  </div>
                  <div className="key-information-reading-heading">
                    <p><CheckCircle2 size={15} aria-hidden="true" /> Source verified · printed pp. {activeMatch.chapter.sourcePages?.join(", ")}</p>
                    <h2 ref={readingTitleRef} tabIndex={-1}>{highlightMatch(activeMatch.chapter.title, deferredQuery)}</h2>
                    <span>{activePoints.length} {showingPointMatches ? "matching" : "source"} point{activePoints.length === 1 ? "" : "s"}</span>
                  </div>
                </header>

                <ol className="key-information-points">
                  {activePoints.map((point) => (
                    <li key={point}>
                      <span aria-hidden="true">{String(activeMatch.chapter.points.indexOf(point) + 1).padStart(2, "0")}</span>
                      <p>{highlightMatch(point, deferredQuery)}</p>
                    </li>
                  ))}
                </ol>

                <footer className="key-information-pagination" aria-label="Chapter navigation">
                  <button type="button" onClick={() => moveChapter(-1)} disabled={activeIndex <= 0}>
                    <ChevronLeft size={17} aria-hidden="true" /> Previous
                  </button>
                  <span>{activeIndex + 1} of {chapterMatches.length}</span>
                  <button type="button" onClick={() => moveChapter(1)} disabled={activeIndex >= chapterMatches.length - 1}>
                    Next <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </footer>
              </article>
            )}
          </div>
        ) : (
          <div className="empty-state key-information-empty">
            <Search aria-hidden="true" />
            <h2>No matching key information</h2>
            <p>Try a shorter phrase, a chapter title, or a standard number.</p>
            <button type="button" className="secondary-button" onClick={() => setQuery("")}>Clear search</button>
          </div>
        )}
      </section>
    </main>
  );
}
