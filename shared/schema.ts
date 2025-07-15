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
  open_source: z.boolean().optional(),
  started_at: z.string().optional().nullable(),
  development_status: z.string().optional().nullable(),
  hardware_wallet: z.boolean().optional(),
  proof_type: z.string().optional(),
  org_structure: z.string().optional().nullable(),
  hash_algorithm: z.string().optional(),
  first_data_at: z.string().optional(),
  last_data_at: z.string().optional(),
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

export const marketSchema = z.object({
  exchange_id: z.string(),
  exchange_name: z.string(),
  pair: z.string(),
  base_currency_id: z.string(),
  base_currency_name: z.string(),
  quote_currency_id: z.string(),
  quote_currency_name: z.string(),
  market_url: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  fee_type: z.string().optional().nullable(),
  outlier: z.boolean().optional().nullable(),
  reported_volume_24h_share: z.number().optional().nullable(),
  quotes: z.object({
    USD: z.object({
      price: z.number().optional().nullable(),
      volume_24h: z.number().optional().nullable(),
    }),
  }).optional().nullable(),
});

export const exchangeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  active: z.boolean(),
  website_status: z.boolean(),
  api_status: z.boolean(),
  message: z.string().optional(),
  links: z.object({
    website: z.array(z.string()).optional(),
    twitter: z.array(z.string()).optional(),
  }).optional(),
  markets_data_fetched: z.boolean(),
  adjusted_rank: z.number(),
  reported_rank: z.number(),
  currencies: z.number(),
  markets: z.number(),
  fiats: z.array(z.object({
    name: z.string(),
    symbol: z.string(),
  })).optional(),
  quotes: z.object({
    USD: z.object({
      reported_volume_24h: z.number(),
      adjusted_volume_24h: z.number(),
      reported_volume_7d: z.number(),
      adjusted_volume_7d: z.number(),
      reported_volume_30d: z.number(),
      adjusted_volume_30d: z.number(),
    }),
  }),
  last_updated: z.string(),
});

export type Coin = z.infer<typeof coinSchema>;
export type CoinDetails = z.infer<typeof coinDetailsSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type Ticker = z.infer<typeof tickerSchema>;
export type GlobalStats = z.infer<typeof globalStatsSchema>;
export type OHLCV = z.infer<typeof ohlcvSchema>;
export type Market = z.infer<typeof marketSchema>;
export type Exchange = z.infer<typeof exchangeSchema>;
