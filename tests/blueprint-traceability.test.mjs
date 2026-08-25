import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ASP_COVERAGE_QUESTIONS,
  BLUEPRINT_COVERAGE_REPORT,
  CSP_COVERAGE_QUESTIONS,
  ITEM_BLUEPRINT_MAPPINGS,
  buildBlueprintCoverageReport,
} from "../app/blueprintCoverageCatalog.ts";
import {
  ASP11_REGISTRY,
  BLUEPRINT_OBJECTIVE_BY_ID,
  BLUEPRINT_REGISTRIES,
  CSP11_REGISTRY,
} from "../app/blueprintRegistry.ts";
import {
  createInitialItemMapping,
  reviewedObjectiveIds,
  validateItemMapping,
} from "../app/blueprintMapping.ts";

test("official registry objective IDs are unique, stable, and complete", () => {
  const objectives = BLUEPRINT_REGISTRIES.flatMap((registry) => registry.objectives);
  assert.equal(ASP11_REGISTRY.objectives.length, 115);
  assert.equal(CSP11_REGISTRY.objectives.length, 47);
  assert.equal(new Set(objectives.map((objective) => objective.id)).size, objectives.length);
  assert.equal(BLUEPRINT_OBJECTIVE_BY_ID.size, objectives.length);
  assert.ok(objectives.every((objective) => /^(?:ASP11-A\d|CSP11-D\d)\.\d{2}[a-z]?$/.test(objective.id)));
  assert.ok(objectives.every((objective) => objective.statement.trim().length > 0));
});

test("every objective has exact ownership by one domain and valid parentage", () => {
  for (const registry of BLUEPRINT_REGISTRIES) {
    assert.equal(registry.sourceVersion, "V.2024.04.24");
    assert.equal(
      registry.domains.reduce((sum, domain) => sum + domain.weight, 0).toFixed(2),
      "1.00",
    );
    const owned = registry.domains.flatMap((domain) => domain.objectiveIds);
    assert.equal(new Set(owned).size, registry.objectives.length);
    for (const objective of registry.objectives) {
      const owners = registry.domains.filter((domain) => domain.objectiveIds.includes(objective.id));
      assert.equal(owners.length, 1, `${objective.id} must have one domain owner`);
      assert.equal(owners[0].id, objective.domainId);
      assert.equal(objective.credential, registry.credential);
      assert.equal(objective.blueprintVersion, registry.blueprintVersion);
      if (objective.parentObjectiveId) {
        const parent = BLUEPRINT_OBJECTIVE_BY_ID.get(objective.parentObjectiveId);
        assert.ok(parent, `${objective.id} parent must exist`);
        assert.equal(parent.domainId, objective.domainId);
      }
    }
  }
});

test("mapping validator rejects invalid versions, domains, and missing mappings", () => {
  const suggested = ITEM_BLUEPRINT_MAPPINGS.find((mapping) => mapping.mappingStatus === "suggested");
  assert.ok(suggested);
  assert.deepEqual(validateItemMapping(suggested), []);

  assert.match(
    validateItemMapping({ ...suggested, blueprintVersion: "ASP12" })[0],
    /credential does not own blueprint version/,
  );

  assert.match(
    validateItemMapping({ ...suggested, credential: "CSP" })[0],
    /credential does not own blueprint version/,
  );
  assert.ok(
    validateItemMapping({ ...suggested, domainId: "A2" }).includes(
      "primary objective does not belong to the question domain",
    ),
  );
  assert.ok(
    validateItemMapping({ ...suggested, primaryObjectiveId: null }).includes(
      "suggested items require a primary objective",
    ),
  );
  assert.ok(
    validateItemMapping({ ...suggested, primaryObjectiveId: "ASP11-A1.99" }).some((error) =>
      error.startsWith("unknown objective ID"),
    ),
  );
});

test("automated suggestions never become reviewed coverage", () => {
  const suggested = ITEM_BLUEPRINT_MAPPINGS.find((mapping) => mapping.mappingStatus === "suggested");
  assert.ok(suggested);
  assert.deepEqual(reviewedObjectiveIds(suggested), []);

  const invalidAutomaticReview = {
    ...suggested,
    mappingStatus: "reviewed",
    sourceReviewStatus: "reviewed",
    technicalReviewStatus: "reviewed",
  };
  assert.ok(validateItemMapping(invalidAutomaticReview).includes("automated mappings must remain suggested"));
  assert.deepEqual(reviewedObjectiveIds(invalidAutomaticReview), []);

  const humanReview = {
    ...suggested,
    mappingStatus: "reviewed",
    sourceReviewStatus: "reviewed",
    technicalReviewStatus: "reviewed",
    mappingOrigin: "human",
  };
  assert.deepEqual(validateItemMapping(humanReview), []);
  assert.deepEqual(reviewedObjectiveIds(humanReview), [humanReview.primaryObjectiveId]);
  const report = buildBlueprintCoverageReport([humanReview]);
  assert.equal(report.inventory.reviewedItems, 1);
  assert.equal(report.objectives.find((objective) => objective.objectiveId === humanReview.primaryObjectiveId)?.reviewedItems, 1);
});

test("legacy questions remain valid and unmapped without new inline fields", () => {
  const legacyQuestion = CSP_COVERAGE_QUESTIONS[0];
  const snapshot = structuredClone(legacyQuestion);
  const mapping = createInitialItemMapping(legacyQuestion, "CSP");
  assert.equal(mapping.mappingStatus, "unmapped");
  assert.equal(mapping.primaryObjectiveId, null);
  assert.deepEqual(mapping.secondaryObjectiveIds, []);
  assert.equal(mapping.mappingOrigin, "none");
  assert.deepEqual(validateItemMapping(mapping), []);
  assert.deepEqual(legacyQuestion, snapshot);
});

test("coverage report separates suggested, reviewed, unmapped, and repeated families", () => {
  assert.deepEqual(BLUEPRINT_COVERAGE_REPORT.inventory, {
    totalItems: 2400,
    aspItems: 1200,
    cspItems: 1200,
    reviewedItems: 0,
    suggestedItems: 100,
    rejectedItems: 0,
    unmappedItems: 2300,
  });
  assert.equal(BLUEPRINT_COVERAGE_REPORT.unmapped.length, 2300);
  assert.equal(BLUEPRINT_COVERAGE_REPORT.itemMappings.length, 2400);
  assert.equal(
    new Set(
      BLUEPRINT_COVERAGE_REPORT.itemMappings.map(
        (mapping) => `${mapping.credential}:${mapping.questionId}`,
      ),
    ).size,
    2400,
  );
  assert.deepEqual(
    Object.keys(BLUEPRINT_COVERAGE_REPORT.itemMappings[0]).sort(),
    [
      "blueprintVersion",
      "credential",
      "domainId",
      "itemFamilyId",
      "mappingOrigin",
      "mappingStatus",
      "primaryObjectiveId",
      "questionId",
      "secondaryObjectiveIds",
      "sourceReviewStatus",
      "technicalReviewStatus",
    ].sort(),
  );
  assert.equal(BLUEPRINT_COVERAGE_REPORT.objectivesWithNoReviewedItems.length, 162);
  assert.equal(BLUEPRINT_COVERAGE_REPORT.repeatedItemFamilies.length, 199);
  assert.deepEqual(BLUEPRINT_COVERAGE_REPORT.invalidMappings, []);
  assert.ok(BLUEPRINT_COVERAGE_REPORT.objectives.every((objective) => objective.reviewedItems === 0));
});

function contentFingerprint(items) {
  const stableContent = items.map((question) => ({
    id: question.id,
    domainId: question.domainId,
    competency: question.competency,
    objective: question.objective ?? null,
    difficulty: question.difficulty,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    rationale: question.rationale,
    wrongRationales: question.wrongRationales,
    referenceFramework: question.referenceFramework,
    referenceTopic: question.referenceTopic,
    challengePrompt: question.challengePrompt,
    pool: question.pool ?? null,
    scenarioFamily: question.scenarioFamily ?? null,
  }));
  return createHash("sha256").update(JSON.stringify(stableContent)).digest("hex");
}

test("question text, answer keys, rationales, sources, and family metadata are unchanged", () => {
  assert.equal(ASP_COVERAGE_QUESTIONS.length, 1200);
  assert.equal(CSP_COVERAGE_QUESTIONS.length, 1200);
  assert.equal(
    contentFingerprint(ASP_COVERAGE_QUESTIONS),
    "521a75bb745958c557453f0858724a1058ffa7b185c9a66bc0dae06782aa33f4",
  );
  assert.equal(
    contentFingerprint(CSP_COVERAGE_QUESTIONS),
    "09b3a018580fb1891a9eb0646ec40bd631f89d4103ef58ece4c7a02c5abc0177",
  );
});

test("coverage page is explicitly development-only", async () => {
  const source = await readFile("app/internal/blueprint-coverage/page.tsx", "utf8");
  assert.match(source, /process\.env\.NODE_ENV === "production"/);
  assert.match(source, /Only human-reviewed mappings/);
  assert.match(source, /Suggested item mappings/);
});

test("checked-in machine report matches the current registry and mapping overlay", async () => {
  const committedReport = JSON.parse(
    await readFile("reports/blueprint-coverage.json", "utf8"),
  );
  assert.deepEqual(committedReport, BLUEPRINT_COVERAGE_REPORT);
});
