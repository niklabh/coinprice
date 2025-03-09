import CoinList from '@/components/CoinList';
import Header from '@/components/Header';
import MarketInfo from '@/components/MarketInfo';
import Script from 'next/script';

async function getCoins() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d&x_cg_demo_api_key=' + process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
    { next: { revalidate: 300 } }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch coins');
  }

  return response.json();
}

async function getGlobalMarketData() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/global?x_cg_demo_api_key=' + process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
    { next: { revalidate: 300 } }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch global market data');
  }

  return response.json();
}

export default async function Home() {
  const [coins, globalData] = await Promise.all([
    getCoins(),
    getGlobalMarketData()
  ]);

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

          {/* Market Info */}
          <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 pt-4">
            <MarketInfo globalData={globalData} />
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
              <CoinList coins={coins} />
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
