/**
 * Minimal Express server.
 * TODO markers highlight the areas the candidate must implement.
 */

import express from 'express';
import { loadDeals } from './scripts/loadDeals';
import type { ContinentSummary, Deal } from './types';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

/* ── Load data at boot ─────────────────────────────────────── */
import path from 'path';
const DATA_FILE = path.resolve(process.cwd(), 'deals.json');
const { deals, summary } = loadDeals(DATA_FILE);

/** TODO: pre-compute aggregates here for constant-time queries. */
let continentSummary: ContinentSummary[] = summary; // <-- candidate fills

/* ── Health check ──────────────────────────────────────────── */
app.get('/ping', (_req, res) => res.json({ message: 'pong' }));

/* ── Endpoint: /deals/summary ──────────────────────────────── */
app.get('/deals/summary', (_req, res) => {
  /** TODO: return continentSummary once computed */
  res.status(200).json({ continentSummary });
});

/* ── Endpoint: /deals/:id ──────────────────────────────────── */
app.get('/deals/:id', (req, res) => {
  /** TODO: find deal, compute days_since_announced */
  // res.status(501).json({ message: 'Not implemented' });
  const { id } = req.params;
  // id valid

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ code: "ID_NOT_FOUND", message: "ID not passed" });
  }

  const deal = deals.find((d) => d.deal_id === id);
  if (!deal) {
    return res.status(404).json({ code: "DEAL_NOT_FOUND", message: "Deal with given id not found " + id });
  }

  const today = new Date();
  const announceDate = new Date(deal.announced);

  const days_since_announced = Math.floor((today.getTime() - announceDate.getTime()) / (24 * 60 * 60 * 1000));
  console.log({ days_since_announced });
  return res.status(200).json({ data: { ...deal, days_since_announced } });
});

/* ── Global error handler (optional bonus) ─────────────────── */

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
