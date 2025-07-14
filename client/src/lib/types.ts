export interface CryptoTableRow {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply?: number;
  lastUpdated: string;
}

export interface GlobalMarketStats {
  marketCap: number;
  volume24h: number;
  bitcoinDominance: number;
  activeCryptos: number;
  marketCapChange24h: number;
  volumeChange24h: number;
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  rank: number;
}

export interface SortConfig {
  key: keyof CryptoTableRow;
  direction: 'asc' | 'desc';
}
