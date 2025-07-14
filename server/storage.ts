import { Coin, CoinDetails, Ticker, GlobalStats, OHLCV } from "@shared/schema";

export interface IStorage {
  // Since we're using external API, we don't need local storage
  // This is just to maintain the interface structure
  getHealthCheck(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  constructor() {}

  async getHealthCheck(): Promise<boolean> {
    return true;
  }
}

export const storage = new MemStorage();
