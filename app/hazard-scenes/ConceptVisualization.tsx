import { InteractiveHazardScene, type HazardSceneProps } from "./InteractiveHazardScene";
/** Physical relationships stay LTR; principle cards and descriptions localize independently. */
export function ConceptVisualization(props: HazardSceneProps) {
  return <InteractiveHazardScene {...props} />;
}
