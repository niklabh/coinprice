import Header from '@/components/Header';
import TrendingContent from '@/components/trending/TrendingContent';

async function getTrendingData() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=' + process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
    { next: { revalidate: 300 } }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch trending data');
  }

  return response.json();
}

export default async function TrendingPage() {
  const trendingData = await getTrendingData();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="relative">
        <Header />

        {/* Main Content */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold mb-6">Trending on CoinGecko</h1>
          <TrendingContent trendingData={trendingData} />
        </div>
      </div>
    </main>
  );
} 