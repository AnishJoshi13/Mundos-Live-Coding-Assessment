/**
 * CLI + helper to ingest `deals.json` and return:
 *   • an array of validated deals
 *   • any pre-computed aggregates you need (median, totals, etc.)
 *
 * The candidate must finish validation and aggregation logic.
 */

import { readFileSync } from 'fs';
import { z } from 'zod';
import type { Deal } from '../types';

// --- Zod schema with unknown valuation key -------------------
const DealSchema = z
  .object({
    deal_id: z.string(),
    continent: z.string(),
    announced: z.string()
  })
  .passthrough(); // keep extra columns (valuation field)

// -------------------------------------------------------------
export function loadDeals(path: string): Deal[] {
  const raw = JSON.parse(readFileSync(path, 'utf-8')) as unknown[];
  const valid: Deal[] = [];

  for (const row of raw) {
    const parsed = DealSchema.safeParse(row);
    if (parsed.success) {
      valid.push(parsed.data as Deal);
    } else {
      console.error('[loadDeals] bad row skipped:', parsed.error.issues);
    }
  }
  return valid;
}
