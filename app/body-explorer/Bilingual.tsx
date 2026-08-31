import type { BilingualText } from "../hazardData";
import type { ExplorerLanguage } from "../hazardExplorer";

export function bilingualLabel(text: BilingualText, language: ExplorerLanguage) {
  return language === "both" ? `${text.en} / ${text.ar}` : text[language];
}

export function Bilingual({ text, language, className = "" }: { text: BilingualText; language: ExplorerLanguage; className?: string }) {
  return <span className={`body-bilingual ${className}`}>
    {language !== "ar" && <span lang="en">{text.en}</span>}
    {language !== "en" && <span lang="ar" dir="rtl">{text.ar}</span>}
  </span>;
}

export const ROLE_TEXT = {
  primary: { en: "Primary target", ar: "هدف رئيسي" },
  secondary: { en: "Secondary target", ar: "هدف ثانوي" },
  inactive: { en: "Not listed in this record", ar: "غير مذكور في هذا السجل" },
};
