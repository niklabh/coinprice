'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
}

interface CoinSearchProps {
  onSelect: (coin: Coin) => void;
}

interface SearchCoin {
  id: string;
  symbol: string;
  name: string;
  large: string;
}

interface PriceData {
  [key: string]: {
    usd: number;
  };
}

const CoinSearch: React.FC<CoinSearchProps> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      if (!debouncedSearch) {
        setCoins([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${debouncedSearch}&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`
        );
        const data = await response.json();
        
        // Get prices for the top 10 results
        if (data.coins.length > 0) {
          const ids = data.coins.slice(0, 10).map((c: SearchCoin) => c.id).join(',');
          const priceResponse = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`
          );
          const priceData: PriceData = await priceResponse.json();

          const coinsWithPrices = data.coins.slice(0, 10).map((coin: SearchCoin) => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: coin.large,
            current_price: priceData[coin.id]?.usd || 0
          }));

          setCoins(coinsWithPrices);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a coin..."
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-10 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {isOpen && (search || loading) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg max-h-96 overflow-auto">
          {loading ? (
            <div className="p-4 text-gray-400 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : coins.length > 0 ? (
            <div className="py-2">
              {coins.map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => {
                    onSelect(coin);
                    setSearch('');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-left transition-colors"
                >
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                  <div>
                    <div className="text-gray-900 dark:text-white font-medium">{coin.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">{coin.symbol.toUpperCase()}</div>
                  </div>
                  {coin.current_price > 0 && (
                    <div className="ml-auto text-gray-700 dark:text-gray-300">
                      ${coin.current_price.toLocaleString()}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : search ? (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-center">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CoinSearch; 