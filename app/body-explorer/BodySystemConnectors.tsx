import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import type { HazardTarget } from "../bodySystems";
import { ANATOMY_REGIONS, connectorPath } from "./anatomyGeometry";

type Connector = { target: HazardTarget; path: string; x: number; y: number };
export function BodySystemConnectors({ stageRef, targets, hoveredSystem, selectedSystem }: {
  stageRef: RefObject<HTMLDivElement | null>; targets: readonly HazardTarget[]; hoveredSystem: string | null; selectedSystem: string | null;
}) {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  useEffect(() => {
    const stage = stageRef.current;
    const svg = stage?.querySelector<SVGSVGElement>(".human-body-svg");
    if (!stage || !svg) return;
    let frame = 0;
    const measure = () => {
      const bounds = stage.getBoundingClientRect();
      const next = targets.flatMap((target) => {
        const card = stage.querySelector<HTMLElement>(`[data-callout-system="${target.systemId}"]`);
        const anchor = svg.querySelector(`[data-region-anchor="${target.systemId}"]`);
        if (!card || !anchor) return [];
        // Measure the rendered region pin, so zoom, resizing and SVG framing cannot detach the origin.
        const origin = anchor.getBoundingClientRect();
        const start = { x: origin.left + origin.width / 2 - bounds.left, y: origin.top + origin.height / 2 - bounds.top };
        const endBounds = card.getBoundingClientRect();
        const end = { x: endBounds.left - bounds.left, y: endBounds.top - bounds.top + endBounds.height / 2 };
        return [{ target, path: connectorPath(start, end), x: end.x, y: end.y }];
      });
      setConnectors(next);
    };
    const schedule = () => { window.cancelAnimationFrame(frame); frame = window.requestAnimationFrame(measure); };
    const observer = new window.ResizeObserver(schedule);
    observer.observe(stage);
    observer.observe(svg);
    stage.querySelectorAll("[data-callout-system]").forEach((card) => observer.observe(card));
    schedule();
    return () => { observer.disconnect(); window.cancelAnimationFrame(frame); };
  }, [stageRef, targets]);
  return <svg className="body-callout-connectors" aria-hidden="true">{connectors.map(({ target, path, x, y }) => <g key={target.systemId}
    data-connector-system={target.systemId} className={`is-${target.role}${hoveredSystem === target.systemId ? " is-hovered" : ""}${selectedSystem === target.systemId ? " is-selected" : ""}`}
    style={{ "--connector-color": ANATOMY_REGIONS[target.systemId].accent } as CSSProperties}>
    <path d={path} /><circle cx={x} cy={y} r="2.5" />
  </g>)}</svg>;
}
