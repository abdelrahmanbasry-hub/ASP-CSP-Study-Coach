import { InteractiveHazardScene, type HazardSceneProps } from "./InteractiveHazardScene";
/** Flow paths, process boundaries, atmospheric conditions and control points are data. */
export function ProcessHazardDiagram(props: HazardSceneProps) {
  return <InteractiveHazardScene {...props} />;
}
