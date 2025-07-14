import { Header } from "@/components/header";
import { GlobalStatsSection } from "@/components/global-stats";
import { CryptoTable } from "@/components/crypto-table";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <GlobalStatsSection />
      <main className="container mx-auto px-4 py-8">
        <CryptoTable />
      </main>
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Data disediakan oleh{" "}
              <a 
                href="https://coinpaprika.com" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                CoinPaprika
              </a>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Data cryptocurrency real-time dengan harga dalam Rupiah (IDR)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
