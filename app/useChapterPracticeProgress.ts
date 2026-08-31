"use client";
import { useEffect, useState } from "react";
import { emptyPracticeV2Progress, loadPracticeV2Progress, savePracticeV2Progress, type PracticeV2Progress } from "./practiceV2";
export const CHAPTER_PROGRESS_EVENT = "coach:chapter-progress";
export function useChapterPracticeProgress() {
  const [progress, setProgress] = useState(emptyPracticeV2Progress);
  useEffect(() => {
    const refresh = () => { try { setProgress(loadPracticeV2Progress(window.localStorage)); } catch { /* Storage can be unavailable in restricted browsing; writes surface an error in Practice. */ } };
    const frame = window.requestAnimationFrame(refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(CHAPTER_PROGRESS_EVENT, refresh);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("storage", refresh); window.removeEventListener(CHAPTER_PROGRESS_EVENT, refresh); };
  }, []);
  function save(next: PracticeV2Progress) {
    savePracticeV2Progress(window.localStorage, next);
    setProgress(next);
    window.dispatchEvent(new Event(CHAPTER_PROGRESS_EVENT));
  }
  return [progress, save] as const;
}
