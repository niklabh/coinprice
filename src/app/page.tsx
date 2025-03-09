'use client';

import { useState, useEffect, useCallback } from 'react';
import CoinList from '@/components/CoinList';
import Header from '@/components/Header';
import MarketInfo from '@/components/MarketInfo';
import Script from 'next/script';
import CoinDetail from '@/components/CoinDetail';

// Define types for our data
interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  [key: string]: any;
}

interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    market_cap_percentage: { [key: string]: number };
    market_cap_change_percentage_24h_usd: number;
    [key: string]: any;
  };
}

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  description: string;
  links: {
    homepage: string;
    blockchain_site: string;
    official_forum_url: string;
    subreddit_url: string;
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    github_repos: string[];
  };
}

export default function Home() {
  // State for main route handling
  const [currentRoute, setCurrentRoute] = useState('/');
  
  // State for main page data
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for coin detail
  const [coinId, setCoinId] = useState<string | null>(null);
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [coinLoading, setCoinLoading] = useState(false);
  const [coinError, setCoinError] = useState<string | null>(null);

  // Handle route changes
  const handleRouteChange = useCallback((path: string) => {
    // Update the browser URL without a page reload
    window.history.pushState(null, '', path);
    setCurrentRoute(path);
    
    // If this is a coin route, extract the coin ID
    const coinMatch = path.match(/^\/coin\/([^\/]+)$/);
    if (coinMatch) {
      setCoinId(coinMatch[1]);
    } else {
      setCoinId(null);
    }
  }, []);

  // Handle coin click
  const handleCoinClick = useCallback((id: string) => {
    handleRouteChange(`/coin/${id}`);
  }, [handleRouteChange]);

  // Check for direct navigation on first render
  useEffect(() => {
    // First check URL parameters (from 404.html redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const pathParam = urlParams.get('path');
    
    if (pathParam) {
      handleRouteChange(pathParam);
      // Clean up the URL
      window.history.replaceState(null, '', pathParam);
      return;
    }
    
    // Then check session storage (from SPA script)
    try {
      const storedPath = sessionStorage.getItem('spa_navigation_path');
      if (storedPath) {
        console.log('Found stored path:', storedPath);
        handleRouteChange(storedPath);
        sessionStorage.removeItem('spa_navigation_path');
        return;
      }
    } catch (e) {
      console.error('Error checking sessionStorage:', e);
    }
    
    // If no stored path, use the current path
    const path = window.location.pathname;
    if (path !== '/') {
      handleRouteChange(path);
    }
    
    // Set up a popstate listener for back/forward navigation
    const handlePopState = () => {
      handleRouteChange(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleRouteChange]);

  // Fetch main data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coinsData, globalMarketData] = await Promise.all([
          fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d&x_cg_demo_api_key=' + process.env.NEXT_PUBLIC_COINGECKO_API_KEY
          ).then(res => {
            if (!res.ok) throw new Error('Failed to fetch coins');
            return res.json();
          }),
          fetch(
            'https://api.coingecko.com/api/v3/global?x_cg_demo_api_key=' + process.env.NEXT_PUBLIC_COINGECKO_API_KEY
          ).then(res => {
            if (!res.ok) throw new Error('Failed to fetch global market data');
            return res.json();
          })
        ]);

        setCoins(coinsData);
        setGlobalData(globalMarketData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch coin data when coinId changes
  useEffect(() => {
    const fetchCoinData = async () => {
      if (!coinId) {
        setCoinData(null);
        return;
      }
      
      try {
        setCoinLoading(true);
        setCoinError(null);
        
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Coin not found' : 'Failed to fetch coin data');
        }

        const data = await response.json();
        
        setCoinData({
          id: data.id,
          symbol: data.symbol,
          name: data.name,
          image: data.image.large,
          current_price: data.market_data.current_price.usd,
          market_cap: data.market_data.market_cap.usd,
          total_volume: data.market_data.total_volume.usd,
          high_24h: data.market_data.high_24h.usd,
          low_24h: data.market_data.low_24h.usd,
          price_change_percentage_24h: data.market_data.price_change_percentage_24h,
          market_cap_rank: data.market_cap_rank,
          circulating_supply: data.market_data.circulating_supply,
          total_supply: data.market_data.total_supply,
          max_supply: data.market_data.max_supply,
          ath: data.market_data.ath.usd,
          ath_change_percentage: data.market_data.ath_change_percentage.usd,
          ath_date: data.market_data.ath_date.usd,
          atl: data.market_data.atl.usd,
          atl_change_percentage: data.market_data.atl_change_percentage.usd,
          atl_date: data.market_data.atl_date.usd,
          description: data.description.en,
          links: {
            homepage: data.links.homepage[0],
            blockchain_site: data.links.blockchain_site.filter(Boolean)[0],
            official_forum_url: data.links.official_forum_url.filter(Boolean)[0],
            subreddit_url: data.links.subreddit_url,
            twitter_screen_name: data.links.twitter_screen_name,
            facebook_username: data.links.facebook_username,
            telegram_channel_identifier: data.links.telegram_channel_identifier,
            github_repos: data.links.repos_url.github
          }
        });
      } catch (err) {
        setCoinError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setCoinLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId]);

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CoinPrice - Cryptocurrency Tracker",
    "applicationCategory": "FinanceApplication",
    "description": "Track real-time cryptocurrency prices, manage your portfolio, and stay updated with the latest market trends.",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1024"
    }
  };

  // Render based on current route
  const renderContent = () => {
    // If we're on a coin detail page
    if (coinId) {
      return (
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 pt-4 pb-8">
          {coinLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading coin data...</p>
            </div>
          ) : coinError ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-red-500">{coinError}</p>
            </div>
          ) : coinData ? (
            <CoinDetail coin={coinData} />
          ) : null}
        </div>
      );
    }
    
    // Home page
    return (
      <>
        {/* Market Info */}
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 pt-4">
          {loading ? (
            <div className="p-4 text-center">Loading market data...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">Error: {error}</div>
          ) : (
            <MarketInfo globalData={globalData} />
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-3 py-3 sm:px-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm mr-3"></span>
                Top Cryptocurrencies by Market Cap
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Live prices and stats for the top 100 cryptocurrencies
              </p>
            </div>
            {loading ? (
              <div className="p-4 text-center">Loading coins...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">Error: {error}</div>
            ) : (
              <CoinList coins={coins} onCoinClick={handleCoinClick} />
            )}
          </div>
        </div>

        {/* Introduction for SEO */}
        <section className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Live Cryptocurrency Prices and Market Data
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Welcome to CoinPrice, your go-to platform for tracking real-time cryptocurrency prices, market capitalizations, and trading volumes. Our comprehensive dashboard provides up-to-date information on Bitcoin, Ethereum, and hundreds of altcoins, helping you make informed investment decisions.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Whether you are a seasoned trader or new to the world of cryptocurrencies, CoinPrice offers the tools you need to monitor market trends, manage your portfolio, and stay ahead of the curve in this dynamic digital asset landscape.
            </p>
          </div>
        </section>
          
        {/* Additional SEO Content */}
        <section className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Why Track Cryptocurrency Prices?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Market Insights</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Cryptocurrency markets operate 24/7, making it essential to have access to real-time data. CoinPrice provides up-to-the-minute price updates, historical charts, and market indicators to help you identify trends and make data-driven decisions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Keep track of your cryptocurrency investments in one place. Our portfolio tools allow you to monitor performance, calculate gains and losses, and analyze your asset allocation across different cryptocurrencies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Script 
        id="structured-data" 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} 
      />
      
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="relative">
          <Header />
          {renderContent()}
          
          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 mt-4">
            <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-3">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Data provided by CoinGecko API • Updated every 5 minutes
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
