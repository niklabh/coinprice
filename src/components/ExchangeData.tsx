import { useState, useEffect } from 'react';

interface Exchange {
  id: string;
  name: string;
  year_established: number;
  country: string;
  description: string;
  url: string;
  image: string;
  has_trading_incentive: boolean;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
}

interface ExchangeDataProps {
  coinId: string;
  coinSymbol: string;
  isActive: boolean;
}

const ExchangeData: React.FC<ExchangeDataProps> = ({ coinId, coinSymbol, isActive }) => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch data when the tab is active
    if (!isActive) return;

    const fetchExchangeData = async () => {
      if (exchanges.length > 0) return; // Skip if we already have data
      
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/exchanges?x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch exchange data');
        }

        const data = await response.json();
        setExchanges(data);
      } catch (err) {
        console.error('Error fetching exchange data:', err);
        setError('Failed to load exchange data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeData();
  }, [isActive, coinId, exchanges.length]);

  // Helper function to generate trading pair URLs
  const getTradingPairUrl = (exchangeId: string, coinSymbol: string, coinId: string) => {
    const symbol = coinSymbol.toUpperCase();
    
    // Different URL patterns for different exchanges
    switch (exchangeId) {
      case 'binance':
        return `https://www.binance.com/en/trade/${symbol}_USDT`;
      case 'bybit':
        return `https://www.bybit.com/en/trade/spot/${symbol}/USDT`;
      case 'coinbase':
        return `https://www.coinbase.com/advanced-trade/${symbol}-USDT`;
      case 'kraken':
        return `https://www.kraken.com/trade/${symbol}USD`;
      case 'kucoin':
        return `https://www.kucoin.com/trade/${symbol}-USDT`;
      case 'bitfinex':
        return `https://trading.bitfinex.com/t/${symbol}:USD`;
      case 'okx':
        return `https://www.okx.com/trade-spot/${symbol.toLowerCase()}-usdt`;
      case 'gate':
      case 'gateio':
        return `https://www.gate.io/trade/${symbol}_USDT`;
      case 'huobi':
      case 'htx':
        return `https://www.htx.com/en-us/trade/${symbol.toLowerCase()}_usdt/`;
      case 'bingx':
        return `https://bingx.com/en-us/spot/${symbol.toLowerCase()}-usdt/`;
      case 'bitget':
        return `https://www.bitget.com/spot/${symbol}USDT`;
      case 'bitmart':
        return `https://www.bitmart.com/trade/en?symbol=${symbol}_USDT`;
      case 'mexc':
        return `https://www.mexc.com/exchange/${symbol}_USDT`;
      case 'whitebit':
        return `https://whitebit.com/trade/${symbol}-USDT`;
      case 'crypto_com':
      case 'cryptocom':
        return `https://crypto.com/exchange/trade/${symbol}_USDT`;
      default:
        // If no specific format known, return exchange homepage
        return exchanges.find(e => e.id === exchangeId)?.url || '#';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => setExchanges([])} // Reset to trigger re-fetch
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Exchanges</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exchange</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trust Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">24h Volume (BTC)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trading Pair</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {exchanges.slice(0, 20).map((exchange) => (
              <tr key={exchange.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {exchange.trust_score_rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={exchange.image} alt={exchange.name} />
                    </div>
                    <div className="ml-4">
                      <a 
                        href={exchange.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {exchange.name}
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {exchange.country || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2"
                    >
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${(exchange.trust_score / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {exchange.trust_score}/10
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {exchange.trade_volume_24h_btc.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <a 
                    href={getTradingPairUrl(exchange.id, coinSymbol, coinId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {coinSymbol.toUpperCase()}/USDT
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Data provided by CoinGecko API</p>
      </div>
    </div>
  );
};

export default ExchangeData; 