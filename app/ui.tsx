"use client";

import { Search, X } from "lucide-react";
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode, TableHTMLAttributes } from "react";

type SurfaceProps = HTMLAttributes<HTMLElement> & { children: ReactNode };

export function PageHeader({ children, className = "", ...props }: SurfaceProps) {
  return <header className={`page-header ${className}`.trim()} {...props}>{children}</header>;
}

export function Hero({ children, className = "", ...props }: SurfaceProps) {
  return <section className={`hero ${className}`.trim()} {...props}>{children}</section>;
}

export function MetricCard({ children, className = "", ...props }: SurfaceProps) {
  return <article className={`metric-card ${className}`.trim()} {...props}>{children}</article>;
}

export function ActionCard({ children, className = "", ...props }: SurfaceProps) {
  return <article className={`action-card ${className}`.trim()} {...props}>{children}</article>;
}

export const TopicCard = ActionCard;
export const ChapterCard = ActionCard;
export const SectionCard = ActionCard;
export const ReviewCard = ActionCard;
export const FormulaCard = ActionCard;

export function FilterBar({ children, className = "", ...props }: SurfaceProps) {
  return <div className={`filter-bar ${className}`.trim()} {...props}>{children}</div>;
}

export function SearchBar({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <label className={`search-bar ${className}`.trim()}><Search size={16} /><input type="search" {...props} /></label>;
}

export function ProgressRing({ value, label }: { value: number | null; label: string }) {
  return <div className="progress-ring" style={{ "--progress": `${(value ?? 0) * 3.6}deg` } as CSSProperties}><span><strong>{value === null ? "—" : `${value}%`}</strong><small>{label}</small></span></div>;
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return <div className="progress-bar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} role="progressbar"><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "info" | "neutral" }) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}

export function QuestionOption({ children, selected = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return <button className={selected ? "question-option selected" : "question-option"} aria-pressed={selected} {...props}>{children}</button>;
}

export function Flashcard({ children, className = "", ...props }: SurfaceProps) {
  return <article className={`flashcard ${className}`.trim()} {...props}>{children}</article>;
}

export function Table({ children, className = "", ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <div className="table-wrap"><table className={`table ${className}`.trim()} {...props}>{children}</table></div>;
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return <div className="empty-state">{icon}<h3>{title}</h3>{children && <p>{children}</p>}</div>;
}

export function SkeletonLoader({ lines = 3 }: { lines?: number }) {
  return <div className="skeleton-loader" aria-label="Loading">{Array.from({ length: lines }, (_, index) => <i key={index} />)}</div>;
}

export function Toast({ children, tone = "info" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "info" }) {
  return <div className={`toast ${tone}`} role="status">{children}</div>;
}

export function Drawer({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="drawer-backdrop"><aside className="drawer" aria-label={title}><header><h2>{title}</h2><button onClick={onClose} aria-label="Close drawer"><X /></button></header>{children}</aside></div>;
}

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-label={title}><button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X /></button>{children}</section></div>;
}

export function Accordion({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return <details className="accordion" open={open || undefined}><summary>{title}</summary><div>{children}</div></details>;
}

export function Tabs({ label, children }: { label: string; children: ReactNode }) {
  return <div className="tabs" role="tablist" aria-label={label}>{children}</div>;
}
