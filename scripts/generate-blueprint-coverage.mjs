import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { buildBlueprintCoverageReport } from "../app/blueprintCoverageCatalog.ts";

const outputDirectory = resolve("reports");
const outputPath = resolve(outputDirectory, "blueprint-coverage.json");
await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(buildBlueprintCoverageReport(), null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
