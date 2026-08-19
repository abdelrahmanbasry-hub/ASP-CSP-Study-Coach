export type BodySystemId = "brain" | "lungs" | "heart" | "liver" | "kidneys" | "digestive" | "skin" | "blood" | "systemic";

export type BodySystem = { id: BodySystemId; label: string; color: string; x: number; y: number };

export const BODY_SYSTEMS: readonly BodySystem[] = [
  { id: "brain", label: "Brain & nervous system", color: "#8857a6", x: 50, y: 18 },
  { id: "lungs", label: "Lungs & airways", color: "#438aa3", x: 40, y: 35 },
  { id: "heart", label: "Heart & circulation", color: "#d8655d", x: 60, y: 40 },
  { id: "liver", label: "Liver", color: "#b9863a", x: 60, y: 51 },
  { id: "kidneys", label: "Kidneys", color: "#4e789b", x: 42, y: 58 },
  { id: "digestive", label: "Digestive system", color: "#d17c56", x: 57, y: 63 },
  { id: "blood", label: "Blood & lymphatic system", color: "#b74e64", x: 50, y: 46 },
  { id: "skin", label: "Skin & mucosa", color: "#ce7f75", x: 26, y: 46 },
  { id: "systemic", label: "Whole-body / systemic", color: "#6a947b", x: 72, y: 72 },
] as const;

export const HAZARD_BODY_SYSTEMS: Readonly<Record<string, readonly BodySystemId[]>> = {
  "bio-anthrax": ["lungs", "skin"], "bio-brucellosis": ["systemic"], "bio-leptospirosis": ["kidneys", "liver"], "bio-plague": ["systemic"], "bio-tetanus": ["brain"], "bio-tuberculosis": ["lungs"], "bio-tularemia": ["systemic", "lungs"], "bio-cat-scratch-disease": ["blood"], "bio-hepatitis-a": ["liver"], "bio-hepatitis-b": ["liver", "blood"], "bio-orf": ["skin"], "bio-rabies": ["brain"], "bio-psittacosis": ["lungs"], "bio-rocky-mountain-spotted-fever": ["systemic", "skin"], "bio-q-fever": ["systemic", "lungs", "liver", "heart"], "bio-aspergillosis": ["lungs"], "bio-candidiasis": ["skin"], "bio-coccidioidomycosis": ["lungs"], "bio-histoplasmosis": ["lungs"],
  "tox-asbestos": ["lungs"], "tox-benzene": ["blood"], "tox-cotton-dust": ["lungs"], "tox-arsenic": ["skin", "brain", "liver"], "tox-beryllium": ["lungs"], "tox-cadmium": ["kidneys", "lungs"], "tox-hexavalent-chromium": ["skin", "lungs"], "tox-coal-dust": ["lungs"], "tox-cobalt": ["lungs", "skin"], "tox-formaldehyde": ["lungs", "skin"], "tox-lead": ["brain", "kidneys", "blood"], "tox-mercury": ["brain"], "tox-manganese": ["brain"], "tox-silica": ["lungs"], "tox-zinc-fumes": ["lungs"], "tox-aluminum-dust": ["lungs"], "tox-antimony": ["lungs", "heart", "digestive"], "tox-organophosphate-carbamate-pesticides": ["brain", "lungs", "digestive"],
};

export function getHazardBodySystems(hazardId: string): readonly BodySystemId[] {
  return HAZARD_BODY_SYSTEMS[hazardId] ?? ["systemic"];
}
