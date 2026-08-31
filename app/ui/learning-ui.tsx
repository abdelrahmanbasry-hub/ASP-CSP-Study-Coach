"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function focusLearningContent() {
  window.requestAnimationFrame(() => {
    const main = document.querySelector<HTMLElement>("main");
    if (main) main.id = "learning-content";
    const heading = main?.querySelector<HTMLElement>("h1, h2");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}
export function useLearningFocus(key: string | number) {
  useEffect(() => { focusLearningContent(); }, [key]);
}
export function PageHeader({ title, description, eyebrow, children }: { title: string; description: string; eyebrow?: string; children?: ReactNode }) {
  return <header className="learning-page-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1 tabIndex={-1}>{title}</h1><p>{description}</p></div>{children && <div className="learning-header-action">{children}</div>}</header>;
}
/** Shared keyboard containment, Escape and focus return for modal surfaces. */
export function useDialogFocus(open: boolean, onClose?: () => void) {
  const ref = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    const controls = () => [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex="0"]')].filter(element => element.tabIndex >= 0 && window.getComputedStyle(element).display !== 'none' && window.getComputedStyle(element).visibility !== 'hidden' && !element.closest('[hidden], [inert]') && element.getAttribute('aria-hidden') !== 'true');
    const frame = window.requestAnimationFrame(() => (dialog.querySelector<HTMLElement>('[data-dialog-initial-focus]') ?? controls()[0] ?? dialog).focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && close.current) { event.preventDefault(); event.stopPropagation(); close.current(); }
      if (event.key !== 'Tab') return;
      const items = controls();
      if (!items.length) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (document.activeElement === items[0] || !dialog.contains(document.activeElement))) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && (document.activeElement === items.at(-1) || !dialog.contains(document.activeElement))) { event.preventDefault(); items[0].focus(); }
    };
    const contain = (event: FocusEvent) => { if (event.target instanceof Node && !dialog.contains(event.target)) (controls()[0] ?? dialog).focus(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', keydown, true);
    document.addEventListener('focusin', contain);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', keydown, true);
      document.removeEventListener('focusin', contain);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);
  return ref;
}
