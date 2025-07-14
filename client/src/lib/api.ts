import { apiRequest } from "./queryClient";
import { Ticker, GlobalStats, Coin, CoinDetails, OHLCV } from "@shared/schema";
import { GlobalMarketStats, CryptoTableRow } from "./types";

// Transform global stats from API to our format
export function transformGlobalStats(data: GlobalStats): GlobalMarketStats {
  return {
    marketCap: data.market_cap_usd,
    volume24h: data.volume_24h_usd,
    bitcoinDominance: data.bitcoin_dominance_percentage,
    activeCryptos: data.cryptocurrencies_number,
    marketCapChange24h: data.market_cap_change_24h,
    volumeChange24h: data.volume_24h_change_24h,
  };
}

// Transform ticker data to table row format
export function transformTickerToTableRow(ticker: Ticker): CryptoTableRow {
  return {
    id: ticker.id,
    name: ticker.name,
    symbol: ticker.symbol,
    rank: ticker.rank,
    price: ticker.quotes.USD.price,
    change24h: ticker.quotes.USD.percent_change_24h,
    marketCap: ticker.quotes.USD.market_cap,
    volume24h: ticker.quotes.USD.volume_24h,
    circulatingSupply: ticker.circulating_supply,
    maxSupply: ticker.max_supply || undefined,
    lastUpdated: ticker.last_updated,
  };
}

// Format currency values
export function formatCurrency(value: number): string {
  if (value >= 1e12) return '$' + (value / 1e12).toFixed(2) + 'T';
  if (value >= 1e9) return '$' + (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return '$' + (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return '$' + (value / 1e3).toFixed(2) + 'K';
  return '$' + value.toFixed(2);
}

// Format large numbers
export function formatNumber(value: number): string {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
  return value.toLocaleString();
}

// Get percentage change color class
export function getChangeColor(change: number): string {
  return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
}

// Get percentage change icon
export function getChangeIcon(change: number): string {
  return change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
}
