import CoinDetail from '@/components/CoinDetail';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';

async function getCoinData(id: string) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch coin data');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching coin data:', error);
    throw error;
  }
}

export async function generateStaticParams() {
  // Pre-render the most popular coins
  const popularCoins = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano'];
  return popularCoins.map((id) => ({
    id,
  }));
}

const CoinPage = async ({ params }: { params: { id: string } }) => {
  // Ensure params is fully resolved before accessing its properties
  const resolvedParams = await Promise.resolve(params);
  const coinData = await getCoinData(resolvedParams.id);

  const formattedCoin = {
    id: coinData.id,
    symbol: coinData.symbol,
    name: coinData.name,
    image: coinData.image.large,
    current_price: coinData.market_data.current_price.usd,
    market_cap: coinData.market_data.market_cap.usd,
    total_volume: coinData.market_data.total_volume.usd,
    high_24h: coinData.market_data.high_24h.usd,
    low_24h: coinData.market_data.low_24h.usd,
    price_change_percentage_24h: coinData.market_data.price_change_percentage_24h,
    market_cap_rank: coinData.market_cap_rank,
    circulating_supply: coinData.market_data.circulating_supply,
    description: coinData.description,
    links: {
      homepage: coinData.links.homepage,
      blockchain_site: coinData.links.blockchain_site,
      official_forum_url: coinData.links.official_forum_url,
      twitter_screen_name: coinData.links.twitter_screen_name,
      telegram_channel_identifier: coinData.links.telegram_channel_identifier,
      subreddit_url: coinData.links.subreddit_url,
    },
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="relative">
        <Header />
        {/* Main Content */}
        <CoinDetail coin={formattedCoin} />
      </div>
    </main>
  );
};

export default CoinPage; 