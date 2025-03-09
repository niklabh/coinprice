import CoinList from '@/components/CoinList';
import Header from '@/components/Header';
import MarketInfo from '@/components/MarketInfo';

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

  return (
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
  );
}
