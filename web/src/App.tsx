/**
 * React dashboard shell.
 * The candidate will:
 *   • fetch /deals/summary on mount
 *   • render a table or list
 *   • open a modal with /deals/:id details on click
 */

import { useEffect, useState } from 'react';
import type { ContinentSummary, Deal } from '../../src/types';

export default function App() {
  const [summary, setSummary] = useState<ContinentSummary[]>([]);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  // --- Load summary on mount ---------------------------------
  useEffect(() => {
    fetch('/deals/summary')
      .then(r => r.json())
      .then(setSummary)
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Deal-Pulse Dashboard</h1>

      {/* TODO: render summary table */}
      <pre>{JSON.stringify(summary, null, 2)}</pre>

      {/* TODO: modal for activeDeal */}
      {activeDeal && (
        <pre>
          {/* placeholder – candidate should replace with nicer UI */}
          {JSON.stringify(activeDeal, null, 2)}
        </pre>
      )}
    </div>
  );
}
