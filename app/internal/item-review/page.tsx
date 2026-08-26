import ItemReviewWorkbench from "../../ItemReviewWorkbench";

export const dynamic = "force-dynamic";

export default function ItemReviewPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <main className="coverage-unavailable">
        <h1>Development review unavailable</h1>
        <p>The internal item-review workflow is disabled in production.</p>
      </main>
    );
  }
  return <ItemReviewWorkbench />;
}
