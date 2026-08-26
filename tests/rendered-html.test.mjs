import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the dual-track adaptive coach", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /ASP \+ CSP \/\/ Coach/i);
  assert.match(html, /Practice Readiness Indicator/i);
  assert.match(html, /Calibrating your coach/i);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("ships both current blueprint banks and removes starter preview code", async () => {
  const [coach, engine, csp, cspExtra, cspExpanded, aspA, aspB, aspA2, aspSet1, aspSet2, aspExpanded, packageJson] = await Promise.all([
    readFile(new URL("app/AdaptiveCoach.tsx", root), "utf8"),
    readFile(new URL("app/adaptiveEngine.ts", root), "utf8"),
    readFile(new URL("app/questionBank.ts", root), "utf8"),
    readFile(new URL("app/cspQuestionBankExtra.ts", root), "utf8"),
    readFile(new URL("app/cspExpandedQuestionBank.ts", root), "utf8"),
    readFile(new URL("app/aspQuestionBankA.ts", root), "utf8"),
    readFile(new URL("app/aspQuestionBankB.ts", root), "utf8"),
    readFile(new URL("app/aspQuestionBankExtraA2.ts", root), "utf8"),
    readFile(new URL("app/aspQuestionBankExtraSet1.ts", root), "utf8"),
    readFile(new URL("app/aspQuestionBankExtraSet2.ts", root), "utf8"),
    readFile(new URL("app/aspExpandedQuestionBank.ts", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);
  assert.match(coach, /activeExam/);
  assert.match(coach, /ASP_QUESTION_BANK_A/);
  assert.match(coach, /ASP_QUESTION_BANK_B/);
  assert.match(coach, /ASP_QUESTION_BANK_EXTRA_A2/);
  assert.match(coach, /ASP_QUESTION_BANK_EXTRA_SET1/);
  assert.match(coach, /ASP_QUESTION_BANK_EXTRA_SET2/);
  assert.match(coach, /CSP_QUESTION_BANK_EXTRA/);
  assert.match(coach, /ASP_PRACTICE_EXTRA/);
  assert.match(coach, /CSP_PRACTICE_EXTRA/);
  assert.match(coach, /mockForms/);
  assert.match(coach, /1,200-item credential bank/);
  assert.match(coach, /800 practice seen/);
  assert.doesNotMatch(coach, /10,000-item|\/ 10,000 seen/);
  assert.match(coach, /BCSP ASP/);
  assert.match(coach, /BCSP CSP/);
  assert.match(coach, /Start adaptive session/);
  assert.match(engine, /Insufficient evidence/);
  assert.match(engine, /This is a coaching estimate based on your practice activity/);
  assert.match(engine, /not a prediction of your BCSP examination result/);
  assert.match(engine, /Provisional authoring level/);
  assert.doesNotMatch(coach, /IRT logic|IRT adjusts|exam level reached|exam-level items were active/);
  assert.match(coach, /Created by <strong>Abdelrahman Basry<\/strong>/);
  assert.match(coach, /https:\/\/ipn\.eg\/S\/abdelrahmanbasryyyy\/instapay\/3mEaA3/);
  assert.match(coach, /mode === "exam" \? startSession\("exam"\)/);
  assert.match(csp, /weight: 0\.25/);
  assert.equal(new Set(`${csp}\n${cspExtra}`.match(/\bD[1-7]-\d{3}\b/g) ?? []).size, 200);
  assert.match(aspA, /Mathematical Calculations/);
  assert.match(aspB, /A9-010/);
  assert.equal(new Set(`${aspA}\n${aspB}\n${aspA2}\n${aspSet1}\n${aspSet2}`.match(/\bA[1-9]-\d{3}\b/g) ?? []).size, 200);
  assert.match(cspExpanded, /CSP_PRACTICE_EXTRA/);
  assert.match(cspExpanded, /CSP_MOCK_A/);
  assert.match(cspExpanded, /CSP_MOCK_B/);
  assert.match(aspExpanded, /ASP_PRACTICE_EXTRA/);
  assert.match(aspExpanded, /ASP_MOCK_A/);
  assert.match(aspExpanded, /ASP_MOCK_B/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
