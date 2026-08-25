import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { validatePracticeV2Pack } from "../app/practiceV2.ts";

function safePackName(packId) {
  return packId.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

async function jsonFiles(directory) {
  try {
    return (await readdir(directory)).filter((name) => name.endsWith(".json"));
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }
}

async function existingQuestions(directory) {
  const questions = [];
  for (const name of await jsonFiles(directory)) {
    const parsed = JSON.parse(await readFile(path.join(directory, name), "utf8"));
    for (const question of parsed.questions ?? []) if (typeof question?.id === "string") questions.push(question);
  }
  return questions;
}

function normalizedTerms(value) {
  return new Set(String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean));
}

function stemSimilarity(left, right) {
  const a = normalizedTerms(left);
  const b = normalizedTerms(right);
  if (a.size < 6 || b.size < 6) return 0;
  let intersection = 0;
  for (const term of a) if (b.has(term)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

async function writeReport(reportPath, report) {
  await mkdir(path.dirname(reportPath), { recursive: true });
  const temporary = `${reportPath}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await rename(temporary, reportPath);
}

export async function importPracticeV2Pack(inputPath, options = {}) {
  const rootDirectory = options.rootDirectory ?? process.cwd();
  const importedDirectory = options.importedDirectory ?? path.join(rootDirectory, "practice-v2", "imported");
  const reportPath = options.reportPath ?? path.join(rootDirectory, "reports", "practice-v2-import-report.json");
  const absoluteInput = path.resolve(rootDirectory, inputPath);
  const importedAt = new Date().toISOString();
  let raw;
  let parsed;
  let parseError = null;
  try {
    raw = await readFile(absoluteInput, "utf8");
    parsed = JSON.parse(raw);
  } catch (error) {
    parseError = error instanceof Error ? error.message : String(error);
  }

  const issues = parseError
    ? [{ path: "$", code: "invalid-json", message: parseError }]
    : validatePracticeV2Pack(parsed);
  const questions = Array.isArray(parsed?.questions) ? parsed.questions : [];
  const duplicates = new Set(issues.filter((issue) => issue.code === "duplicate-id").map((issue) => issue.questionId).filter(Boolean));
  const similarItems = [];
  if (!parseError) {
    const existing = await existingQuestions(importedDirectory);
    const existingIds = new Set(existing.map((question) => question.id));
    for (const question of questions) {
      if (typeof question?.id === "string" && existingIds.has(question.id)) {
        duplicates.add(question.id);
        issues.push({ path: "questions", code: "existing-duplicate-id", message: `Question ID already exists in an imported pack: ${question.id}.`, questionId: question.id });
      }
    }
    const candidates = [...existing.map((question) => ({ question, existing: true })), ...questions.map((question) => ({ question, existing: false }))];
    for (let rightIndex = 0; rightIndex < candidates.length; rightIndex += 1) {
      const right = candidates[rightIndex];
      if (right.existing || typeof right.question?.id !== "string") continue;
      for (let leftIndex = 0; leftIndex < rightIndex; leftIndex += 1) {
        const left = candidates[leftIndex];
        if (left.question?.id === right.question.id) continue;
        const similarity = stemSimilarity(left.question?.stem, right.question?.stem);
        if (similarity < 0.9) continue;
        const match = { questionId: right.question.id, similarToQuestionId: left.question.id, similarity: Number(similarity.toFixed(3)) };
        similarItems.push(match);
        issues.push({ path: "questions", code: "similar-question", message: `Question ${right.question.id} is too similar to ${left.question.id} (${match.similarity}).`, questionId: right.question.id });
      }
    }
  }

  const packName = typeof parsed?.packId === "string" ? safePackName(parsed.packId) : "";
  if (!parseError && packName) {
    const target = path.join(importedDirectory, `${packName}.json`);
    if ((await jsonFiles(importedDirectory)).includes(`${packName}.json`)) {
      issues.push({ path: "packId", code: "duplicate-pack-id", message: `An imported pack already uses packId ${parsed.packId}.` });
    }
    if (!issues.length) {
      await mkdir(importedDirectory, { recursive: true });
      const temporary = `${target}.${process.pid}.tmp`;
      try {
        await writeFile(temporary, raw, "utf8");
        await rename(temporary, target);
      } catch (error) {
        await unlink(temporary).catch(() => undefined);
        throw error;
      }
      const report = {
        schemaVersion: 1,
        importedAt,
        sourceFile: absoluteInput,
        destinationFile: target,
        status: "imported",
        imported: questions.map((question) => question.id),
        rejected: [],
        duplicates: [],
        similarItems: [],
        verification: Object.fromEntries(["unverified", "source-checked", "human-reviewed"].map((status) => [status, questions.filter((question) => question.verificationStatus === status).length])),
        errors: [],
      };
      await writeReport(reportPath, report);
      return report;
    }
  }

  const report = {
    schemaVersion: 1,
    importedAt,
    sourceFile: absoluteInput,
    destinationFile: null,
    status: "rejected",
    imported: [],
    rejected: questions.map((question, index) => typeof question?.id === "string" ? question.id : `questions[${index}]`),
    duplicates: [...duplicates],
    similarItems,
    verification: Object.fromEntries(["unverified", "source-checked", "human-reviewed"].map((status) => [status, questions.filter((question) => question?.verificationStatus === status).length])),
    errors: issues,
  };
  await writeReport(reportPath, report);
  return report;
}
