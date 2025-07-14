import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { coinSchema, coinDetailsSchema, tickerSchema, globalStatsSchema, ohlcvSchema } from "@shared/schema";

const COINPAPRIKA_API_KEY = process.env.COINPAPRIKA_API_KEY || "";
const COINPAPRIKA_BASE_URL = "https://api.coinpaprika.com/v1";

// Helper function to make API requests to CoinPaprika
async function fetchFromCoinPaprika(endpoint: string) {
  const headers: Record<string, string> = {
    "Accept": "application/json",
  };

  if (COINPAPRIKA_API_KEY) {
    headers["X-CMC_PRO_API_KEY"] = COINPAPRIKA_API_KEY;
  }

  const response = await fetch(`${COINPAPRIKA_BASE_URL}${endpoint}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`CoinPaprika API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const isHealthy = await storage.getHealthCheck();
      res.json({ status: "ok", healthy: isHealthy });
    } catch (error) {
      res.status(500).json({ error: "Health check failed" });
    }
  });

  // Get global market statistics
  app.get("/api/global", async (req, res) => {
    try {
      const data = await fetchFromCoinPaprika("/global");
      const validatedData = globalStatsSchema.parse(data);
      res.json(validatedData);
    } catch (error) {
      console.error("Error fetching global data:", error);
      res.status(500).json({ error: "Failed to fetch global market data" });
    }
  });

  // Get list of all cryptocurrencies
  app.get("/api/coins", async (req, res) => {
    try {
      const data = await fetchFromCoinPaprika("/coins");
      const validatedData = z.array(coinSchema).parse(data);
      res.json(validatedData);
    } catch (error) {
      console.error("Error fetching coins:", error);
      res.status(500).json({ error: "Failed to fetch cryptocurrencies" });
    }
  });

  // Get detailed information about a specific cryptocurrency
  app.get("/api/coins/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fetchFromCoinPaprika(`/coins/${id}`);
      const validatedData = coinDetailsSchema.parse(data);
      res.json(validatedData);
    } catch (error) {
      console.error("Error fetching coin details:", error);
      res.status(500).json({ error: "Failed to fetch cryptocurrency details" });
    }
  });

  // Get tickers (price data) for cryptocurrencies
  app.get("/api/tickers", async (req, res) => {
    try {
      const { start = "1", limit = "1000" } = req.query;
      // Ensure limit doesn't exceed 1000 (CoinPaprika max)
      const maxLimit = Math.min(parseInt(limit as string) || 1000, 1000);
      const data = await fetchFromCoinPaprika(`/tickers?start=${start}&limit=${maxLimit}`);
      const validatedData = z.array(tickerSchema).parse(data);
      res.json(validatedData);
    } catch (error) {
      console.error("Error fetching tickers:", error);
      res.status(500).json({ error: "Failed to fetch ticker data" });
    }
  });

  // Get ticker data for a specific cryptocurrency
  app.get("/api/tickers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fetchFromCoinPaprika(`/tickers/${id}`);
      const validatedData = tickerSchema.parse(data);
      res.json(validatedData);
    } catch (error) {
      console.error("Error fetching ticker:", error);
      res.status(500).json({ error: "Failed to fetch ticker data" });
    }
  });

  // Get OHLCV data for a specific cryptocurrency
  app.get("/api/coins/:id/ohlcv/today", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fetchFromCoinPaprika(`/coins/${id}/ohlcv/today`);
      const validatedData = z.array(ohlcvSchema).parse(data);
      res.json(validatedData);
    } catch (error) {
      console.error("Error fetching OHLCV data:", error);
      res.status(500).json({ error: "Failed to fetch OHLCV data" });
    }
  });

  // Search cryptocurrencies
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Search query is required" });
      }

      const data = await fetchFromCoinPaprika(`/search?q=${encodeURIComponent(q)}&limit=10`);
      res.json(data);
    } catch (error) {
      console.error("Error searching cryptocurrencies:", error);
      res.status(500).json({ error: "Failed to search cryptocurrencies" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
