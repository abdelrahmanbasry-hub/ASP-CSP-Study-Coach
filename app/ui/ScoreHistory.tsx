type ScoreRecord = { id: string; value: number; count: number; date: string };
/** The picture and accessible table share one fixed 0–100 percentage scale. */
export function ScoreHistory({ records }: { records: ScoreRecord[] }) {
  return <>
    <div className="score-chart" aria-hidden="true">
      <div className="score-chart-scale"><span>100%</span><span>50%</span><span>0%</span></div>
      <div className="score-chart-plot">
        <div className="score-threshold"><span>80% reference</span></div>
        {records.map(score => <div className="score-bar-track" key={score.id}><i style={{ height: `${score.value}%` }} /><span>{score.value}%</span></div>)}
      </div>
    </div>
    <table className="score-data-table">
      <caption>Recent blocks · percentage of correct answers</caption>
      <thead><tr><th scope="col">Date</th><th scope="col">Questions</th><th scope="col">Accuracy</th></tr></thead>
      <tbody>{records.map(score => <tr key={score.id}><td>{score.date}</td><td>{score.count}</td><td>{score.value}%</td></tr>)}</tbody>
    </table>
  </>;
}

