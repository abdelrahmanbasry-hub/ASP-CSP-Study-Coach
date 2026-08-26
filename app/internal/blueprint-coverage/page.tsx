import { BLUEPRINT_COVERAGE_REPORT } from "../../blueprintCoverageCatalog";
import { BLUEPRINT_REGISTRIES } from "../../blueprintRegistry";

export const dynamic = "force-dynamic";

export default function BlueprintCoveragePage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <main className="coverage-unavailable">
        <h1>Development report unavailable</h1>
        <p>This internal blueprint coverage page is disabled in production.</p>
      </main>
    );
  }

  const report = BLUEPRINT_COVERAGE_REPORT;
  return (
    <main className="coverage-page">
      <header>
        <p className="eyebrow">Internal · development only</p>
        <h1>Blueprint content traceability</h1>
        <p>
          Suggested mappings are review candidates only. Only human-reviewed mappings with completed
          source and technical reviews count as proven objective coverage.
        </p>
      </header>

      <section className="coverage-summary" aria-label="Coverage summary">
        <article><strong>{report.inventory.totalItems}</strong><span>Total items</span></article>
        <article><strong>{report.inventory.reviewedItems}</strong><span>Reviewed</span></article>
        <article><strong>{report.inventory.suggestedItems}</strong><span>Suggested</span></article>
        <article><strong>{report.inventory.unmappedItems}</strong><span>Unmapped</span></article>
        <article><strong>{report.objectivesWithNoReviewedItems.length}</strong><span>No reviewed coverage</span></article>
        <article><strong>{report.repeatedItemFamilies.length}</strong><span>Repeated families</span></article>
      </section>

      <section className="coverage-registry">
        <div className="coverage-registry-heading">
          <div>
            <p className="eyebrow">Question-level traceability</p>
            <h2>Suggested item mappings</h2>
          </div>
          <span>{report.inventory.suggestedItems} require human review</span>
        </div>
        <div className="coverage-table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Credential</th><th>Primary objective</th><th>Status</th><th>Source review</th><th>Technical review</th><th>Item family</th></tr></thead>
            <tbody>
              {report.itemMappings
                .filter((mapping) => mapping.mappingStatus !== "unmapped")
                .map((mapping) => (
                  <tr key={`${mapping.credential}:${mapping.questionId}`}>
                    <td><code>{mapping.questionId}</code></td>
                    <td>{mapping.credential}</td>
                    <td><code>{mapping.primaryObjectiveId}</code></td>
                    <td>{mapping.mappingStatus}</td>
                    <td>{mapping.sourceReviewStatus}</td>
                    <td>{mapping.technicalReviewStatus}</td>
                    <td><code>{mapping.itemFamilyId ?? "—"}</code></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {BLUEPRINT_REGISTRIES.map((registry) => (
        <section className="coverage-registry" key={registry.blueprintVersion}>
          <div className="coverage-registry-heading">
            <div>
              <p className="eyebrow">{registry.sourceVersion}</p>
              <h2>{registry.blueprintVersion} objective coverage</h2>
            </div>
            <a href={registry.sourceUrl} target="_blank" rel="noreferrer">Official source</a>
          </div>
          <div className="coverage-table-wrap">
            <table>
              <thead><tr><th>Objective</th><th>Official statement</th><th>Total</th><th>Reviewed</th><th>Suggested</th></tr></thead>
              <tbody>
                {report.objectives
                  .filter((objective) => objective.objectiveId.startsWith(registry.blueprintVersion))
                  .map((objective) => (
                    <tr key={objective.objectiveId} className={objective.reviewedItems ? "" : "coverage-gap"}>
                      <td><code>{objective.objectiveId}</code></td>
                      <td>{objective.statement}</td>
                      <td>{objective.totalItems}</td>
                      <td>{objective.reviewedItems}</td>
                      <td>{objective.suggestedItems}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}
