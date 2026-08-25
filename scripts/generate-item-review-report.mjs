import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { ITEM_REVIEW_REPORT } from "../app/itemReviewReport.ts";

const outputDirectory = resolve("reports");
const outputPath = resolve(outputDirectory, "item-review-report.json");
await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(ITEM_REVIEW_REPORT, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
