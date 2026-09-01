"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Search,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState, useEffect } from "react";
import { PageHeader } from "./ui/learning-ui";
import { BookmarkAction } from "./StudySystem";
import type { StudySystemState } from "./studySystemState";
import { updateResourceRoute } from "./coachRoutes";
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

export default function KeyInformation({ searchTarget, system, onSystem, onOpen }: { searchTarget?: (SearchTarget & { requestKey: number }) | null; system?: StudySystemState; onSystem?: (s:StudySystemState)=>void; onOpen?: (t:SearchTarget)=>void }) {
  const initialChapter = searchTarget?.chapterNumber ?? KEY_INFORMATION[0]?.chapter ?? 1;
  const initialQuery = searchTarget?.query?.replace(/…$/, "").trimEnd() ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const deferredQuery = useDeferredValue(query);
  const readingTitleRef = useRef<HTMLHeadingElement>(null);

  const chapterMatches = useMemo<readonly ChapterMatch[]>(() => {
    const needle = deferredQuery.trim().toLocaleLowerCase();

    return KEY_INFORMATION.flatMap<ChapterMatch>((chapter) => {
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
    updateResourceRoute({view:"key-information",chapterNumber,query});
    if (moveFocus) requestAnimationFrame(() => readingTitleRef.current?.focus());
  };

  useEffect(()=>{if(searchTarget?.itemId){const frame=requestAnimationFrame(()=>document.getElementById(searchTarget.itemId!)?.scrollIntoView({block:"center"}));return()=>cancelAnimationFrame(frame);}},[searchTarget?.itemId]);
  const moveChapter = (direction: -1 | 1) => {
    const nextMatch = chapterMatches[activeIndex + direction];
    if (nextMatch) chooseChapter(nextMatch.chapter.chapter, true);
  };

  return (
    <main className="resource-page key-information-page">
      <div className="page-width"><PageHeader title="Key Information" description={`${KEY_INFORMATION.length} source chapters · ${totalPoints} key points. Find a chapter and start reading.`}/></div>
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
              onChange={(event) => {setQuery(event.target.value);updateResourceRoute({view:"key-information",chapterNumber:selectedChapter,query:event.target.value});}}
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
            <nav className="key-information-chapter-picker" aria-label="Choose a key information chapter">
              <label>
                <span>Reference chapter</span>
                <select
                  value={activeMatch?.chapter.chapter ?? ""}
                  onChange={(event) => chooseChapter(Number(event.target.value), true)}
                >
                  {chapterMatches.map(({ chapter, matchingPoints, titleMatches }) => {
                    const matchLabel = deferredQuery.trim()
                      ? titleMatches && !matchingPoints.length
                        ? "title match"
                        : `${matchingPoints.length} matching point${matchingPoints.length === 1 ? "" : "s"}`
                      : `${chapter.points.length} points`;
                    return <option key={chapter.chapter} value={chapter.chapter}>Chapter {String(chapter.chapter).padStart(2, "0")} — {chapter.title} · {matchLabel}</option>;
                  })}
                </select>
              </label>
              <span className="key-information-chapter-position" aria-live="polite">Chapter {activeIndex + 1} of {chapterMatches.length}</span>
              <div className="key-information-chapter-stepper">
                <button type="button" onClick={() => moveChapter(-1)} disabled={activeIndex <= 0} aria-label="Previous chapter">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => moveChapter(1)} disabled={activeIndex >= chapterMatches.length - 1} aria-label="Next chapter">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </nav>

            {activeMatch && (
              <article className="key-information-reading-pane">
                <header>
                  <div className="key-information-chapter-number">
                    <span>Source chapter</span>
                    <strong>{String(activeMatch.chapter.chapter).padStart(2, "0")}</strong>
                  </div>
                  <div className="key-information-reading-heading">
                    <p><CheckCircle2 size={15} aria-hidden="true" /> Source wording preserved · printed pp. {activeMatch.chapter.sourcePages?.join(", ")}</p>
                    <h2 ref={readingTitleRef} tabIndex={-1}>{highlightMatch(activeMatch.chapter.title, deferredQuery)}</h2>
                    <span>{activePoints.length} {showingPointMatches ? "matching" : "source"} point{activePoints.length === 1 ? "" : "s"}</span>
                  </div>
                </header>

                <ol className="key-information-points">
                  {activePoints.map((point) => (
                    <li key={point} id={`key-point:${activeMatch.chapter.chapter}:${activeMatch.chapter.points.indexOf(point)}`}>
                      <span className="key-information-point-number" aria-hidden="true">{String(activeMatch.chapter.points.indexOf(point) + 1).padStart(2, "0")}</span>
                      <p>{highlightMatch(point, deferredQuery)}</p>
                      {system&&onSystem&&<BookmarkAction
                        kind="chapter"
                        itemId={`key-point:${activeMatch.chapter.chapter}:${activeMatch.chapter.points.indexOf(point)}`}
                        title={`${activeMatch.chapter.title} · Point ${activeMatch.chapter.points.indexOf(point)+1}`}
                        subtitle={point}
                        system={system}
                        onChange={onSystem}
                      />}
                    </li>
                  ))}
                </ol>

                {onOpen&&<div className="reading-connections"><button className="secondary-button" onClick={()=>onOpen({view:"practice",query:activeMatch.chapter.title,practiceTags:[activeMatch.chapter.title]})}>Related practice</button><button className="secondary-button" onClick={()=>onOpen({view:"notebook",query:activeMatch.chapter.title})}>Open chapter notes</button></div>}
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
