import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const calculatorSource = await readFile(new URL("../app/ScientificCalculator.tsx", import.meta.url), "utf8");
// Render the real TSX component without introducing a test-only bundler or DOM dependency.
const compiled = ts.transpileModule(calculatorSource, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText.replace(/from "(react|react\/jsx-runtime|lucide-react)"/g, (_, name) => `from ${JSON.stringify(import.meta.resolve(name))}`);
const { default: ScientificCalculator, SCIENTIFIC_CALCULATOR_URL } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const renderCalculator = (hidden = false) => renderToStaticMarkup(createElement(ScientificCalculator, {
  id: "study-calculator",
  hidden,
  onClose() {},
}));

test("the calculator renders the exact requested external calculator, not a replacement keypad", () => {
  assert.equal(SCIENTIFIC_CALCULATOR_URL, "https://ti84calc.com/ti30calc");
  const html = renderCalculator();
  assert.match(html, /<iframe[^>]+src="https:\/\/ti84calc\.com\/ti30calc"/);
  assert.match(html, /title="TI-30XS scientific calculator from ti84calc\.com"/);
  assert.doesNotMatch(html, /calculator-keys|calculator-display|<input/);
});

test("the external calculator is isolated from learner data and top-level navigation", () => {
  const html = renderCalculator();
  assert.match(html, /sandbox="allow-scripts allow-same-origin allow-popups"/);
  assert.match(html, /referrerPolicy="no-referrer"/i);
  assert.doesNotMatch(html, /allow-top-navigation|srcDoc=/i);
  assert.doesNotMatch(calculatorSource, /localStorage|sessionStorage|postMessage|formulaQuery|progress/);
});

test("the calculator provides accessible close, reload, and external fallback controls", () => {
  const html = renderCalculator();
  assert.match(html, /aria-label="Close calculator"/);
  assert.match(html, /aria-labelledby="study-calculator-title"/);
  assert.match(html, /aria-describedby="study-calculator-help"/);
  assert.match(html, /href="https:\/\/ti84calc\.com\/ti30calc" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /Reload calculator/);
  assert.match(html, /Requires internet/);
  assert.match(html, /may show ads/);
  assert.match(calculatorSource, /key=\{reloadCount\}/);
  assert.match(calculatorSource, /setReloadCount\(\(count\) => count \+ 1\)/);
});

test("a closed calculator stays mounted but hidden so reopening can preserve work", () => {
  assert.match(renderCalculator(true), /<aside[^>]*hidden=""/);
  assert.match(renderCalculator(true), /<iframe/);
  assert.doesNotMatch(renderCalculator(false), /<aside[^>]*hidden=/);
});

test("shared question tools load the calculator on demand and preserve the formula sheet", async () => {
  const tools = await readFile(new URL("../app/StudySystem.tsx", import.meta.url), "utf8");
  assert.match(tools, /\[hasOpenedCalculator, setHasOpenedCalculator\] = useState\(false\)/);
  assert.match(tools, /hasOpenedCalculator && <ScientificCalculator/);
  assert.match(tools, /hidden=\{open !== "calculator"\}/);
  assert.match(tools, /calculatorButton\.current\?\.focus\(\)/);
  assert.match(tools, /formulaButton\.current\?\.focus\(\)/);
  assert.match(tools, /aria-expanded=\{open === "calculator"\}/);
  assert.match(tools, /open === "formulas" && <aside/);
  assert.match(tools, /ranked\.slice\(0, 8\)/);
  assert.doesNotMatch(tools, /evaluateExpression|calculator-keys|calculator-display/);
  for (const file of ["PracticeV2View.tsx", "HomeworkHub.tsx", "AdaptiveCoach.tsx"]) {
    const consumer = await readFile(new URL(`../app/${file}`, import.meta.url), "utf8");
    assert.match(consumer, /<QuestionTools\b/, file);
  }
});

test("Practice, Homework, and exam tools are siblings of the question card, not below its answers", async () => {
  for (const file of ["PracticeV2View.tsx", "HomeworkHub.tsx", "AdaptiveCoach.tsx"]) {
    const source = await readFile(new URL(`../app/${file}`, import.meta.url), "utf8");
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const workspaces = [];
    function visit(node) {
      if (ts.isJsxElement(node) && node.openingElement.attributes.properties.some((attribute) =>
        ts.isJsxAttribute(attribute) && attribute.name.getText(ast) === "className"
        && attribute.initializer && ts.isStringLiteral(attribute.initializer)
        && attribute.initializer.text.split(/\s+/).includes("question-workspace"))) {
        workspaces.push(node);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
    assert.equal(workspaces.length, 1, file);
    const children = workspaces[0].children;
    assert.equal(children.filter((child) => ts.isJsxSelfClosingElement(child) && child.tagName.getText(ast) === "QuestionTools").length, 1, file);
    assert.ok(children.some((child) => ts.isJsxElement(child) && child.openingElement.tagName.getText(ast) === "section"), file);
  }
});

test("question tools use a sticky desktop side rail and a viewport-bounded narrow-screen panel", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.question-workspace\s*\{[^}]*grid-template-areas:\s*"question tools"/);
  assert.match(css, /\.question-workspace > \.question-tools\s*\{[^}]*position:\s*sticky/);
  assert.match(css, /\.question-workspace \.question-tool-drawer\s*\{[^}]*max-height:\s*calc\(100dvh/);
  const mobile = css.slice(css.indexOf("@media (max-width: 979px)"));
  assert.match(mobile, /grid-template-areas:\s*"tools" "question"/);
  assert.match(mobile, /\.question-workspace \.question-tool-drawer\s*\{[^}]*position:\s*fixed[^}]*right:\s*12px/);
  assert.match(mobile, /width:\s*min\(400px, calc\(100vw - 24px\)\)/);
});
