import { ArrowDownToLine, Droplets, Syringe, Wind } from "lucide-react";
import { EXPOSURE_ROUTES, type ExposureRouteId } from "../bodySystems";
import type { OccupationalHealthRecord } from "../hazardData";
import type { ExplorerLanguage } from "../hazardExplorer";
import { Bilingual } from "./Bilingual";

const ROUTE_ICONS = { inhalation: Wind, ingestion: ArrowDownToLine, "dermal-absorption": Droplets, percutaneous: Syringe };
export function RouteLabel({ route, language }: { route: ExposureRouteId; language: ExplorerLanguage }) {
  const Icon = ROUTE_ICONS[route];
  return <><Icon size={18} aria-hidden="true" /><Bilingual text={EXPOSURE_ROUTES[route]} language={language} /></>;
}

export function ExposureRouteView({ record, language }: { record: OccupationalHealthRecord; language: ExplorerLanguage }) {
  return <div className="exposure-route-view">
    <h4><Bilingual text={{ en: "Supported entry pathways", ar: "مسارات الدخول المحددة" }} language={language} /></h4>
    <ol className="body-route-list">{record.exposureRoutes.map((route, index) => <li key={route}><span className="body-route-number">{index + 1}</span><RouteLabel route={route} language={language} /></li>)}</ol>
    {!record.exposureRoutes.length && <p className="body-source-note"><Bilingual text={{ en: "No definite entry pathway specified.", ar: "لم يُحدد مسار دخول واضح." }} language={language} /></p>}
    {record.mappingReview.filter((review) => review.field === "exposureRoutes").map((review) => <div className="body-review-note" key={review.field}><strong><Bilingual text={{ en: "Mapping needs review", ar: "الربط يحتاج إلى مراجعة" }} language={language} /></strong><Bilingual text={review.reason} language={language} /></div>)}
    <div className="body-original-route"><h4><Bilingual text={{ en: "Original exposure / transmission", ar: "التعرض / الانتقال كما ورد" }} language={language} /></h4><Bilingual text={record.exposureTransmission} language={language} /></div>
  </div>;
}
