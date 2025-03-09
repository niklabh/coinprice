'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { formatPrice, formatLargeNumber } from '@/utils/formatters';
import Header from '@/components/Header';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  circulating_supply: number;
  image: string;
}

// Custom dropdown component with search functionality
interface CoinDropdownProps {
  coins: Coin[];
  value: Coin | null;
  onChange: (coin: Coin | null) => void;
  placeholder: string;
  label: string;
}

const CoinDropdown: React.FC<CoinDropdownProps> = ({ coins, value, onChange, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter coins based on search query
  const filteredCoins = coins.filter(coin => {
    const searchLower = searchQuery.toLowerCase();
    return coin.name.toLowerCase().includes(searchLower) || 
           coin.symbol.toLowerCase().includes(searchLower) ||
           // Allow searching by market cap ranges like ">1b" or "<100m"
           (searchLower.startsWith('>') && 
            !isNaN(parseMarketCapQuery(searchLower.substring(1))) && 
            coin.market_cap > parseMarketCapQuery(searchLower.substring(1))) ||
           (searchLower.startsWith('<') && 
            !isNaN(parseMarketCapQuery(searchLower.substring(1))) && 
            coin.market_cap < parseMarketCapQuery(searchLower.substring(1)));
  });

  // Helper function to parse market cap queries like "1b" or "100m"
  const parseMarketCapQuery = (query: string): number => {
    const num = parseFloat(query.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return NaN;
    
    if (query.toLowerCase().includes('b')) {
      return num * 1e9;
    } else if (query.toLowerCase().includes('m')) {
      return num * 1e6;
    } else if (query.toLowerCase().includes('k')) {
      return num * 1e3;
    }
    return num;
  };

  // For initial dropdown without search, show only top 50 coins
  const displayCoins = searchQuery ? filteredCoins : coins.slice(0, 50);

  // Calculate dropdown position for fixed positioning
  const getDropdownStyles = () => {
    if (!dropdownRef.current) return {};
    
    const rect = dropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Calculate initial position
    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX;
    const width = rect.width;
    
    // Estimate dropdown height (max 600px)
    const estimatedHeight = Math.min(600, displayCoins.length * 50 + 70); // 50px per item + 70px for search
    
    // Check if dropdown would go off the bottom of the viewport
    if (rect.bottom + estimatedHeight > viewportHeight) {
      // Position above the button if there's more space there
      if (rect.top > viewportHeight - rect.bottom) {
        top = rect.top + window.scrollY - estimatedHeight;
      }
    }
    
    // Check if dropdown would go off the right of the viewport
    if (left + width > viewportWidth) {
      left = viewportWidth - width - 10; // 10px padding
    }
    
    return {
      top,
      left,
      width,
      maxHeight: `min(600px, calc(85vh - ${rect.bottom}px))`
    };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        className="relative w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <div className="flex items-center">
            <Image
              src={value.image}
              alt={value.name}
              width={24}
              height={24}
              className="rounded-full mr-2"
              unoptimized
            />
            <span className="block truncate">{value.name} ({value.symbol.toUpperCase()})</span>
          </div>
        ) : (
          <span className="block truncate text-gray-500 dark:text-gray-400">{placeholder}</span>
        )}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div 
            className="absolute z-50 bg-white dark:bg-gray-800 shadow-xl max-h-[600px] rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            style={getDropdownStyles()}
            onClick={(e) => e.stopPropagation()}
            ref={dropdownContentRef}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-2">
              <input
                type="search"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                placeholder="Search coins or use >1b, <100m..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 px-1">
                {searchQuery ? `${filteredCoins.length} results` : 'Top 50 coins by market cap'}
              </div>
            </div>
            
            {displayCoins.length > 0 ? (
              displayCoins.map((coin) => (
                <button
                  key={coin.id}
                  className={`w-full text-left px-4 py-2 cursor-pointer flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${value?.id === coin.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onClick={() => {
                    onChange(coin);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="flex-shrink-0 w-8 text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                    #{coins.findIndex(c => c.id === coin.id) + 1}
                  </div>
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                    unoptimized
                  />
                  <div className="flex-grow">
                    <div className="font-medium text-gray-800 dark:text-gray-200">{coin.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {coin.symbol.toUpperCase()} • ${formatPrice(coin.current_price)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    ${formatLargeNumber(coin.market_cap)}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-2">No coins found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function MarketcapOfPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinA, setCoinA] = useState<Coin | null>(null);
  const [coinB, setCoinB] = useState<Coin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate the hypothetical price if coin A had coin B's market cap
  const calculateHypotheticalPrice = () => {
    if (!coinA || !coinB) return null;

    // Formula: Price of A with B's market cap = B's market cap / A's circulating supply
    const hypotheticalPrice = coinB.market_cap / coinA.circulating_supply;
    
    // Calculate multiplication factor (how many x)
    const multiplicationFactor = hypotheticalPrice / coinA.current_price;
    
    return {
      hypotheticalPrice,
      multiplicationFactor
    };
  };

  // Fetch coin data on component mount
  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=' + process.env.NEXT_PUBLIC_COINGECKO_API_KEY
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch coins');
        }

        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setError('Failed to load cryptocurrency data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // Calculate result based on selected coins
  const result = calculateHypotheticalPrice();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="relative">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm mr-3"></span>
                MarketcapOf Calculator
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Calculate the hypothetical price of a coin if it had another coin&apos;s market capitalization
              </p>
            </div>
            
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading cryptocurrency data...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                {error}
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coin A Selector */}
                  <div>
                    <CoinDropdown
                      coins={coins}
                      value={coinA}
                      onChange={setCoinA}
                      placeholder="Select a coin"
                      label="Select Coin A (Price to Calculate)"
                    />
                    
                    {coinA && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <Image
                            src={coinA.image}
                            alt={coinA.name}
                            width={36}
                            height={36}
                            className="rounded-full mr-3"
                            unoptimized
                          />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{coinA.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Current Price: ${formatPrice(coinA.current_price)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Circulating Supply: {formatLargeNumber(coinA.circulating_supply)} {coinA.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Coin B Selector */}
                  <div>
                    <CoinDropdown
                      coins={coins}
                      value={coinB}
                      onChange={setCoinB}
                      placeholder="Select a coin"
                      label="Select Coin B (Market Cap to Use)"
                    />
                    
                    {coinB && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <Image
                            src={coinB.image}
                            alt={coinB.name}
                            width={36}
                            height={36}
                            className="rounded-full mr-3"
                            unoptimized
                          />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{coinB.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Current Price: ${formatPrice(coinB.current_price)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Market Cap: ${formatLargeNumber(coinB.market_cap)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Results Display */}
                {coinA && coinB && result && (
                  <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          Results: {coinA.name} with {coinB.name}&apos;s Market Cap
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Hypothetical Price</div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          ${formatPrice(result.hypotheticalPrice)}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Current Price: </span>
                          <span className="text-gray-800 dark:text-gray-200">${formatPrice(coinA.current_price)}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Multiplication Factor</div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          {result.multiplicationFactor.toFixed(2)}x
                        </div>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {result.multiplicationFactor > 1 
                            ? `${coinA.symbol.toUpperCase()} would be ${result.multiplicationFactor.toFixed(2)}x higher than its current price`
                            : result.multiplicationFactor < 1
                              ? `${coinA.symbol.toUpperCase()} would be ${(1/result.multiplicationFactor).toFixed(2)}x lower than its current price`
                              : `${coinA.symbol.toUpperCase()} would remain at the same price`
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                      <p>
                            If {coinA.name} ({coinA.symbol.toUpperCase()}) had {coinB.name}&apos;s ({coinB.symbol.toUpperCase()}) 
                        market cap of ${formatLargeNumber(coinB.market_cap)}, each {coinA.symbol.toUpperCase()} would be 
                        worth ${formatPrice(result.hypotheticalPrice)}, which is 
                        {result.multiplicationFactor > 1 
                          ? ` ${result.multiplicationFactor.toFixed(2)}x higher than`
                          : result.multiplicationFactor < 1
                            ? ` ${(1/result.multiplicationFactor).toFixed(2)}x lower than`
                            : ` the same as`
                        } its current price.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Info Section */}
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              About the MarketcapOf Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This calculator helps you understand the potential price of a cryptocurrency if it had the same market capitalization as another coin.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The calculation is based on the formula: <span className="font-medium">Hypothetical Price = Target Market Cap ÷ Current Circulating Supply</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              The multiplication factor shows how many times the current price would increase (or decrease) to reach the hypothetical price.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 