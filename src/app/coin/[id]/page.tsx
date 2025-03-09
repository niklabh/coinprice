import { Metadata } from 'next';
import CoinPageClient from '../CoinPageClient';

// This is a server component that's used for static generation
export async function generateStaticParams() {
  // Pre-render the most popular coins
  const popularCoins = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 'solana', 'dogecoin', 'tron', 'polkadot', 'litecoin'];
  return popularCoins.map((id) => ({
    id,
  }));
}

export const metadata: Metadata = {
  title: 'Coin Details | CoinPrice',
  description: 'Detailed information about cryptocurrencies including price, market cap, and historical data.',
};

// This is the server component that Next.js uses for routing
export default function CoinPageWrapper({ params }: { params: { id: string } }) {
  return <CoinPageClient id={params.id} />;
} 