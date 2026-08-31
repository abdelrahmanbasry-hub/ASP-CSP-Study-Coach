import { existsSync, readFileSync, readdirSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Compile real project components in Node's existing test runner. CSS is checked
// separately and layout is verified in a real browser, not simulated by the DOM.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      const url = new URL(specifier, context.parentURL);
      if (!/\.[a-z]+$/i.test(url.pathname)) {
        for (const extension of [".ts", ".tsx"]) {
          const candidate = new URL(`${url.href}${extension}`);
          if (existsSync(candidate)) return { url: candidate.href, shortCircuit: true };
        }
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".css")) return { format: "module", source: "export default {};", shortCircuit: true };
    if (url.endsWith(".json") && url.startsWith("file:")) return { format: "module", source: `export default ${readFileSync(fileURLToPath(url), "utf8")};`, shortCircuit: true };
    if (url.startsWith("file:") && /\.tsx?$/.test(url) && !url.includes("node_modules")) {
      // Match Vite's eager JSON catalog loading using the actual local fixtures.
      const input = readFileSync(fileURLToPath(url), "utf8").replace(/import\.meta\.glob\("([^"]+\/)(\*\.json)",\s*\{ eager: true, import: "default" \}\)/g, (_match, directory) => {
        const entries = readdirSync(new URL(directory, url)).filter((name) => name.endsWith(".json"));
        return JSON.stringify(Object.fromEntries(entries.map((name) => [`${directory}${name}`, JSON.parse(readFileSync(new URL(`${directory}${name}`, url), "utf8"))])));
      });
      const source = ts.transpileModule(input, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText;
      return { format: "module", source, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
