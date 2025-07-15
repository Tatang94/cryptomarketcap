import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { useMemo } from "react";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Activity, DollarSign, Users, Calendar, Hash, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from "date-fns";
import { formatCurrency, formatNumber, getChangeColor, getChangeIcon } from "@/lib/api";
import type { CoinDetails, Ticker, Market, OHLCV } from "@shared/schema";

interface CoinDetailParams {
  id: string;
}

export default function CoinDetail() {
  const { id } = useParams<CoinDetailParams>();
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    setLocation("/");
  };

  const { data: coinDetails, isLoading: isLoadingDetails } = useQuery<CoinDetails>({
    queryKey: ['/api/coins', id],
    enabled: !!id,
  });

  const { data: ticker, isLoading: isLoadingTicker } = useQuery<Ticker>({
    queryKey: ['/api/tickers', id],
    enabled: !!id,
  });

  const { data: markets, isLoading: isLoadingMarkets } = useQuery<Market[]>({
    queryKey: ['/api/coins', id, 'markets'],
    enabled: !!id,
  });

  const { data: ohlcvData, isLoading: isLoadingChart } = useQuery<OHLCV[]>({
    queryKey: ['/api/coins', id, 'ohlcv', '7d'],
    enabled: !!id,
    retry: 2,
    retryDelay: 1000,
  });

  const chartData = useMemo(() => {
    if (!ohlcvData || ohlcvData.length === 0) {
      // Generate sample data based on current price for demonstration
      if (!ticker) return [];
      
      const currentPrice = ticker.quotes.USD.price;
      const change24h = ticker.quotes.USD.percent_change_24h;
      const days = 7;
      
      return Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        
        // Generate price variation based on 24h change
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const baseChange = change24h / 100 / days; // Distribute change over days
        const priceMultiplier = 1 + baseChange * (i + 1) + variation;
        
        return {
          time: format(date, 'dd/MM'),
          price: currentPrice * priceMultiplier,
          volume: ticker.quotes.USD.volume_24h * (0.8 + Math.random() * 0.4), // ±20% volume variation
          marketCap: ticker.quotes.USD.market_cap * priceMultiplier,
          high: currentPrice * priceMultiplier * 1.05,
          low: currentPrice * priceMultiplier * 0.95,
        };
      });
    }
    
    try {
      return ohlcvData.map(item => ({
        time: format(new Date(item.time_close), 'dd/MM'),
        price: item.close,
        volume: item.volume,
        marketCap: item.market_cap,
        high: item.high,
        low: item.low,
      }));
    } catch (error) {
      console.error('Error processing chart data:', error);
      return [];
    }
  }, [ohlcvData, ticker]);

  if (isLoadingDetails || isLoadingTicker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!coinDetails || !ticker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cryptocurrency tidak ditemukan</h1>
          <Button variant="outline" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const quote = ticker.quotes.USD;
  const change24h = quote.percent_change_24h;
  const changeColor = getChangeColor(change24h);
  const changeIcon = getChangeIcon(change24h);
  const supplyPercentage = ticker.max_supply ? (ticker.total_supply / ticker.max_supply) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {ticker.symbol.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{ticker.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-lg text-muted-foreground">{ticker.symbol}</span>
              <Badge variant="secondary">#{ticker.rank}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Harga Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(quote.price)}</div>
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
              {changeIcon}
              {change24h > 0 ? '+' : ''}{change24h.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4 inline mr-1" />
              Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(quote.market_cap)}</div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(quote.market_cap_change_24h)}`}>
              {getChangeIcon(quote.market_cap_change_24h)}
              {quote.market_cap_change_24h > 0 ? '+' : ''}{quote.market_cap_change_24h.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4 inline mr-1" />
              Volume 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(quote.volume_24h)}</div>
            <div className={`flex items-center gap-1 text-sm ${getChangeColor(quote.volume_24h_change_24h)}`}>
              {getChangeIcon(quote.volume_24h_change_24h)}
              {quote.volume_24h_change_24h > 0 ? '+' : ''}{quote.volume_24h_change_24h.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Hash className="h-4 w-4 inline mr-1" />
              Circulating Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(ticker.total_supply)}</div>
            <div className="text-sm text-muted-foreground">
              {ticker.max_supply ? `${supplyPercentage.toFixed(1)}% dari max supply` : 'Tidak ada max supply'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informasi Supply
          </CardTitle>
          <CardDescription>
            Distribusi dan ketersediaan token saat ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Circulating Supply */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Circulating Supply</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {ticker.max_supply ? `${supplyPercentage.toFixed(1)}%` : 'Tidak Terbatas'}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{formatNumber(ticker.total_supply)}</div>
              <div className="text-sm text-muted-foreground">{ticker.symbol} yang beredar saat ini</div>
            </div>

            {/* Max Supply */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm font-medium">Max Supply</span>
                </div>
                <Badge variant={ticker.max_supply ? "outline" : "secondary"} className="text-xs">
                  {ticker.max_supply ? 'Terbatas' : 'Unlimited'}
                </Badge>
              </div>
              <div className="text-2xl font-bold">
                {ticker.max_supply ? formatNumber(ticker.max_supply) : '∞'}
              </div>
              <div className="text-sm text-muted-foreground">
                {ticker.max_supply ? 'Batas maksimum supply' : 'Tidak ada batas maksimum'}
              </div>
            </div>

            {/* Supply Progress Bar */}
            {ticker.max_supply && (
              <div className="md:col-span-2 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress Supply</span>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(ticker.total_supply)} / {formatNumber(ticker.max_supply)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(supplyPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {supplyPercentage.toFixed(2)}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Chart and Markets */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">
            <TrendingUp className="h-4 w-4 mr-2" />
            Grafik Harga
          </TabsTrigger>
          <TabsTrigger value="markets">
            <ExternalLink className="h-4 w-4 mr-2" />
            Pasar Trading
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Harga 7 Hari Terakhir</CardTitle>
              <CardDescription>
                Menampilkan pergerakan harga {ticker.name} dalam 7 hari terakhir
                {!ohlcvData || ohlcvData.length === 0 ? ' (Data simulasi berdasarkan harga saat ini)' : ' (Data historis real)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingChart ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(value)}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Harga']}
                      labelFormatter={(label) => `Tanggal: ${label}`}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      fill="url(#colorPrice)"
                      fillOpacity={0.3}
                    />
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sedang memuat data grafik...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pasar Trading</CardTitle>
              <CardDescription>
                Daftar exchange yang memperdagangkan {ticker.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMarkets ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : markets && markets.length > 0 ? (
                <div className="space-y-4">
                  {markets.slice(0, 10).map((market, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {market.exchange_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{market.exchange_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {market.pair}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {market.quotes?.USD?.price ? formatCurrency(market.quotes.USD.price) : 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Vol: {market.quotes?.USD?.volume_24h ? formatCurrency(market.quotes.USD.volume_24h) : 'N/A'}
                        </div>
                      </div>
                      {market.market_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={market.market_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Data pasar trading tidak tersedia
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            <Calendar className="h-5 w-5 inline mr-2" />
            Informasi Tambahan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Tanggal Pertama Data</div>
              <div className="font-medium">
                {format(new Date(ticker.first_data_at), 'dd MMMM yyyy')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Terakhir Diperbarui</div>
              <div className="font-medium">
                {format(new Date(ticker.last_updated), 'dd MMMM yyyy, HH:mm')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Beta Value</div>
              <div className="font-medium">{ticker.beta_value.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <Badge variant={coinDetails.is_active ? "default" : "secondary"}>
                {coinDetails.is_active ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}