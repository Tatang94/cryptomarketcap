import { useQuery } from "@tanstack/react-query";
import { GlobalStats } from "@shared/schema";
import { transformGlobalStats, formatCurrency } from "@/lib/api";
import { TrendingUp, TrendingDown, Activity, Bitcoin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GlobalStatsSection() {
  const { data: globalStats, isLoading, error } = useQuery<GlobalStats>({
    queryKey: ["/api/global"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !globalStats) {
    return (
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-red-600 dark:text-red-400">
            Unable to load global market data
          </div>
        </div>
      </section>
    );
  }

  const stats = transformGlobalStats(globalStats);

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    change, 
    changeLabel 
  }: { 
    icon: any, 
    label: string, 
    value: string, 
    change?: number, 
    changeLabel?: string 
  }) => (
    <div className="text-center md:text-left">
      <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {change !== undefined && (
        <p className={`text-sm flex items-center justify-center md:justify-start space-x-1 ${
          change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {change >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(change).toFixed(2)}%</span>
          {changeLabel && <span className="text-gray-500">({changeLabel})</span>}
        </p>
      )}
    </div>
  );

  return (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={TrendingUp}
            label="Market Cap"
            value={formatCurrency(stats.marketCap)}
            change={stats.marketCapChange24h}
          />
          <StatCard
            icon={Activity}
            label="24h Volume"
            value={formatCurrency(stats.volume24h)}
            change={stats.volumeChange24h}
          />
          <StatCard
            icon={Bitcoin}
            label="Bitcoin Dominance"
            value={`${stats.bitcoinDominance.toFixed(1)}%`}
          />
          <StatCard
            icon={TrendingUp}
            label="Active Cryptocurrencies"
            value={stats.activeCryptos.toLocaleString()}
          />
        </div>
      </div>
    </section>
  );
}
