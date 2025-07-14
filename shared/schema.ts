import { z } from "zod";

export const coinSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  rank: z.number(),
  is_new: z.boolean(),
  is_active: z.boolean(),
  type: z.string(),
});

export const coinDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  rank: z.number(),
  is_new: z.boolean(),
  is_active: z.boolean(),
  type: z.string(),
  description: z.string().optional(),
  message: z.string().optional(),
  open_source: z.boolean(),
  started_at: z.string().optional(),
  development_status: z.string(),
  hardware_wallet: z.boolean(),
  proof_type: z.string(),
  org_structure: z.string(),
  hash_algorithm: z.string(),
  first_data_at: z.string(),
  last_data_at: z.string(),
});

export const quoteSchema = z.object({
  price: z.number(),
  volume_24h: z.number(),
  volume_24h_change_24h: z.number(),
  market_cap: z.number(),
  market_cap_change_24h: z.number(),
  percent_change_15m: z.number(),
  percent_change_30m: z.number(),
  percent_change_1h: z.number(),
  percent_change_6h: z.number(),
  percent_change_12h: z.number(),
  percent_change_24h: z.number(),
  percent_change_7d: z.number(),
  percent_change_30d: z.number(),
  percent_change_1y: z.number(),
  ath_price: z.number(),
  ath_date: z.string(),
  percent_from_price_ath: z.number(),
});

export const tickerSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  rank: z.number(),
  total_supply: z.number(),
  max_supply: z.number().nullable(),
  beta_value: z.number(),
  first_data_at: z.string(),
  last_updated: z.string(),
  quotes: z.object({
    USD: quoteSchema,
  }),
});

export const globalStatsSchema = z.object({
  market_cap_usd: z.number(),
  volume_24h_usd: z.number(),
  bitcoin_dominance_percentage: z.number(),
  cryptocurrencies_number: z.number(),
  market_cap_ath_value: z.number(),
  market_cap_ath_date: z.string(),
  volume_24h_ath_value: z.number(),
  volume_24h_ath_date: z.string(),
  market_cap_change_24h: z.number(),
  volume_24h_change_24h: z.number(),
  last_updated: z.number(),
});

export const ohlcvSchema = z.object({
  time_open: z.string(),
  time_close: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
  market_cap: z.number(),
});

export type Coin = z.infer<typeof coinSchema>;
export type CoinDetails = z.infer<typeof coinDetailsSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type Ticker = z.infer<typeof tickerSchema>;
export type GlobalStats = z.infer<typeof globalStatsSchema>;
export type OHLCV = z.infer<typeof ohlcvSchema>;
