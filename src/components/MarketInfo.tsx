import React from 'react';

// Type for the global data structure from CoinGecko API
interface GlobalData {
  data: {
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
    markets: number;
  };
}

const MarketInfo = ({ globalData }: { globalData: GlobalData }) => {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000_000) {
      return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  return (
    <div className="w-full rounded-xl bg-white dark:bg-gray-900 shadow-sm p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Cryptocurrency Global Market
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">Market Cap</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {formatNumber(globalData.data.total_market_cap.usd)}
          </span>
          <span className={`text-xs ${globalData.data.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {globalData.data.market_cap_change_percentage_24h_usd >= 0 ? '↑' : '↓'} 
            {formatPercentage(Math.abs(globalData.data.market_cap_change_percentage_24h_usd))} (24h)
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">24h Trading Volume</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {formatNumber(globalData.data.total_volume.usd)}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">BTC Dominance</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {formatPercentage(globalData.data.market_cap_percentage.btc)}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">ETH Dominance</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {formatPercentage(globalData.data.market_cap_percentage.eth)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <span>Active Cryptocurrencies: {globalData.data.active_cryptocurrencies.toLocaleString()}</span>
        <span>Markets: {globalData.data.markets.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default MarketInfo; 