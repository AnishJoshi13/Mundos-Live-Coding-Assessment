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
const deals: Deal[] = loadDeals(DATA_FILE);

/** TODO: pre-compute aggregates here for constant-time queries. */
let continentSummary: ContinentSummary[] = []; // <-- candidate fills

/* ── Health check ──────────────────────────────────────────── */
app.get('/ping', (_req, res) => res.json({ message: 'pong' }));

/* ── Endpoint: /deals/summary ──────────────────────────────── */
app.get('/deals/summary', (_req, res) => {
  /** TODO: return continentSummary once computed */
  res.status(501).json({ message: 'Not implemented' });
});

/* ── Endpoint: /deals/:id ──────────────────────────────────── */
app.get('/deals/:id', (req, res) => {
  /** TODO: find deal, compute days_since_announced */
  res.status(501).json({ message: 'Not implemented' });
});

/* ── Global error handler (optional bonus) ─────────────────── */

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
