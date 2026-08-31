import { InteractiveHazardScene, type HazardSceneProps } from "./InteractiveHazardScene";
/** Equipment, load, operator, dynamic forces and environment overlays use the same contract. */
export function EquipmentHazardScene(props: HazardSceneProps) {
  return <InteractiveHazardScene {...props} />;
}
