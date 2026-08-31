import { Accessibility, Activity, ArrowDownToLine, ArrowUpFromLine, BatteryCharging, Biohazard, Box, Cable, CircleHelp, CloudLightning, Construction, DoorOpen, Droplets, Ear, Flame, FlaskConical, Forklift, Gauge, Grid2X2, Hand, HardHat, HeartPulse, Leaf, LockKeyhole, Monitor, PersonStanding, PlugZap, Radiation, Settings, ShieldCheck, Shovel, Siren, Snowflake, Thermometer, Truck, Volume2, Waves, Wind, Workflow, Zap, type LucideIcon } from "lucide-react";
import type { SVGProps } from "react";
import { HAZARD_CATEGORY_BY_ID, type HazardCategoryId } from "../hazardCategories";
import type { HazardRecord } from "../hazardTypes";

// The existing icon library has no lungs glyph. One shared vector, not a raster
// or a component for each disease, completes the category vocabulary.
function Lungs(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3v8m0-3-3 4m3-4 3 4M9 6C6 4 3 12 3 17c0 4 6 3 7 0V9M15 6c3-2 6 6 6 11 0 4-6 3-7 0V9M6 13l3 2m9-2-3 2" /></svg>;
}

export const hazardCategoryIcons = { lungs: Lungs, flask: FlaskConical, zap: Zap, flame: Flame, height: Construction, gear: Settings, forklift: Forklift, person: Accessibility, radiation: Radiation, space: DoorOpen, lock: LockKeyhole, gauge: Gauge, ear: Volume2, temperature: Thermometer, shovel: Shovel, workflow: Workflow, leaf: Leaf, shield: ShieldCheck };
export const hazardIcons = { forklift: Forklift, pedestrian: PersonStanding, load: Box, battery: BatteryCharging, dock: Truck, lifting: ArrowUpFromLine, falling: ArrowDownToLine, ladder: Construction, electrical: PlugZap, "arc-flash": Zap, cable: Cable, flame: Flame, chemical: FlaskConical, spill: Droplets, air: Wind, noise: Ear, heat: Thermometer, cold: Snowflake, posture: Accessibility, workstation: Monitor, vibration: Activity, biological: Biohazard, radiation: Radiation, pressure: Gauge, lock: LockKeyhole, rescue: HeartPulse, emergency: Siren, weather: CloudLightning, water: Waves, guard: ShieldCheck, hand: Hand, hardhat: HardHat } satisfies Record<string, LucideIcon>;
type IconKey = keyof typeof hazardIcons;
// Ordered semantic families: more specific concepts precede equipment/category defaults.
const families: readonly [RegExp, IconKey][] = [
  [/battery|charging/i, "battery"], [/pedestrian/i, "pedestrian"], [/falling load|falling object|dropped object/i, "load"], [/dock|trailer|truck loading/i, "dock"], [/forklift|pallet jack/i, "forklift"],
  [/ladder|scaffold/i, "ladder"], [/fall|roof edge/i, "falling"], [/cord|cable/i, "cable"], [/shock|energized|electrical contact/i, "electrical"], [/arc flash/i, "arc-flash"], [/spill|corrosive/i, "spill"], [/fire|flame|hot work|combustible/i, "flame"],
  [/rescue/i, "rescue"], [/oxygen|inhalation|airborne|dust|asbestos/i, "air"], [/lifting|manual handling/i, "lifting"], [/posture|repetition/i, "posture"], [/workstation/i, "workstation"], [/vibration/i, "vibration"], [/noise|hearing/i, "noise"], [/cold|frostbite/i, "cold"], [/heat|thermal|dehydration/i, "heat"], [/hydraulic|pneumatic|pressure/i, "pressure"], [/lockout|startup|isolation/i, "lock"], [/radiation|x-ray|laser|ultraviolet/i, "radiation"], [/storm|weather/i, "weather"], [/evacuation|violence|emergency/i, "emergency"], [/water/i, "water"], [/guard/i, "guard"],
];

const iconRegistry = { ...hazardCategoryIcons, ...hazardIcons, all: Grid2X2, neutral: CircleHelp };
export function resolveHazardIconKey(record?: Pick<HazardRecord, "name" | "categoryId">, iconKey?: string): keyof typeof iconRegistry {
  if (iconKey && iconKey in hazardIcons) return iconKey as IconKey;
  const match = record && families.find(([pattern]) => pattern.test(record.name.en));
  if (match) return match[1];
  const category = record && HAZARD_CATEGORY_BY_ID[record.categoryId];
  return category && category.icon in hazardCategoryIcons ? category.icon as keyof typeof hazardCategoryIcons : "neutral";
}

export function HazardIcon({ record, categoryId, size = 22, label }: { record?: Pick<HazardRecord, "name" | "categoryId">; categoryId?: HazardCategoryId | "all"; size?: number; label?: string }) {
  const category = categoryId && categoryId !== "all" ? HAZARD_CATEGORY_BY_ID[categoryId] : undefined;
  const key = record ? resolveHazardIconKey(record) : categoryId === "all" ? "all" : category ? category.icon as keyof typeof hazardCategoryIcons : "neutral";
  const Icon = iconRegistry[key] ?? CircleHelp;
  return <Icon width={size} height={size} className="hazard-semantic-icon" data-category={record?.categoryId ?? categoryId} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
