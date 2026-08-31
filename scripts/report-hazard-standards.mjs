import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PHASE4_HAZARD_RECORDS } from "../app/phase4HazardData.ts";
import { buildMissingStandardsReport } from "../app/hazardStandardReferences.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, process.argv[2] ?? "reports/phase4.1/missing-standards.json");
const report = buildMissingStandardsReport(PHASE4_HAZARD_RECORDS);
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ output, ...report.summary }));
