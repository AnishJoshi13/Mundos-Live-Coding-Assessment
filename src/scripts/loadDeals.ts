/**
 * CLI + helper to ingest `deals.json` and return:
 *   • an array of validated deals
 *   • any pre-computed aggregates you need (median, totals, etc.)
 *
 * The candidate must finish validation and aggregation logic.
 */

import { readFileSync } from 'fs';
import { z } from 'zod';
import type { ContinentSummary, Deal } from '../types';

// --- Zod schema with unknown valuation key -------------------
const DealSchema = z
  .object({
    deal_id: z.string(),
    continent: z.string(),
    announced: z.string()
  })
  .passthrough(); // keep extra columns (valuation field)

function findValuation(dealData: Deal): number | null {
  const possibleFieldKeys = ["val_usd", "valuation_usd", "price"];
  for (const key of possibleFieldKeys) {
    if (key in dealData && typeof dealData[key] === 'number') {
      return dealData[key];
    }
  }
  return null;
}

function findMedian(valuations: number[]): number {
  if (valuations.length === 0) return 0;

  const sorted = [...valuations].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.floor((sorted[mid] + sorted[mid + 1]) / 2);
  }
  return Math.floor(sorted[mid]);
}

// -------------------------------------------------------------
export function loadDeals(path: string): { deals: Deal[], summary: ContinentSummary[] } {
  const raw = JSON.parse(readFileSync(path, 'utf-8')) as unknown[];
  const valid: Deal[] = [];

  for (const row of raw) {
    const parsed = DealSchema.safeParse(row);
    if (!parsed.success) {
      console.error('[loadDeals] bad row skipped:', parsed.error.issues);
      continue;
    }

    const valuation = findValuation(parsed.data);
    if (!valuation) {
      console.error("[loadDeals] Invalid Valuation found: ", parsed.data);
      continue;
    }

    valid.push({ ...parsed.data, valuation });
  }
  /**
   * Asia: median([1,2,,3])
   * SA;
   * NA;
   */

  const contientMap: Record<string, number[]> = {};

  for (const deal of valid) {
    const continent = deal.continent;
    const valuation = (deal as Deal).valuation as number;
    if (!contientMap[continent]) contientMap[continent] = [];
    contientMap[continent].push(valuation);
  }


  const summary: ContinentSummary[] = Object.entries(contientMap).map(([continent, valuations]) => ({ continent, total: valuations.length, median_valuation: findMedian(valuations) }));

  console.log({ summary });
  return { deals: valid, summary };
}
