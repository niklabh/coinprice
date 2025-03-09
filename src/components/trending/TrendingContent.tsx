'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TabContainer from '../TabContainer';

// Define types based on the API response
interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data: {
      price?: string;
      price_btc: string;
      price_change_percentage_24h: Record<string, number>;
      market_cap?: string;
      market_cap_btc?: string;
      total_volume?: string;
      total_volume_btc?: string;
      sparkline?: string;
      content?: {
        title?: string;
        description?: string;
      } | null;
    };
  };
}

interface TrendingNFT {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  nft_contract_id: number;
  native_currency_symbol: string;
  floor_price_in_native_currency: number;
  floor_price_24h_percentage_change: number;
  data: {
    floor_price: string;
    floor_price_in_usd_24h_percentage_change: string;
    h24_volume: string;
    h24_average_sale_price: string;
    sparkline: string;
    content: null | unknown;
  };
}

interface TrendingCategory {
  id: number;
  name: string;
  market_cap_1h_change: number;
  slug: string;
  coins_count: number;
  data: {
    market_cap: number;
    market_cap_btc: number;
    total_volume: number;
    total_volume_btc: number;
    market_cap_change_percentage_24h: Record<string, number>;
    sparkline: string;
  };
}

interface TrendingData {
  coins: TrendingCoin[];
  nfts: TrendingNFT[];
  categories: TrendingCategory[];
}

interface TrendingContentProps {
  trendingData: TrendingData;
}

const TrendingCoins: React.FC<{ coins: TrendingCoin[] }> = ({ coins }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coins.map((coin) => (
        <Link 
          href={`/coin/${coin.item.id}`} 
          key={coin.item.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src={coin.item.large || '/placeholder.png'}
                alt={coin.item.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{coin.item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{coin.item.symbol}</p>
                </div>
                {coin.item.market_cap_rank && (
                  <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded">
                    Rank #{coin.item.market_cap_rank}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Price (BTC)</p>
              <p className="font-mono">{parseFloat(coin.item.data.price_btc).toFixed(8)}</p>
            </div>
            
            {coin.item.data.price && (
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400">Price (USD)</p>
                <p className="font-mono">{coin.item.data.price}</p>
              </div>
            )}
            
            {coin.item.data.market_cap && (
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                <p className="font-mono">{coin.item.data.market_cap}</p>
              </div>
            )}
            
            {coin.item.data.total_volume && (
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
                <p className="font-mono">{coin.item.data.total_volume}</p>
              </div>
            )}
          </div>
          
          {coin.item.data.content?.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {coin.item.data.content.description}
              </p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

const TrendingNFTs: React.FC<{ nfts: TrendingNFT[] }> = ({ nfts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <div 
          key={nft.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src={nft.thumb || '/placeholder.png'}
                alt={nft.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{nft.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{nft.symbol}</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Floor Price</p>
              <p className="font-mono">{nft.data.floor_price}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">24h Change</p>
              <p className={`font-mono ${nft.floor_price_24h_percentage_change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {nft.floor_price_24h_percentage_change.toFixed(2)}%
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
              <p className="font-mono">{nft.data.h24_volume}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">24h Avg Price</p>
              <p className="font-mono">{nft.data.h24_average_sale_price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TrendingCategories: React.FC<{ categories: TrendingCategory[] }> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div 
          key={category.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div>
            <h3 className="font-medium">{category.name}</h3>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                {category.coins_count} coins
              </span>
              <span className={`text-sm ${category.market_cap_1h_change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                1h: {category.market_cap_1h_change.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
              <p className="font-mono">${category.data.market_cap.toLocaleString()}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">24h Change</p>
              <p className={`font-mono ${category.data.market_cap_change_percentage_24h.usd >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {category.data.market_cap_change_percentage_24h.usd.toFixed(2)}%
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
              <p className="font-mono">${category.data.total_volume.toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TrendingContent: React.FC<TrendingContentProps> = ({ trendingData }) => {
  const tabs = [
    {
      id: 'coins',
      label: 'Coins',
      content: <TrendingCoins coins={trendingData.coins} />
    },
    {
      id: 'nfts',
      label: 'NFTs',
      content: <TrendingNFTs nfts={trendingData.nfts} />
    },
    {
      id: 'categories',
      label: 'Categories',
      content: <TrendingCategories categories={trendingData.categories} />
    }
  ];

  return (
    <div>
      <TabContainer tabs={tabs} />
    </div>
  );
};

export default TrendingContent; 