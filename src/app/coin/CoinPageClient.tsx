'use client';

import { useState, useEffect } from 'react';
import CoinDetail from '@/components/CoinDetail';
import Header from '@/components/Header';

// Define interface for coin data
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

interface CoinPageClientProps {
  id: string;
}

const CoinPageClient = ({ id }: CoinPageClientProps) => {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCoinData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Coin not found');
          }
          throw new Error('Failed to fetch coin data');
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
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="relative">
        <Header />
        
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 pt-4 pb-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading coin data...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-red-500">{error}</p>
            </div>
          ) : coinData ? (
            <CoinDetail coin={coinData} />
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default CoinPageClient; 