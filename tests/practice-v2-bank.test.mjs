import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  emptyPracticeV2Progress,
  filterPracticeV2Questions,
  isPracticeV2ProductionEligible,
  selectPracticeV2Questions,
  validatePracticeV2Pack,
} from "../app/practiceV2.ts";
import { importPracticeV2Pack } from "../scripts/practice-v2-import-lib.mjs";

const importedDirectory = new URL("../practice-v2/imported/", import.meta.url);
const chapters = Array.from({ length: 40 }, (_, index) => `ch-${String(index + 2).padStart(2, "0")}`);
const expectedFiles = chapters.map((chapter) => `practice-v2-${chapter}-core-v1.json`);

async function readBank() {
  return Promise.all(expectedFiles.map(async (name) => {
    const bytes = await readFile(new URL(name, importedDirectory));
    return { name, bytes, pack: JSON.parse(bytes) };
  }));
}

test("the core bank replaces the old bank with exactly 40 schema v3 packs and 1,440 eligible questions", async () => {
  const files = (await readdir(importedDirectory)).filter((name) => name.endsWith(".json")).sort();
  assert.deepEqual(files, expectedFiles, "Do not load the old 440-question bank alongside the core bank");
  const bank = await readBank();
  const questions = bank.flatMap(({ pack }) => pack.questions);
  assert.equal(questions.length, 1440);
  assert.equal(new Set(questions.map((question) => question.id)).size, 1440);
  assert.equal(new Set(questions.map((question) => question.contentFingerprint)).size, 1440);
  for (const [index, { name, pack }] of bank.entries()) {
    assert.equal(pack.schemaVersion, 3, name);
    assert.equal(pack.packId, name.replace(/\.json$/, ""));
    assert.equal(pack.packStatus, "content", name);
    assert.equal(pack.chapterId, chapters[index], name);
    assert.deepEqual(validatePracticeV2Pack(pack), [], name);
    assert.ok(pack.questions.length >= 25 && pack.questions.length <= 40, name);
    for (const question of pack.questions) {
      assert.match(question.id, new RegExp(`^PV2-CORE-CH${chapters[index].slice(3)}-\\d{3}$`));
      assert.equal(question.chapterId, pack.chapterId);
      assert.equal(question.chapterTitle, pack.chapterTitle);
      assert.equal(question.verificationStatus, "source-checked", question.id);
      assert.equal(question.authoringOrigin, "ai-assisted", question.id);
      assert.equal(isPracticeV2ProductionEligible(question), true, question.id);
    }
  }
});

test("the integration report records every core pack and its unchanged supplied SHA-256", async () => {
  const report = JSON.parse(await readFile(new URL("../reports/practice-v2-import-report.json", import.meta.url), "utf8"));
  assert.equal(report.sourcePackage, "ASP-CSP-Practice-V2-Core-v1-CORRECTED.zip");
  assert.equal(report.practiceSchemaVersion, 3);
  assert.equal(report.status, "imported");
  assert.equal(report.packCount, 40);
  assert.equal(report.questionCount, 1440);
  assert.equal(report.duplicateCount, 0);
  assert.equal(report.similarItemCount, 0);
  assert.equal(report.validationErrorCount, 0);
  assert.equal(report.suppliedByteHashes, "PASS");
  assert.deepEqual(report.packs.map((pack) => pack.destinationFile), expectedFiles.map((name) => `practice-v2/imported/${name}`));
  for (const [index, { bytes, pack }] of (await readBank()).entries()) {
    const entry = report.packs[index];
    assert.equal(entry.packId, pack.packId);
    assert.equal(entry.chapterId, pack.chapterId);
    assert.equal(entry.questionCount, pack.questions.length);
    assert.equal(entry.status, "imported");
    assert.equal(entry.sha256, createHash("sha256").update(bytes).digest("hex"), pack.packId);
    assert.deepEqual(entry.duplicates, []);
    assert.deepEqual(entry.similarItems, []);
    assert.deepEqual(entry.validationErrors, []);
  }
});

test("every core chapter supports 25-question chapter-first sessions without repeating families", async () => {
  const questions = (await readBank()).flatMap(({ pack }) => pack.questions);
  for (const chapterId of chapters) {
    const selected = selectPracticeV2Questions({
      questions,
      chapterIds: [chapterId],
      count: 25,
      progress: emptyPracticeV2Progress(),
      seed: "core-bank-regression",
    });
    assert.equal(selected.length, 25, chapterId);
    assert.equal(new Set(selected.map((question) => question.itemFamilyId)).size, 25, chapterId);
    assert.ok(selected.every((question) => question.chapterId === chapterId), chapterId);
  }
  const selectedChapters = ["ch-02", "ch-41"];
  const filtered = filterPracticeV2Questions(questions, selectedChapters);
  assert.equal(filtered.length, 65);
  assert.equal(new Set(filtered.map((question) => question.id)).size, 65);
  assert.ok(filtered.every((question) => selectedChapters.includes(question.chapterId)));
});

test("all supplied core packs pass the real importer together, preserve bytes, and reject reimport", async (t) => {
  const rootDirectory = await mkdtemp(path.join(os.tmpdir(), "practice-v2-core-bank-test-"));
  t.after(() => rm(rootDirectory, { recursive: true, force: true }));
  for (const { name, bytes, pack } of await readBank()) {
    const report = await importPracticeV2Pack(fileURLToPath(new URL(name, importedDirectory)), { rootDirectory });
    assert.equal(report.status, "imported", `${name}: ${JSON.stringify(report.errors)}`);
    assert.deepEqual(report.imported, pack.questions.map((question) => question.id));
    assert.deepEqual(report.duplicates, []);
    assert.deepEqual(report.similarItems, []);
    assert.deepEqual(report.errors, []);
    assert.deepEqual(await readFile(report.destinationFile), bytes, name);
  }
  const destinationDirectory = path.join(rootDirectory, "practice-v2", "imported");
  assert.deepEqual((await readdir(destinationDirectory)).sort(), expectedFiles);
  const duplicate = await importPracticeV2Pack(fileURLToPath(new URL(expectedFiles[0], importedDirectory)), { rootDirectory });
  assert.equal(duplicate.status, "rejected");
  assert.equal(duplicate.duplicates.length, 35);
  assert.ok(duplicate.errors.some((issue) => issue.code === "existing-duplicate-id"));
  assert.ok(duplicate.errors.some((issue) => issue.code === "duplicate-pack-id"));
  assert.deepEqual((await readdir(destinationDirectory)).sort(), expectedFiles);
});
