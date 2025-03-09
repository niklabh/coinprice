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
    <div className="w-full rounded-xl bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 p-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
        <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm mr-3"></span>
        Cryptocurrency Global Market
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="flex flex-col p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm transition-all hover:shadow-md">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Market Cap</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {formatNumber(globalData.data.total_market_cap.usd)}
          </span>
          <span className={`text-xs mt-1 ${globalData.data.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {globalData.data.market_cap_change_percentage_24h_usd >= 0 ? '↑' : '↓'} 
            {formatPercentage(Math.abs(globalData.data.market_cap_change_percentage_24h_usd))} (24h)
          </span>
        </div>
        
        <div className="flex flex-col p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm transition-all hover:shadow-md">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">24h Trading Volume</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {formatNumber(globalData.data.total_volume.usd)}
          </span>
        </div>
        
        <div className="flex flex-col p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm transition-all hover:shadow-md">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">BTC Dominance</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {formatPercentage(globalData.data.market_cap_percentage.btc)}
          </span>
        </div>
        
        <div className="flex flex-col p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm transition-all hover:shadow-md">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">ETH Dominance</span>
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {formatPercentage(globalData.data.market_cap_percentage.eth)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span>Active Cryptocurrencies: {globalData.data.active_cryptocurrencies.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span>Markets: {globalData.data.markets.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MarketInfo; 