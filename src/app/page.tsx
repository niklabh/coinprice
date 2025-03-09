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
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="relative">
        <Header />

        {/* Market Info */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <MarketInfo globalData={globalData} />
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CoinList coins={coins} />
        </div>
      </div>
    </main>
  );
}
