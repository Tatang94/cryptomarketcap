import { useState } from "react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Moon, 
  Sun, 
  Menu, 
  TrendingUp,
  BarChart3,
  Wallet,
  Activity
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [searchValue, setSearchValue] = useState("");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navigation = [
    { name: "Cryptocurrencies", href: "#", icon: TrendingUp },
    { name: "Exchanges", href: "#", icon: BarChart3 },
    { name: "Portfolio", href: "#", icon: Wallet },
    { name: "Markets", href: "#", icon: Activity },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CryptoMarket
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                IDR
              </span>
            </div>
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari cryptocurrency..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-80 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Cari cryptocurrency..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
