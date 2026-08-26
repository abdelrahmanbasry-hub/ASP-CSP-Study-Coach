#!/usr/bin/env node
import { importPracticeV2Pack } from "./practice-v2-import-lib.mjs";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: pnpm practice:v2:import <question-file.json>");
  process.exitCode = 1;
} else {
  try {
    const report = await importPracticeV2Pack(inputPath);
    console.log(JSON.stringify(report, null, 2));
    if (report.status !== "imported") process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
