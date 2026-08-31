import { InteractiveHazardScene, type HazardSceneProps } from "./InteractiveHazardScene";
/** Workers, sources, exposure regions and incident paths share a configurable scene plane. */
export function WorkerHazardScene(props: HazardSceneProps) {
  return <InteractiveHazardScene {...props} />;
}
