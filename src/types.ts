/**
 * Shared TypeScript types used across server & client.
 * Extend or refine as you load the dataset.
 */

export interface Deal {
  deal_id: string;
  continent: string;
  announced: string;              // ISO date string
  /** Dynamic valuation column – could be “valuation_usd”, “val_usd” or “price”. */
  [key: string]: unknown;
}

export interface ContinentSummary {
  continent: string;
  total: number;
  median_valuation: number;
}