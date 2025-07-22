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
  const [input, setInput] = useState('');
  const [dealId, setDealId] = useState('');
  // --- Load summary on mount ---------------------------------
  useEffect(() => {
    fetch('/deals/summary')
      .then((r) => r.json())
      .then((res) => {
        console.log(res);
        setSummary(res.continentSummary);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchDealById = async (dealId: string) => {
    console.log({ dealId });
    try {
      const result = await fetch(`/deals/${dealId}`);
      const { data } = await result.json();
      setActiveDeal(data);
      // return void;
    } catch (err) {
      console.log(err);
      console.error('Something went wrong while fetching deal by id', dealId);
    }
  };

  // useEffect(() => {
  //   fetchDealById(dealId);
  // }, [dealId]);

  const fetchBtnHandler = async (dealId: string) => {
    await fetchDealById(dealId);
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Deal-Pulse Dashboard</h1>
      {/* TODO: render summary table */}
      {/* <pre>{JSON.stringify(summary, null, 2)}</pre> */}
      <table>
        <thead>
          <tr>
            <th>Continent</th>
            <th>Total</th>
            <th>Median Valuation</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr key={row.continent}>
              <td>{row.continent}</td>
              <td>{row.total}</td>
              <td>{row.median_valuation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <button onClick={() => fetchBtnHandler(input)}>Fetch</button>
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
