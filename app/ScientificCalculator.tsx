"use client";

import { useState } from "react";
import { ExternalLink, RotateCcw, X } from "lucide-react";

export const SCIENTIFIC_CALCULATOR_URL = "https://ti84calc.com/ti30calc";

export default function ScientificCalculator({ id, hidden, onClose }: {
  id: string;
  hidden: boolean;
  onClose: () => void;
}) {
  const [reloadCount, setReloadCount] = useState(0);

  return (
    <aside id={id} className="question-tool-drawer scientific-calculator" hidden={hidden} aria-labelledby={`${id}-title`}>
      <header className="scientific-calculator-header">
        <div>
          <strong id={`${id}-title`}>TI-30XS Calculator</strong>
          <p>The calculator from ti84calc.com</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close calculator"><X aria-hidden="true" /></button>
      </header>
      <div className="scientific-calculator-actions">
        <a href={SCIENTIFIC_CALCULATOR_URL} target="_blank" rel="noopener noreferrer">
          Open in new tab <ExternalLink size={15} aria-hidden="true" />
        </a>
        <button type="button" onClick={() => setReloadCount((count) => count + 1)}>
          <RotateCcw size={15} aria-hidden="true" /> Reload calculator
        </button>
      </div>
      <p className="scientific-calculator-note" id={`${id}-help`}>
        Requires internet. This external page may show ads. If it stays blank, reload it or open it in a new tab. Reloading clears the calculator session.
      </p>
      <iframe
        key={reloadCount}
        className="scientific-calculator-frame"
        src={SCIENTIFIC_CALCULATOR_URL}
        title="TI-30XS scientific calculator from ti84calc.com"
        aria-describedby={`${id}-help`}
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups"
        width="100%"
        height="760"
      />
    </aside>
  );
}
