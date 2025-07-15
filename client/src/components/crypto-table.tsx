import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Ticker } from "@shared/schema";
import { transformTickerToTableRow, formatCurrency, formatNumber, getChangeColor, getChangeIcon } from "@/lib/api";
import { CryptoTableRow, SortConfig } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  RefreshCw, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Eye
} from "lucide-react";

export function CryptoTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rank', direction: 'asc' });
  const [isRefetching, setIsRefetching] = useState(false);
  const itemsPerPage = 1000;

  const { data: tickers, isLoading, error, refetch } = useQuery<Ticker[]>({
    queryKey: [`/api/tickers?start=${((currentPage - 1) * itemsPerPage + 1)}&limit=${itemsPerPage}`],
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3, // Retry failed requests 3 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Refetch failed:', error);
    } finally {
      setIsRefetching(false);
    }
  };

  const tableData = useMemo(() => {
    if (!tickers) return [];
    console.log('Tickers data:', tickers);
    try {
      const transformed = tickers.map(transformTickerToTableRow);
      console.log('Transformed data:', transformed);
      return transformed;
    } catch (error) {
      console.error('Error transforming ticker data:', error);
      return [];
    }
  }, [tickers]);

  const sortedData = useMemo(() => {
    if (!tableData.length) return [];
    
    const sorted = [...tableData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [tableData, sortConfig]);

  const handleSort = (key: keyof CryptoTableRow) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortableHeader = ({ 
    label, 
    sortKey, 
    className = "" 
  }: { 
    label: string, 
    sortKey: keyof CryptoTableRow, 
    className?: string 
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(sortKey)}
      className={`h-auto p-0 font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 ${className}`}
    >
      <span>{label}</span>
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );

  const LoadingRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
      <TableCell className="text-right hidden md:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
      <TableCell className="text-right hidden lg:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
      <TableCell className="text-right hidden xl:table-cell"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
    </TableRow>
  );

  // Debug info
  console.log('Component state:', { isLoading, error, tickers: !!tickers, tickersLength: tickers?.length });

  if (error) {
    console.error('Error loading cryptocurrency data:', error);
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Harga Cryptocurrency Hari Ini (berdasarkan Market Cap)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Semua harga dalam Rupiah (IDR) - Data real-time dari CoinPaprika
            </p>
          </div>
        </div>
        
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="flex items-center justify-between">
              <span>Tidak dapat memuat data cryptocurrency. Silakan coba lagi.</span>
              <Button 
                onClick={handleRefetch} 
                variant="outline" 
                size="sm" 
                disabled={isRefetching}
                className="ml-4 border-red-300 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-800"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Memuat...' : 'Coba Lagi'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Harga Cryptocurrency Hari Ini (berdasarkan Market Cap)
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Semua harga dalam Rupiah (IDR) - Data real-time
          </p>
          {tickers && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Menampilkan {tickers.length} cryptocurrency (Halaman {currentPage} dari 2)
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleRefetch} variant="outline" size="sm" disabled={isRefetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Memuat...' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="w-16">
                  <SortableHeader label="#" sortKey="rank" />
                </TableHead>
                <TableHead>
                  <SortableHeader label="Name" sortKey="name" />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader label="Harga (IDR)" sortKey="price" className="ml-auto" />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader label="24h %" sortKey="change24h" className="ml-auto" />
                </TableHead>
                <TableHead className="text-right hidden md:table-cell">
                  <SortableHeader label="Market Cap (IDR)" sortKey="marketCap" className="ml-auto" />
                </TableHead>
                <TableHead className="text-right hidden lg:table-cell">
                  <SortableHeader label="Volume 24h (IDR)" sortKey="volume24h" className="ml-auto" />
                </TableHead>
                <TableHead className="text-right hidden xl:table-cell">
                  <SortableHeader label="Suplai Beredar" sortKey="circulatingSupply" className="ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(20)].map((_, i) => <LoadingRow key={i} />)
              ) : (
                sortedData.map((crypto) => (
                  <TableRow 
                    key={crypto.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {crypto.rank}
                    </TableCell>
                    <TableCell>
                      <Link href={`/coin/${crypto.id}`} className="block">
                        <div className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {crypto.symbol.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                              {crypto.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {crypto.symbol}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <Eye className="h-4 w-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(crypto.price)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${getChangeColor(crypto.change24h)}`}>
                      <div className="flex items-center justify-end space-x-1">
                        {crypto.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(crypto.change24h).toFixed(2)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-900 dark:text-white hidden md:table-cell">
                      {formatCurrency(crypto.marketCap)}
                    </TableCell>
                    <TableCell className="text-right text-gray-900 dark:text-white hidden lg:table-cell">
                      {formatCurrency(crypto.volume24h)}
                    </TableCell>
                    <TableCell className="text-right text-gray-900 dark:text-white hidden xl:table-cell">
                      {formatNumber(crypto.circulatingSupply)} {crypto.symbol}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-gray-600 dark:text-gray-400">
          Page {currentPage} of 2
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= 2}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
