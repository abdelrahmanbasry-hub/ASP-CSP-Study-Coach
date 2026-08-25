import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { EXTENDED_BLUEPRINT_COVERAGE_REPORT } from "../app/itemReviewReport.ts";

const outputDirectory = resolve("reports");
const outputPath = resolve(outputDirectory, "blueprint-coverage.json");
await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(EXTENDED_BLUEPRINT_COVERAGE_REPORT, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
